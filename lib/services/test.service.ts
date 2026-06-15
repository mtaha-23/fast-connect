/**
 * Test Service
 * Test assembly, section scoring, and session persistence.
 */

import { addDoc, collection } from "firebase/firestore"
import { getFirestoreDB } from "@/lib/firebase"
import { getQuestionsBySection } from "@/lib/services/question.service"
import type {
  AssembledTest,
  SectionKey,
  SectionResult,
  TestMode,
  TestSession,
} from "@/lib/types/test.types"
import { SECTION_CONFIG } from "@/lib/types/test.types"

/**
 * Score a single section using FAST negative-marking rules.
 * Floors section score at 0.
 */
export function scoreSection(
  answers: (number | null)[],
  correctIndices: number[],
  section: SectionKey,
): SectionResult {
  const cfg = SECTION_CONFIG[section]
  let score = 0
  let correct = 0
  let wrong = 0
  let unanswered = 0

  const total = Math.min(answers.length, correctIndices.length)

  for (let i = 0; i < total; i++) {
    const answer = answers[i]
    const correctIndex = correctIndices[i]

    if (answer === null) {
      unanswered++
      continue
    }

    if (answer === correctIndex) {
      correct++
      score += cfg.markPerCorrect
    } else {
      wrong++
      score -= cfg.negativePerWrong
    }
  }

  unanswered += Math.max(0, correctIndices.length - total)

  return {
    score: Math.max(0, score),
    correct,
    wrong,
    unanswered,
    maxMarks: cfg.maxMarks,
  }
}

/**
 * Assemble a test by sampling approved questions for each requested section.
 */
export async function assembleTest(mode: TestMode, sections: SectionKey[]): Promise<AssembledTest> {
  const questionIdsBySection: Partial<Record<SectionKey, string[]>> = {}
  const assembledSections: AssembledTest["sections"] = []

  for (const section of sections) {
    const cfg = SECTION_CONFIG[section]
    const questions = await getQuestionsBySection(section, cfg.questions)

    if (questions.length < cfg.questions) {
      throw new Error(
        `Not enough approved questions for "${section}": need ${cfg.questions}, found ${questions.length}.`,
      )
    }

    questionIdsBySection[section] = questions.map((q) => q.id)
    assembledSections.push({
      key: section,
      durationSec: cfg.durationSec,
      maxMarks: cfg.maxMarks,
      questions,
    })
  }

  return {
    mode,
    sections: assembledSections,
    questionIdsBySection,
  }
}

/**
 * Convenience wrapper around getQuestionsBySection for arbitrary section practice counts.
 */
export async function getSectionPracticeQuestions(section: SectionKey, count: number) {
  return getQuestionsBySection(section, count)
}

/**
 * Persist a new in-progress test session to Firestore.
 */
export async function createTestSession(
  uid: string,
  mode: TestMode,
  sections: SectionKey[],
  questionIdsBySection: Partial<Record<SectionKey, string[]>>,
): Promise<TestSession> {
  const now = new Date().toISOString()

  const answersBySection: Partial<Record<SectionKey, (number | null)[]>> = {}
  for (const section of sections) {
    const ids = questionIdsBySection[section] ?? []
    answersBySection[section] = new Array(ids.length).fill(null)
  }

  const session: Omit<TestSession, "id"> = {
    uid,
    mode,
    sections,
    currentSectionIndex: 0,
    status: "in_progress",
    questionIdsBySection,
    answersBySection,
    sectionStartedAt: {},
    sectionSubmittedAt: {},
    sectionScores: {},
    totalScore: 0,
    createdAt: now,
    completedAt: null,
  }

  const db = getFirestoreDB()
  const ref = await addDoc(collection(db, "testSessions"), session)

  return {
    id: ref.id,
    ...session,
  }
}
