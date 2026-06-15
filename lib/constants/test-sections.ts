import type { SectionKey } from "@/lib/types/test.types"

export const SECTION_LABELS: Record<SectionKey, string> = {
  advanced_maths: "Advanced Mathematics",
  basic_maths: "Basic Mathematics",
  iq: "IQ & Analytical",
  english: "English",
}

export const SECTION_NEGATIVE_MARKING: Record<SectionKey, string> = {
  advanced_maths: "−0.25 per wrong answer",
  basic_maths: "−0.25 per wrong answer",
  iq: "−0.25 per wrong answer",
  english: "−0.083 per wrong answer",
}

export function sectionStartStorageKey(sessionId: string, section: SectionKey) {
  return `fast-test-${sessionId}-${section}-startedAt`
}

export function readSectionStartTime(sessionId: string, section: SectionKey): number | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(sectionStartStorageKey(sessionId, section))
  return stored ? Number(stored) : null
}

export function getSectionRemainingSeconds(
  sessionId: string,
  section: SectionKey,
  durationSec: number,
): number {
  const startedAt = readSectionStartTime(sessionId, section)
  if (!startedAt) return durationSec

  const elapsed = Math.floor((Date.now() - startedAt) / 1000)
  return Math.max(0, durationSec - elapsed)
}

export function markSectionStarted(sessionId: string, section: SectionKey) {
  if (typeof window === "undefined") return
  localStorage.setItem(sectionStartStorageKey(sessionId, section), String(Date.now()))
}

export function clearSectionTimer(sessionId: string, section: SectionKey) {
  if (typeof window === "undefined") return
  localStorage.removeItem(sectionStartStorageKey(sessionId, section))
}

export function getSectionTimeSpentSec(sessionId: string, section: SectionKey, durationSec: number) {
  const startedAt = readSectionStartTime(sessionId, section)
  if (!startedAt) return 0
  const elapsed = Math.floor((Date.now() - startedAt) / 1000)
  return Math.min(durationSec, Math.max(0, elapsed))
}
