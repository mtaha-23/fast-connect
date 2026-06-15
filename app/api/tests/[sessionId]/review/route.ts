import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/server/auth"
import { computeMaxScore } from "@/lib/server/test-completion"
import { getTestSessionById } from "@/lib/server/test-session-store"
import { analyzeTopicWeaknesses } from "@/lib/services/test-analysis.service"
import { getQuestionsByIds } from "@/lib/services/question.service"
import { toPublicQuestion } from "@/lib/services/question.service"
import type { SectionKey } from "@/lib/types/test.types"

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

    if (session.status !== "completed") {
      return NextResponse.json({ error: "Session is not completed yet." }, { status: 400 })
    }

    const allQuestionIds = session.sections.flatMap((section) => session.questionIdsBySection[section] ?? [])
    const questions = await getQuestionsByIds(allQuestionIds)
    const lookup = new Map(
      questions.map((q) => [
        q.id,
        {
          ...toPublicQuestion(q),
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation,
        },
      ]),
    )

    const sections = session.sections.map((key) => {
      const questionIds = session.questionIdsBySection[key] ?? []
      const answers = session.answersBySection[key] ?? []

      const items = questionIds.map((id, index) => {
        const q = lookup.get(id)
        return {
          question: q
            ? {
                id: q.id,
                section: q.section,
                topic: q.topic,
                subtopic: q.subtopic,
                difficulty: q.difficulty,
                questionText: q.questionText,
                options: q.options,
                tags: q.tags,
              }
            : null,
          userAnswer: answers[index] ?? null,
          correctOptionIndex: q?.correctOptionIndex ?? -1,
          explanation: q?.explanation ?? "",
          topic: q?.topic ?? "Unknown",
          subtopic: q?.subtopic ?? "",
        }
      })

      return {
        key,
        items,
        score: session.sectionScores[key] ?? null,
      }
    })

    const topicAnalysis = analyzeTopicWeaknesses(
      sections.map((section) => ({
        key: section.key as SectionKey,
        items: section.items.map((item) => ({
          userAnswer: item.userAnswer,
          correctOptionIndex: item.correctOptionIndex,
          topic: item.topic,
          subtopic: item.subtopic,
        })),
      })),
    )

    const maxScore = computeMaxScore(session.sections)

    return NextResponse.json({
      sessionId,
      mode: session.mode,
      sectionsIncluded: session.sections,
      totalScore: session.totalScore,
      maxScore,
      sections,
      topicAnalysis,
      completedAt: session.completedAt,
    })
  } catch (error) {
    console.error("GET /api/tests/[sessionId]/review error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load review." },
      { status: 500 },
    )
  }
}
