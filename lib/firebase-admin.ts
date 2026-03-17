/**
 * Firebase Admin initialization (server-only).
 *
 * Env options (choose one):
 * - FIREBASE_ADMIN_CREDENTIALS: JSON string (service account)
 * - FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY
 * - GOOGLE_APPLICATION_CREDENTIALS: path (handled by firebase-admin automatically)
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

export function getFirebaseAdminApp() {
  const existing = admin.apps[0]
  if (existing) return existing

  const credential = getCredentialFromEnv()

  if (credential) {
    return admin.initializeApp({ credential })
  }

  // Falls back to Application Default Credentials (e.g. GOOGLE_APPLICATION_CREDENTIALS).
  return admin.initializeApp()
}

export function getAdminAuth() {
  return getFirebaseAdminApp().auth()
}

export function getAdminDB() {
  return getFirebaseAdminApp().firestore()
}

