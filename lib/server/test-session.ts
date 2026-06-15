import "server-only"

import {
  getCorrectIndicesByQuestionIds,
  loadApprovedQuestionsBySection,
  toPublicQuestion,
} from "@/lib/services/question.service"
import type { PublicQuestion, SectionKey, TestSession } from "@/lib/types/test.types"
import { FULL_TEST_SECTIONS } from "@/lib/types/test.types"

export function isSectionKey(value: string): value is SectionKey {
  return (FULL_TEST_SECTIONS as string[]).includes(value)
}

export function mapTestSessionDoc(id: string, data: Record<string, unknown>): TestSession {
  return {
    id,
    uid: String(data.uid ?? ""),
    mode: data.mode === "section" ? "section" : "full",
    sections: Array.isArray(data.sections) ? (data.sections as SectionKey[]) : [],
    currentSectionIndex: Number(data.currentSectionIndex ?? 0),
    status: data.status === "completed" || data.status === "abandoned" ? data.status : "in_progress",
    questionIdsBySection: (data.questionIdsBySection as TestSession["questionIdsBySection"]) ?? {},
    answersBySection: (data.answersBySection as TestSession["answersBySection"]) ?? {},
    sectionStartedAt: (data.sectionStartedAt as TestSession["sectionStartedAt"]) ?? {},
    sectionSubmittedAt: (data.sectionSubmittedAt as TestSession["sectionSubmittedAt"]) ?? {},
    sectionScores: (data.sectionScores as TestSession["sectionScores"]) ?? {},
    totalScore: Number(data.totalScore ?? 0),
    createdAt: String(data.createdAt ?? ""),
    completedAt: data.completedAt ? String(data.completedAt) : null,
  }
}

async function buildQuestionLookup(ids: string[]) {
  const idSet = new Set(ids)
  const byId = new Map<string, { public: PublicQuestion; explanation: string }>()

  for (const section of FULL_TEST_SECTIONS) {
    const questions = await loadApprovedQuestionsBySection(section)
    for (const q of questions) {
      if (idSet.has(q.id)) {
        byId.set(q.id, { public: toPublicQuestion(q), explanation: q.explanation })
      }
    }
  }

  return byId
}

export async function hydrateSessionQuestions(session: TestSession) {
  const sections: {
    key: SectionKey
    questionIds: string[]
    questions: PublicQuestion[]
  }[] = []

  for (const section of session.sections) {
    const questionIds = session.questionIdsBySection[section] ?? []
    const lookup = await buildQuestionLookup(questionIds)
    const questions = questionIds
      .map((id) => lookup.get(id)?.public)
      .filter((q): q is PublicQuestion => q !== undefined)

    sections.push({ key: section, questionIds, questions })
  }

  return sections
}

export async function getExplanationsByQuestionIds(questionIds: string[]) {
  const lookup = await buildQuestionLookup(questionIds)
  return questionIds.map((questionId) => ({
    questionId,
    explanation: lookup.get(questionId)?.explanation ?? "",
  }))
}

export { getCorrectIndicesByQuestionIds }
