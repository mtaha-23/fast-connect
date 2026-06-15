import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/server/auth"
import {
  getCorrectIndicesByQuestionIds,
  getExplanationsByQuestionIds,
  isSectionKey,
} from "@/lib/server/test-session"
import { getTestSessionById, updateTestSession } from "@/lib/server/test-session-store"
import { persistCompletedTestAttempt } from "@/lib/server/test-completion"
import { scoreSection } from "@/lib/services/test.service"
import type { SectionKey, SectionResult } from "@/lib/types/test.types"

export const runtime = "nodejs"

type SubmitSectionBody = {
  answers?: (number | null)[]
  timeSpentSec?: number
}

function sumSectionScores(sectionScores: Partial<Record<SectionKey, SectionResult>>) {
  return Object.values(sectionScores).reduce((sum, s) => sum + (s?.score ?? 0), 0)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string; section: string }> },
) {
  const guard = await requireAuth(req)
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status })
  }

  const { sessionId, section: sectionParam } = await params
  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required." }, { status: 400 })
  }

  if (!isSectionKey(sectionParam)) {
    return NextResponse.json({ error: "Invalid section." }, { status: 400 })
  }

  const section = sectionParam

  try {
    const body = (await req.json().catch(() => null)) as SubmitSectionBody | null
    if (!body || !Array.isArray(body.answers)) {
      return NextResponse.json({ error: "Missing 'answers' array." }, { status: 400 })
    }

    const session = await getTestSessionById(sessionId)
    if (!session) {
      return NextResponse.json({ error: "Test session not found." }, { status: 404 })
    }

    if (session.uid !== guard.uid) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 })
    }

    if (!session.sections.includes(section)) {
      return NextResponse.json({ error: "Section not part of this test session." }, { status: 400 })
    }

    if (session.sectionSubmittedAt[section]) {
      return NextResponse.json({ error: "Section already submitted." }, { status: 409 })
    }

    const questionIds = session.questionIdsBySection[section] ?? []
    if (body.answers.length !== questionIds.length) {
      return NextResponse.json(
        {
          error: `Expected ${questionIds.length} answers for ${section}, received ${body.answers.length}.`,
        },
        { status: 400 },
      )
    }

    const correctIndices = await getCorrectIndicesByQuestionIds(questionIds)
    const result = scoreSection(body.answers, correctIndices, section)
    const explanations = await getExplanationsByQuestionIds(questionIds)

    const now = new Date().toISOString()
    const sectionSubmittedAt = { ...session.sectionSubmittedAt, [section]: now }
    const sectionScores = { ...session.sectionScores, [section]: result }
    const answersBySection = { ...session.answersBySection, [section]: body.answers }

    const allSubmitted = session.sections.every((s) => Boolean(sectionSubmittedAt[s]))
    const totalScore = allSubmitted ? sumSectionScores(sectionScores) : session.totalScore

    const sectionIndex = session.sections.indexOf(section)
    const nextSectionIndex =
      allSubmitted ? sectionIndex : Math.max(session.currentSectionIndex, sectionIndex + 1)

    const updatePayload: Record<string, unknown> = {
      answersBySection,
      sectionScores,
      sectionSubmittedAt,
      currentSectionIndex: nextSectionIndex,
      totalScore,
    }

    if (typeof body.timeSpentSec === "number" && Number.isFinite(body.timeSpentSec)) {
      updatePayload[`sectionTimeSpentSec.${section}`] = Math.max(0, Math.floor(body.timeSpentSec))
    }

    if (allSubmitted) {
      updatePayload.status = "completed"
      updatePayload.completedAt = now
    }

    await updateTestSession(sessionId, updatePayload)

    if (allSubmitted) {
      const completedSession = await getTestSessionById(sessionId)
      if (completedSession) {
        try {
          await persistCompletedTestAttempt(completedSession)
        } catch (persistError) {
          console.error("Failed to persist test attempt record:", persistError)
        }
      }
    }

    return NextResponse.json({
      result,
      explanations,
      sessionCompleted: allSubmitted,
      totalScore: allSubmitted ? totalScore : undefined,
    })
  } catch (error) {
    console.error("POST /api/tests/[sessionId]/sections/[section]/submit error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit section." },
      { status: 500 },
    )
  }
}
