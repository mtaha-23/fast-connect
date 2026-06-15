import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/server/auth"
import { isSectionKey } from "@/lib/server/test-session"
import { assembleTest, createTestSession } from "@/lib/services/test.service"
import type { SectionKey, TestMode } from "@/lib/types/test.types"
import { FULL_TEST_SECTIONS } from "@/lib/types/test.types"

export const runtime = "nodejs"

type StartTestBody = {
  mode?: TestMode
  sections?: string[]
}

function normalizeSections(mode: TestMode, sections: string[] | undefined): SectionKey[] | null {
  if (mode === "full") {
    return [...FULL_TEST_SECTIONS]
  }

  if (!sections || sections.length === 0) {
    return null
  }

  const normalized: SectionKey[] = []
  for (const section of sections) {
    if (!isSectionKey(section)) return null
    if (!normalized.includes(section)) {
      normalized.push(section)
    }
  }

  return normalized.length > 0 ? normalized : null
}

export async function POST(req: NextRequest) {
  const guard = await requireAuth(req)
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status })
  }

  try {
    const body = (await req.json().catch(() => null)) as StartTestBody | null
    const mode = body?.mode

    if (mode !== "full" && mode !== "section") {
      return NextResponse.json({ error: "Invalid mode. Use 'full' or 'section'." }, { status: 400 })
    }

    const sections = normalizeSections(mode, body?.sections)
    if (!sections) {
      return NextResponse.json(
        { error: mode === "section" ? "Provide at least one valid section." : "Invalid sections." },
        { status: 400 },
      )
    }

    const assembled = await assembleTest(mode, sections)
    const session = await createTestSession(guard.uid, mode, sections, assembled.questionIdsBySection)

    return NextResponse.json(
      {
        sessionId: session.id,
        mode: session.mode,
        sections: session.sections,
        assembledSections: assembled.sections,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("POST /api/tests/start error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to start test." },
      { status: 500 },
    )
  }
}
