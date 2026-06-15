import { describe, expect, it } from "vitest"
import { normalizeBankQuestions, resolveQuestionBankSection } from "@/lib/utils/question-section"
import type { Question } from "@/lib/types/test.types"

function makeQuestion(overrides: Partial<Question>): Question {
  return {
    id: "q1",
    section: "advanced_maths",
    topic: "calculus",
    subtopic: "limits",
    difficulty: "medium",
    questionText: "Sample?",
    options: ["A", "B", "C", "D"],
    correctOptionIndex: 0,
    explanation: "Because.",
    source: { type: "manual" },
    status: "approved",
    tags: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  }
}

describe("resolveQuestionBankSection", () => {
  it("maps legacy mathematics to advanced_maths", () => {
    const resolved = resolveQuestionBankSection(
      makeQuestion({ section: "mathematics", topic: "Number System" }),
      "advanced_maths",
    )
    expect(resolved?.section).toBe("advanced_maths")
  })

  it("splits iq_and_basic_math between basic_maths and iq by topic", () => {
    const basic = resolveQuestionBankSection(
      makeQuestion({ section: "iq_and_basic_math", topic: "basic_math" }),
      "basic_maths",
    )
    const iq = resolveQuestionBankSection(
      makeQuestion({ section: "iq_and_basic_math", topic: "pattern_recognition" }),
      "iq",
    )

    expect(basic?.section).toBe("basic_maths")
    expect(iq?.section).toBe("iq")
  })
})

describe("normalizeBankQuestions", () => {
  it("includes all approved rows from a bank file regardless of legacy section field", () => {
    const rows = normalizeBankQuestions(
      [
        makeQuestion({ id: "a", section: "advanced_maths" }),
        makeQuestion({ id: "b", section: "mathematics" }),
        makeQuestion({ id: "c", section: "mathematics", status: "pending_review" }),
      ],
      "advanced_maths",
    )

    expect(rows).toHaveLength(2)
    expect(rows.every((row) => row.section === "advanced_maths")).toBe(true)
  })
})
