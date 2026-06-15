import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/server/auth"
import { getTestSessionById } from "@/lib/server/test-session-store"
import { hydrateSessionQuestions } from "@/lib/server/test-session"

export const runtime = "nodejs"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const guard = await requireAuth(req)
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status })
  }

  const { sessionId } = await params
  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required." }, { status: 400 })
  }

  try {
    const session = await getTestSessionById(sessionId)
    if (!session) {
      return NextResponse.json({ error: "Test session not found." }, { status: 404 })
    }

    if (session.uid !== guard.uid) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 })
    }

    const sectionQuestions = await hydrateSessionQuestions(session)

    return NextResponse.json({
      session: {
        id: session.id,
        uid: session.uid,
        mode: session.mode,
        sections: session.sections,
        currentSectionIndex: session.currentSectionIndex,
        status: session.status,
        answersBySection: session.answersBySection,
        sectionStartedAt: session.sectionStartedAt,
        sectionSubmittedAt: session.sectionSubmittedAt,
        sectionScores: session.sectionScores,
        totalScore: session.totalScore,
        createdAt: session.createdAt,
        completedAt: session.completedAt,
      },
      sectionQuestions,
    })
  } catch (error) {
    console.error("GET /api/tests/[sessionId] error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load test session." },
      { status: 500 },
    )
  }
}
