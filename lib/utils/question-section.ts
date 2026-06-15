import type { Question, SectionKey } from "@/lib/types/test.types"

/**
 * Legacy section values found in older question bank JSON exports.
 * The bank filename is the source of truth — section is normalized on import/load.
 */
export const LEGACY_SECTION_VALUES: Record<SectionKey, string[]> = {
  advanced_maths: ["mathematics"],
  basic_maths: ["iq_and_basic_math"],
  iq: ["iq_and_basic_math"],
  english: [],
}

/**
 * Map a question to the requested FAST section, or null if it does not belong.
 */
export function resolveQuestionBankSection(question: Question, bankSection: SectionKey): Question | null {
  if (question.status !== "approved") return null

  if (question.section === bankSection) {
    return { ...question, section: bankSection }
  }

  if (question.section === "mathematics" && bankSection === "advanced_maths") {
    return { ...question, section: "advanced_maths" }
  }

  if (question.section === "iq_and_basic_math") {
    if (bankSection === "basic_maths" && question.topic === "basic_math") {
      return { ...question, section: "basic_maths" }
    }
    if (bankSection === "iq" && question.topic !== "basic_math") {
      return { ...question, section: "iq" }
    }
    return null
  }

  if (LEGACY_SECTION_VALUES[bankSection].includes(question.section)) {
    return { ...question, section: bankSection }
  }

  return null
}

/**
 * Approved questions from a section bank file, with section normalized to the bank key.
 */
export function normalizeBankQuestions(questions: Question[], bankSection: SectionKey): Question[] {
  return questions
    .map((q) => resolveQuestionBankSection(q, bankSection))
    .filter((q): q is Question => q !== null)
}

export function firestoreSectionQueryValues(section: SectionKey): string[] {
  return [section, ...LEGACY_SECTION_VALUES[section]]
}
