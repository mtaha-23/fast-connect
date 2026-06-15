import "server-only"

import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { getFirestoreDB } from "@/lib/firebase"
import { mapTestSessionDoc } from "@/lib/server/test-session"
import type { SectionKey, SectionResult, TestMode, TestSession } from "@/lib/types/test.types"

export async function getTestSessionById(sessionId: string): Promise<TestSession | null> {
  const db = getFirestoreDB()
  const snap = await getDoc(doc(db, "testSessions", sessionId))
  if (!snap.exists()) return null
  return mapTestSessionDoc(snap.id, snap.data() as Record<string, unknown>)
}

export async function updateTestSession(sessionId: string, data: Record<string, unknown>) {
  const db = getFirestoreDB()
  await updateDoc(doc(db, "testSessions", sessionId), data)
}

export type TestAttemptRecord = {
  uid: string
  sessionId: string
  mode: TestMode
  sections: SectionKey[]
  totalScore: number
  maxScore: number
  sectionScores: Partial<Record<SectionKey, SectionResult>>
  weakTopics: Array<{ topic: string; subtopic: string; wrong: number; total: number }>
  completedAt: string
  createdAt: string
}

export async function listCompletedSessionsForUser(uid: string, limit = 30): Promise<TestSession[]> {
  const db = getFirestoreDB()
  const q = query(collection(db, "testSessions"), where("uid", "==", uid), where("status", "==", "completed"))
  const snap = await getDocs(q)

  const sessions = snap.docs.map((docSnap) =>
    mapTestSessionDoc(docSnap.id, docSnap.data() as Record<string, unknown>),
  )

  return sessions
    .sort((a, b) => {
      const aTime = Date.parse(a.completedAt ?? a.createdAt)
      const bTime = Date.parse(b.completedAt ?? b.createdAt)
      return bTime - aTime
    })
    .slice(0, limit)
}

export async function saveTestAttemptRecord(record: TestAttemptRecord) {
  const db = getFirestoreDB()
  await addDoc(collection(db, "testAttempts"), record)
}
