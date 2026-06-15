import type { SectionKey } from "@/lib/types/test.types"

export type ReviewAnswerItem = {
  userAnswer: number | null
  correctOptionIndex: number
  topic: string
  subtopic: string
}

export type TopicWeakness = {
  topic: string
  subtopic: string
  wrong: number
  total: number
  accuracyPct: number
}

export type SectionTopicAnalysis = {
  section: SectionKey
  weaknesses: TopicWeakness[]
}

export type TestTopicAnalysis = {
  bySection: SectionTopicAnalysis[]
  overall: TopicWeakness[]
}

function isWrong(item: ReviewAnswerItem): boolean {
  return item.userAnswer !== null && item.userAnswer !== item.correctOptionIndex
}

/**
 * Group wrong answers by topic/subtopic and rank topics that need the most improvement.
 */
export function analyzeTopicWeaknesses(
  sections: Array<{ key: SectionKey; items: ReviewAnswerItem[] }>,
): TestTopicAnalysis {
  const bySection: SectionTopicAnalysis[] = []
  const overallMap = new Map<string, TopicWeakness>()

  for (const section of sections) {
    const bucket = new Map<string, TopicWeakness>()

    for (const item of section.items) {
      const key = `${item.topic}::${item.subtopic}`
      const row = bucket.get(key) ?? {
        topic: item.topic,
        subtopic: item.subtopic,
        wrong: 0,
        total: 0,
        accuracyPct: 0,
      }

      row.total++
      if (isWrong(item)) row.wrong++

      bucket.set(key, row)

      const overall = overallMap.get(key) ?? {
        topic: item.topic,
        subtopic: item.subtopic,
        wrong: 0,
        total: 0,
        accuracyPct: 0,
      }
      overall.total++
      if (isWrong(item)) overall.wrong++
      overallMap.set(key, overall)
    }

    const weaknesses = [...bucket.values()]
      .map((row) => ({
        ...row,
        accuracyPct: row.total > 0 ? Math.round(((row.total - row.wrong) / row.total) * 100) : 0,
      }))
      .filter((row) => row.wrong > 0)
      .sort((a, b) => b.wrong - a.wrong || a.accuracyPct - b.accuracyPct)

    bySection.push({ section: section.key, weaknesses })
  }

  const overall = [...overallMap.values()]
    .map((row) => ({
      ...row,
      accuracyPct: row.total > 0 ? Math.round(((row.total - row.wrong) / row.total) * 100) : 0,
    }))
    .filter((row) => row.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong || a.accuracyPct - b.accuracyPct)

  return { bySection, overall }
}
