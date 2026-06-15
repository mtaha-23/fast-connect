import { describe, expect, it } from "vitest"
import { scoreSection } from "@/lib/services/test.service"
import { SECTION_CONFIG } from "@/lib/types/test.types"

describe("scoreSection", () => {
  it("scores advanced_maths: 40 correct, 8 wrong, 2 unanswered → 38", () => {
    const total = 50
    const correctIndex = 0
    const correctIndices = Array(total).fill(correctIndex)

    const answers: (number | null)[] = [
      ...Array(40).fill(correctIndex),
      ...Array(8).fill(1),
      ...Array(2).fill(null),
    ]

    const result = scoreSection(answers, correctIndices, "advanced_maths")

    expect(result.correct).toBe(40)
    expect(result.wrong).toBe(8)
    expect(result.unanswered).toBe(2)
    expect(result.score).toBe(38)
    expect(result.maxMarks).toBe(SECTION_CONFIG.advanced_maths.maxMarks)
  })

  it("scores english: 20 correct, 5 wrong, 5 unanswered with fractional marks", () => {
    const total = 30
    const correctIndex = 2
    const correctIndices = Array(total).fill(correctIndex)

    const answers: (number | null)[] = [
      ...Array(20).fill(correctIndex),
      ...Array(5).fill(0),
      ...Array(5).fill(null),
    ]

    const result = scoreSection(answers, correctIndices, "english")
    const expected =
      20 * SECTION_CONFIG.english.markPerCorrect - 5 * SECTION_CONFIG.english.negativePerWrong

    expect(result.correct).toBe(20)
    expect(result.wrong).toBe(5)
    expect(result.unanswered).toBe(5)
    expect(result.score).toBeCloseTo(expected, 3)
    expect(result.score).toBeCloseTo(6.252, 2)
  })

  it("floors score at 0 when all answers are wrong", () => {
    const correctIndices = [0, 0, 0, 0, 0]
    const answers = [1, 1, 1, 1, 1]

    const result = scoreSection(answers, correctIndices, "advanced_maths")

    expect(result.wrong).toBe(5)
    expect(result.correct).toBe(0)
    expect(result.score).toBe(0)
  })

  it("does not penalize null (unanswered) answers", () => {
    const correctIndices = [0, 1, 2, 3, 0]
    const answers: (number | null)[] = [null, null, null, null, null]

    const result = scoreSection(answers, correctIndices, "basic_maths")

    expect(result.unanswered).toBe(5)
    expect(result.correct).toBe(0)
    expect(result.wrong).toBe(0)
    expect(result.score).toBe(0)
  })
})
