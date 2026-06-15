import topicsData from "@/test-backend/data/topics.json"
import type { SectionKey } from "@/lib/types/test.types"

export type TopicEntry = {
  topic: string
  subtopics: string[]
  questionCount: number
  questionType?: string
  format?: "plain" | "formatted"
}

export type TopicSamplingPlanItem = {
  topic: string
  count: number
}

export function getSectionTopics(section: SectionKey): TopicEntry[] {
  const sectionData = topicsData.sections[section as keyof typeof topicsData.sections]
  return (sectionData?.topics ?? []) as TopicEntry[]
}

export function getIqPrimaryTopics(): string[] {
  return topicsData.iqQuestionTypes.map((row) => row.topic)
}

/**
 * Distribute `totalNeeded` questions across topics proportionally to bank size.
 * Uses largest-remainder method and respects per-topic availability caps.
 */
export function buildProportionalTopicPlan(
  topics: TopicEntry[],
  totalNeeded: number,
  priorityTopics?: string[],
): TopicSamplingPlanItem[] {
  if (totalNeeded <= 0) return []

  let pool = topics.filter((topic) => topic.questionCount > 0)

  if (priorityTopics?.length) {
    const prioritized = pool.filter((topic) => priorityTopics.includes(topic.topic))
    if (prioritized.length > 0) {
      pool = prioritized
    }
  }

  if (pool.length === 0) return []

  const totalAvailable = pool.reduce((sum, topic) => sum + topic.questionCount, 0)
  const allocations = pool.map((topic) => ({
    topic: topic.topic,
    exact: (topic.questionCount / totalAvailable) * totalNeeded,
    count: 0,
    max: topic.questionCount,
  }))

  let assigned = 0
  for (const row of allocations) {
    row.count = Math.min(Math.floor(row.exact), row.max)
    assigned += row.count
  }

  let remainder = totalNeeded - assigned
  const byFraction = [...allocations].sort((a, b) => (b.exact % 1) - (a.exact % 1))

  while (remainder > 0) {
    let progressed = false
    for (const row of byFraction) {
      if (remainder <= 0) break
      if (row.count < row.max) {
        row.count++
        remainder--
        progressed = true
      }
    }
    if (!progressed) break
  }

  return allocations.filter((row) => row.count > 0).map((row) => ({ topic: row.topic, count: row.count }))
}

export function buildSectionSamplingPlan(section: SectionKey, totalNeeded: number): TopicSamplingPlanItem[] {
  const topics = getSectionTopics(section)
  const priorityTopics = section === "iq" ? getIqPrimaryTopics() : undefined
  return buildProportionalTopicPlan(topics, totalNeeded, priorityTopics)
}
