import { describe, expect, it } from "vitest"
import { analyzeTopicWeaknesses } from "@/lib/services/test-analysis.service"

describe("analyzeTopicWeaknesses", () => {
  it("groups wrong answers by topic and ranks weaknesses", () => {
    const analysis = analyzeTopicWeaknesses([
      {
        key: "advanced_maths",
        items: [
          { userAnswer: 0, correctOptionIndex: 0, topic: "Calculus", subtopic: "Limits" },
          { userAnswer: 1, correctOptionIndex: 0, topic: "Calculus", subtopic: "Limits" },
          { userAnswer: 2, correctOptionIndex: 2, topic: "Algebra", subtopic: "Quadratics" },
        ],
      },
    ])

    expect(analysis.overall).toHaveLength(1)
    expect(analysis.overall[0].topic).toBe("Calculus")
    expect(analysis.overall[0].wrong).toBe(1)
    expect(analysis.overall[0].total).toBe(2)
    expect(analysis.bySection[0].weaknesses[0].topic).toBe("Calculus")
  })

  it("ignores unanswered questions in weakness list", () => {
    const analysis = analyzeTopicWeaknesses([
      {
        key: "english",
        items: [{ userAnswer: null, correctOptionIndex: 1, topic: "Grammar", subtopic: "Tenses" }],
      },
    ])

    expect(analysis.overall).toHaveLength(0)
  })
})
