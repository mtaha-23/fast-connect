/**
 * Firebase Admin initialization (server-only).
 *
 * For API routes that use Firestore/Auth Admin (e.g. role changes), you need:
 * - FIREBASE_ADMIN_CREDENTIALS: full service account JSON as one line, OR
 * - FIREBASE_ADMIN_PROJECT_ID + FIREBASE_ADMIN_CLIENT_EMAIL + FIREBASE_ADMIN_PRIVATE_KEY
 *
 * Project ID also falls back to NEXT_PUBLIC_FIREBASE_PROJECT_ID so Firestore can resolve the project.
 * Without service account credentials, use GOOGLE_APPLICATION_CREDENTIALS or `gcloud auth application-default login`.
 */
import "server-only"

import * as admin from "firebase-admin"

function getCredentialFromEnv() {
  const json = process.env.FIREBASE_ADMIN_CREDENTIALS
  if (json) {
    const parsed = JSON.parse(json) as {
      project_id: string
      client_email: string
      private_key: string
    }
    return admin.credential.cert({
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key,
    })
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY

  if (projectId && clientEmail && privateKey) {
    return admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    })
  }

  return undefined
}

/** Project ID for Admin SDK (Firestore / Auth). Required for Firestore; falls back to client config. */
function resolveAdminProjectId(): string | undefined {
  const fromServiceAccountJson = (): string | undefined => {
    const raw = process.env.FIREBASE_ADMIN_CREDENTIALS
    if (!raw) return undefined
    try {
      const parsed = JSON.parse(raw) as { project_id?: string }
      return typeof parsed.project_id === "string" ? parsed.project_id : undefined
    } catch {
      return undefined
    }
  }

  return (
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    fromServiceAccountJson() ||
    undefined
  )
}

export function getFirebaseAdminApp() {
  const existing = admin.apps[0]
  if (existing) return existing

  const projectId = resolveAdminProjectId()
  const credential = getCredentialFromEnv()

  if (credential) {
    return admin.initializeApp({
      credential,
      ...(projectId ? { projectId } : {}),
    })
  }

  if (projectId) {
    // Uses Application Default Credentials (e.g. GOOGLE_APPLICATION_CREDENTIALS or gcloud ADC).
    // For local dev without ADC, add FIREBASE_ADMIN_CREDENTIALS or the three FIREBASE_ADMIN_* vars above.
    return admin.initializeApp({ projectId })
  }

  return admin.initializeApp()
}

export function getAdminAuth() {
  return getFirebaseAdminApp().auth()
}

export function getAdminDB() {
  return getFirebaseAdminApp().firestore()
}

