import { NextRequest, NextResponse } from "next/server"
import { doc, serverTimestamp, writeBatch } from "firebase/firestore"
import { getFirestoreDB } from "@/lib/firebase"
import { loadQuestionBankFromDisk } from "@/lib/server/question-bank-loader"
import { requireAdminAccess } from "@/lib/server/require-admin-access"
import { isSectionKey } from "@/lib/server/test-session"
import { FULL_TEST_SECTIONS, type SectionKey } from "@/lib/types/test.types"

export const runtime = "nodejs"

type ImportBody = {
  sections?: string[]
}

const BATCH_SIZE = 450

export async function POST(req: NextRequest) {
  const guard = await requireAdminAccess(req)
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status })
  }

  try {
    const body = (await req.json().catch(() => null)) as ImportBody | null
    const requested = body?.sections?.length ? body.sections : [...FULL_TEST_SECTIONS]

    const sections: SectionKey[] = []
    for (const section of requested) {
      if (!isSectionKey(section)) {
        return NextResponse.json({ error: `Invalid section: ${section}` }, { status: 400 })
      }
      if (!sections.includes(section)) sections.push(section)
    }

    const db = getFirestoreDB()
    const perSection = {
      advanced_maths: 0,
      basic_maths: 0,
      iq: 0,
      english: 0,
    } satisfies Record<SectionKey, number>

    let uploaded = 0
    const errors: string[] = []

    for (const section of sections) {
      const approved = await loadQuestionBankFromDisk(section)

      for (let i = 0; i < approved.length; i += BATCH_SIZE) {
        const chunk = approved.slice(i, i + BATCH_SIZE)
        const batch = writeBatch(db)

        for (const q of chunk) {
          const normalized = { ...q, section }
          batch.set(doc(db, "questionBank", q.id), normalized, { merge: true })
        }

        try {
          await batch.commit()
          uploaded += chunk.length
          perSection[section] += chunk.length
        } catch (batchError) {
          const message = batchError instanceof Error ? batchError.message : "Batch commit failed."
          errors.push(`${section} batch ${Math.floor(i / BATCH_SIZE) + 1}: ${message}`)
        }
      }
    }

    const runRef = doc(db, "importRuns", `${guard.uid}-${Date.now()}`)
    const runBatch = writeBatch(db)
    runBatch.set(runRef, {
      uid: guard.uid,
      type: "questionBankImport",
      sections,
      uploaded,
      perSection,
      errors,
      createdAt: serverTimestamp(),
    })
    await runBatch.commit()

    return NextResponse.json({
      uploaded,
      perSection,
      errors,
      message:
        errors.length > 0
          ? `Imported ${uploaded} questions with ${errors.length} batch error(s).`
          : `Successfully imported ${uploaded} questions.`,
    })
  } catch (error) {
    console.error("POST /api/admin/questions/import error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Import failed." },
      { status: 500 },
    )
  }
}

export async function GET(req: NextRequest) {
  const guard = await requireAdminAccess(req)
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status })
  }

  try {
    const counts: Record<SectionKey, { inFile: number }> = {
      advanced_maths: { inFile: 0 },
      basic_maths: { inFile: 0 },
      iq: { inFile: 0 },
      english: { inFile: 0 },
    }

    for (const section of FULL_TEST_SECTIONS) {
      const rows = await loadQuestionBankFromDisk(section)
      counts[section].inFile = rows.length
    }

    return NextResponse.json({ counts })
  } catch (error) {
    console.error("GET /api/admin/questions/import error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to read question banks." },
      { status: 500 },
    )
  }
}
