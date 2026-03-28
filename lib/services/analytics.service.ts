import { addDoc, collection, Timestamp } from "firebase/firestore"
import { getFirestoreDB } from "@/lib/firebase"

export type AnalyticsEventType =
  | "user.deactivated"
  | "user.reactivated"
  | "user.deleted"
  | "user.role_changed"
  | "resource.created"
  | "resource.updated"
  | "resource.deleted"
  | "resource.downloaded"
  | "test.submitted"

export type AnalyticsEvent = {
  type: AnalyticsEventType
  actorUid?: string
  actorEmail?: string
  targetUid?: string
  targetId?: string
  meta?: Record<string, unknown>
  createdAt: Timestamp
}

export async function logAnalyticsEvent(event: Omit<AnalyticsEvent, "createdAt">) {
  const db = getFirestoreDB()
  await addDoc(collection(db, "analyticsEvents"), {
    ...event,
    createdAt: Timestamp.now(),
  })
}

