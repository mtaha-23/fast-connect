/**
 * Question Service
 * Loads approved questions from Firestore (with dev JSON fallback) and samples by section.
 */

import { collection, getDocs, query, where } from "firebase/firestore"
import { buildSectionSamplingPlan, type TopicSamplingPlanItem } from "@/lib/constants/test-topics"
import { getFirestoreDB } from "@/lib/firebase"
import { firestoreSectionQueryValues, normalizeBankQuestions, resolveQuestionBankSection } from "@/lib/utils/question-section"
import type { PublicQuestion, Question, SectionKey } from "@/lib/types/test.types"

const QUESTION_BANK_DIR = ["test-backend", "data", "question_bank"] as const

function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development"
}

export function toPublicQuestion(question: Question): PublicQuestion {
  const { correctOptionIndex: _correct, explanation: _explanation, source: _source, status: _status, createdAt: _createdAt, updatedAt: _updatedAt, ...publicFields } = question
  return publicFields
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Sample questions with round-robin topic diversity, then shuffle the final set.
 */
export function sampleQuestionsWithTopicDiversity(questions: Question[], count: number): Question[] {
  if (count <= 0) return []
  if (questions.length <= count) return shuffle(questions)

  const byTopic = new Map<string, Question[]>()
  for (const q of questions) {
    const bucket = byTopic.get(q.topic) ?? []
    bucket.push(q)
    byTopic.set(q.topic, shuffle(bucket))
  }

  const topics = shuffle([...byTopic.keys()])
  const selected: Question[] = []
  const selectedIds = new Set<string>()

  while (selected.length < count && topics.length > 0) {
    let pickedThisRound = false

    for (const topic of topics) {
      if (selected.length >= count) break

      const pool = byTopic.get(topic) ?? []
      const next = pool.find((q) => !selectedIds.has(q.id))
      if (!next) continue

      selected.push(next)
      selectedIds.add(next.id)
      pickedThisRound = true
    }

    if (!pickedThisRound) break
  }

  if (selected.length < count) {
    const remaining = shuffle(questions.filter((q) => !selectedIds.has(q.id)))
    for (const q of remaining) {
      if (selected.length >= count) break
      selected.push(q)
      selectedIds.add(q.id)
    }
  }

  return shuffle(selected)
}

/**
 * Pick questions according to a topic plan (exact topic string match).
 */
export function pickQuestionsByPlan(
  questions: Question[],
  section: SectionKey,
  plan: TopicSamplingPlanItem[],
  excludeIds: Set<string> = new Set(),
): Question[] {
  const selected: Question[] = []
  const selectedIds = new Set(excludeIds)

  for (const item of plan) {
    const pool = questions.filter(
      (q) =>
        q.section === section &&
        q.status === "approved" &&
        q.topic === item.topic &&
        !selectedIds.has(q.id),
    )

    const picked = shuffle(pool).slice(0, item.count)
    for (const question of picked) {
      selected.push(question)
      selectedIds.add(question.id)
    }
  }

  return selected
}

/**
 * Sample a section using topics.json proportions, then fill any gap with topic-diverse picks.
 */
export function sampleQuestionsForSection(questions: Question[], section: SectionKey, count: number): Question[] {
  const approved = questions.filter((q) => q.section === section && q.status === "approved")
  if (approved.length <= count) return shuffle(approved)

  const plan = buildSectionSamplingPlan(section, count)
  let selected = pickQuestionsByPlan(approved, section, plan)

  if (selected.length < count) {
    const selectedIds = new Set(selected.map((q) => q.id))
    const remaining = approved.filter((q) => !selectedIds.has(q.id))
    const filler = sampleQuestionsWithTopicDiversity(remaining, count - selected.length)
    selected = [...selected, ...filler]
  }

  return shuffle(selected).slice(0, count)
}

function mapFirestoreDoc(id: string, data: Record<string, unknown>): Question {
  return {
    id,
    section: data.section as SectionKey,
    topic: String(data.topic ?? ""),
    subtopic: String(data.subtopic ?? ""),
    difficulty: data.difficulty as Question["difficulty"],
    questionText: String(data.questionText ?? ""),
    options: Array.isArray(data.options) ? data.options.map(String) : [],
    correctOptionIndex: Number(data.correctOptionIndex ?? 0),
    explanation: String(data.explanation ?? ""),
    source: (data.source as Question["source"]) ?? { type: "manual" },
    status: (data.status as Question["status"]) ?? "pending_review",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    createdAt: String(data.createdAt ?? new Date().toISOString()),
    updatedAt: String(data.updatedAt ?? new Date().toISOString()),
  }
}

async function loadLocalQuestionBank(section: SectionKey): Promise<Question[]> {
  if (typeof window !== "undefined") return []

  const fs = await import("fs/promises")
  const path = await import("path")
  const filePath = path.join(process.cwd(), ...QUESTION_BANK_DIR, `${section}.json`)

  try {
    const raw = await fs.readFile(filePath, "utf-8")
    const parsed = JSON.parse(raw) as Question[]
    return normalizeBankQuestions(parsed, section)
  } catch {
    return []
  }
}

/**
 * Load all approved questions for a section (Firestore first, JSON fallback in development).
 */
export async function loadApprovedQuestionsBySection(section: SectionKey): Promise<Question[]> {
  try {
    const db = getFirestoreDB()
    const sectionValues = firestoreSectionQueryValues(section)
    const q = query(
      collection(db, "questionBank"),
      where("section", "in", sectionValues),
      where("status", "==", "approved"),
    )
    const snap = await getDocs(q)

    if (!snap.empty) {
      return snap.docs
        .map((docSnap) => mapFirestoreDoc(docSnap.id, docSnap.data() as Record<string, unknown>))
        .map((question) => resolveQuestionBankSection(question, section))
        .filter((question): question is Question => question !== null)
    }
  } catch (error) {
    if (!isDevelopment()) {
      throw new Error(
        error instanceof Error ? error.message : `Failed to load questions for ${section}.`,
      )
    }
  }

  if (isDevelopment()) {
    const local = await loadLocalQuestionBank(section)
    if (local.length > 0) return local
  }

  return []
}

/**
 * Get a random sample of approved questions for a section.
 * Never exposes correctOptionIndex — returns PublicQuestion[] only.
 */
export async function getQuestionsBySection(section: SectionKey, count: number): Promise<PublicQuestion[]> {
  const approved = await loadApprovedQuestionsBySection(section)
  const sampled = sampleQuestionsForSection(approved, section, count)
  return sampled.map(toPublicQuestion)
}

/**
 * Load approved questions by document id (Firestore first, JSON fallback in development).
 */
export async function getQuestionsByIds(questionIds: string[]): Promise<Question[]> {
  if (questionIds.length === 0) return []

  const idSet = new Set(questionIds)
  const byId = new Map<string, Question>()

  const sections: SectionKey[] = ["advanced_maths", "basic_maths", "iq", "english"]
  for (const section of sections) {
    const questions = await loadApprovedQuestionsBySection(section)
    for (const q of questions) {
      if (idSet.has(q.id)) byId.set(q.id, q)
    }
    if (byId.size >= idSet.size) break
  }

  return questionIds.map((id) => byId.get(id)).filter((q): q is Question => q !== undefined)
}

/**
 * Resolve correct option indices for scoring (server-side only).
 */
export async function getCorrectIndicesByQuestionIds(questionIds: string[]): Promise<number[]> {
  if (questionIds.length === 0) return []

  const idSet = new Set(questionIds)
  const byId = new Map<string, number>()

  const sections: SectionKey[] = ["advanced_maths", "basic_maths", "iq", "english"]
  for (const section of sections) {
    const questions = await loadApprovedQuestionsBySection(section)
    for (const q of questions) {
      if (idSet.has(q.id)) {
        byId.set(q.id, q.correctOptionIndex)
      }
    }
  }

  return questionIds.map((id) => byId.get(id) ?? -1)
}
