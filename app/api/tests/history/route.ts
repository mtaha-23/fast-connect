import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/server/auth"
import { computeMaxScore } from "@/lib/server/test-completion"
import { listCompletedSessionsForUser } from "@/lib/server/test-session-store"
import { SECTION_LABELS } from "@/lib/constants/test-sections"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const guard = await requireAuth(req)
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status })
  }

  try {
    const sessions = await listCompletedSessionsForUser(guard.uid)

    const attempts = sessions.map((session) => {
      const maxScore = computeMaxScore(session.sections)
      const label =
        session.mode === "full"
          ? "Full Mock Test"
          : session.sections.length === 1
            ? `${SECTION_LABELS[session.sections[0]]} Practice`
            : "Section Practice"

      return {
        sessionId: session.id,
        mode: session.mode,
        sections: session.sections,
        label,
        totalScore: session.totalScore,
        maxScore,
        sectionScores: session.sectionScores,
        completedAt: session.completedAt,
        createdAt: session.createdAt,
      }
    })

    return NextResponse.json({ attempts })
  } catch (error) {
    console.error("GET /api/tests/history error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load test history." },
      { status: 500 },
    )
  }
}
