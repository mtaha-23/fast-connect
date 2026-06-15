import { describe, expect, it } from "vitest"
import { buildProportionalTopicPlan, buildSectionSamplingPlan } from "@/lib/constants/test-topics"
import { pickQuestionsByPlan, sampleQuestionsForSection } from "@/lib/services/question.service"
import type { Question } from "@/lib/types/test.types"

function makeQuestion(id: string, section: Question["section"], topic: string): Question {
  return {
    id,
    section,
    topic,
    subtopic: "test",
    difficulty: "easy",
    questionText: `Question ${id}`,
    options: ["A", "B", "C", "D"],
    correctOptionIndex: 0,
    explanation: "test",
    source: { type: "manual" },
    status: "approved",
    tags: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  }
}

describe("topic-based sampling", () => {
  it("builds a proportional plan that sums to the requested count", () => {
    const plan = buildProportionalTopicPlan(
      [
        { topic: "number_series", subtopics: [], questionCount: 21 },
        { topic: "letter_series", subtopics: [], questionCount: 21 },
        { topic: "logical_reasoning", subtopics: [], questionCount: 24 },
      ],
      20,
    )

    const total = plan.reduce((sum, row) => sum + row.count, 0)
    expect(total).toBe(20)
    expect(plan.every((row) => row.count > 0)).toBe(true)
  })

  it("prioritizes IQ primary topics for IQ section plans", () => {
    const plan = buildSectionSamplingPlan("iq", 20)
    const topics = plan.map((row) => row.topic)
    expect(topics).toContain("number_series")
    expect(topics).not.toContain("series")
  })

  it("picks only from the requested topic", () => {
    const questions = [
      makeQuestion("iq-1", "iq", "number_series"),
      makeQuestion("iq-2", "iq", "number_series"),
      makeQuestion("iq-3", "iq", "letter_series"),
    ]

    const picked = pickQuestionsByPlan(questions, "iq", [{ topic: "number_series", count: 2 }])
    expect(picked).toHaveLength(2)
    expect(picked.every((q) => q.topic === "number_series")).toBe(true)
  })

  it("samples the requested section count using topic plan + fallback", () => {
    const questions = Array.from({ length: 30 }, (_, index) =>
      makeQuestion(
        `iq-${index}`,
        "iq",
        index % 2 === 0 ? "number_series" : "letter_series",
      ),
    )

    const sampled = sampleQuestionsForSection(questions, "iq", 20)
    expect(sampled).toHaveLength(20)
    expect(new Set(sampled.map((q) => q.id)).size).toBe(20)
  })
})
