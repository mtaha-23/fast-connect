import "server-only"

import type { Question, SectionKey } from "@/lib/types/test.types"
import { normalizeBankQuestions } from "@/lib/utils/question-section"

const QUESTION_BANK_DIR = ["test-backend", "data", "question_bank"] as const

export async function loadQuestionBankFromDisk(section: SectionKey): Promise<Question[]> {
  const fs = await import("fs/promises")
  const path = await import("path")
  const filePath = path.join(process.cwd(), ...QUESTION_BANK_DIR, `${section}.json`)

  const raw = await fs.readFile(filePath, "utf-8")
  const parsed = JSON.parse(raw) as Question[]

  if (!Array.isArray(parsed)) {
    throw new Error(`${section}.json must contain a JSON array.`)
  }

  return normalizeBankQuestions(parsed, section)
}
