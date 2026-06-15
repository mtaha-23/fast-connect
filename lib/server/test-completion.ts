import "server-only"

import { analyzeTopicWeaknesses } from "@/lib/services/test-analysis.service"
import { getQuestionsByIds } from "@/lib/services/question.service"
import { saveTestAttemptRecord } from "@/lib/server/test-session-store"
import type { TestSession } from "@/lib/types/test.types"
import { SECTION_CONFIG } from "@/lib/types/test.types"

export function computeMaxScore(sections: TestSession["sections"]) {
  return sections.reduce((sum, key) => sum + SECTION_CONFIG[key].maxMarks, 0)
}

export async function persistCompletedTestAttempt(session: TestSession) {
  if (!session.id) return

  const allQuestionIds = session.sections.flatMap((section) => session.questionIdsBySection[section] ?? [])
  const questions = await getQuestionsByIds(allQuestionIds)
  const questionById = new Map(questions.map((q) => [q.id, q]))

  const reviewSections = session.sections.map((key) => {
    const questionIds = session.questionIdsBySection[key] ?? []
    const answers = session.answersBySection[key] ?? []

    const items = questionIds.map((id, index) => {
      const q = questionById.get(id)
      const userAnswer = answers[index] ?? null
      return {
        userAnswer,
        correctOptionIndex: q?.correctOptionIndex ?? -1,
        topic: q?.topic ?? "Unknown",
        subtopic: q?.subtopic ?? "",
      }
    })

    return { key, items }
  })

  const topicAnalysis = analyzeTopicWeaknesses(reviewSections)
  const maxScore = computeMaxScore(session.sections)
  const now = session.completedAt ?? new Date().toISOString()

  await saveTestAttemptRecord({
    uid: session.uid,
    sessionId: session.id,
    mode: session.mode,
    sections: session.sections,
    totalScore: session.totalScore,
    maxScore,
    sectionScores: session.sectionScores,
    weakTopics: topicAnalysis.overall.slice(0, 10).map((row) => ({
      topic: row.topic,
      subtopic: row.subtopic,
      wrong: row.wrong,
      total: row.total,
    })),
    completedAt: now,
    createdAt: now,
  })
}
