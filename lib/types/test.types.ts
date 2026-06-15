/**
 * FAST Test Practice — shared types and section configuration
 */

export type SectionKey = "advanced_maths" | "basic_maths" | "iq" | "english"

export type TestMode = "full" | "section"

export type TestSessionStatus = "in_progress" | "completed" | "abandoned"

export type QuestionDifficulty = "easy" | "medium" | "hard"

export type QuestionStatus = "approved" | "pending_review" | "rejected"

export type QuestionSourceType = "ai_generated" | "past_paper" | "manual"

export interface SectionConfig {
  questions: number
  durationSec: number
  maxMarks: number
  markPerCorrect: number
  negativePerWrong: number
}

export const SECTION_CONFIG: Record<SectionKey, SectionConfig> = {
  advanced_maths: {
    questions: 50,
    durationSec: 50 * 60,
    maxMarks: 50,
    markPerCorrect: 1,
    negativePerWrong: 0.25,
  },
  basic_maths: {
    questions: 20,
    durationSec: 20 * 60,
    maxMarks: 20,
    markPerCorrect: 1,
    negativePerWrong: 0.25,
  },
  iq: {
    questions: 20,
    durationSec: 20 * 60,
    maxMarks: 20,
    markPerCorrect: 1,
    negativePerWrong: 0.25,
  },
  english: {
    questions: 30,
    durationSec: 30 * 60,
    maxMarks: 10,
    markPerCorrect: 10 / 30,
    negativePerWrong: 0.083,
  },
}

export const FULL_TEST_SECTIONS: SectionKey[] = [
  "advanced_maths",
  "basic_maths",
  "iq",
  "english",
]

export interface QuestionSource {
  type: QuestionSourceType
  reference?: string
  confidence?: number
}

export interface Question {
  id: string
  section: SectionKey
  topic: string
  subtopic: string
  difficulty: QuestionDifficulty
  questionText: string
  options: string[]
  correctOptionIndex: number
  explanation: string
  source: QuestionSource
  status: QuestionStatus
  tags: string[]
  createdAt: string
  updatedAt: string
}

/** Question payload safe to send to the client (no answer key). */
export interface PublicQuestion {
  id: string
  section: SectionKey
  topic: string
  subtopic: string
  difficulty: QuestionDifficulty
  questionText: string
  options: string[]
  tags: string[]
}

export interface SectionResult {
  score: number
  correct: number
  wrong: number
  unanswered: number
  maxMarks: number
}

export interface TestSession {
  id?: string
  uid: string
  mode: TestMode
  sections: SectionKey[]
  currentSectionIndex: number
  status: TestSessionStatus
  questionIdsBySection: Partial<Record<SectionKey, string[]>>
  answersBySection: Partial<Record<SectionKey, (number | null)[]>>
  sectionStartedAt: Partial<Record<SectionKey, string>>
  sectionSubmittedAt: Partial<Record<SectionKey, string>>
  sectionScores: Partial<Record<SectionKey, SectionResult>>
  totalScore: number
  createdAt: string
  completedAt: string | null
}

export interface AssembledSection {
  key: SectionKey
  durationSec: number
  maxMarks: number
  questions: PublicQuestion[]
}

export interface AssembledTest {
  mode: TestMode
  sections: AssembledSection[]
  questionIdsBySection: Partial<Record<SectionKey, string[]>>
}
