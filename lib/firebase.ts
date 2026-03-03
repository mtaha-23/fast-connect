/**
 * Firebase Configuration Module
 * Handles Firebase initialization and provides singleton instances
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"

// Singleton instances to prevent multiple initializations
let firebaseApp: FirebaseApp | null = null
let firebaseAuth: Auth | null = null
let firebaseFirestore: Firestore | null = null
let firebaseStorage: FirebaseStorage | null = null
let googleProvider: GoogleAuthProvider | null = null

/**
 * Get or initialize Firebase App instance
 * @returns Firebase App instance
 */
export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    if (!config.apiKey) {
      throw new Error("Missing Firebase configuration. Please check your .env.local file.")
    }

    if (!getApps().length) {
      firebaseApp = initializeApp(config)
    } else {
      firebaseApp = getApps()[0]!
    }
  }

  return firebaseApp
}

/**
 * Get or initialize Firebase Auth instance
 * @returns Firebase Auth instance
 */
export function getFirebaseAuth(): Auth {
  if (!firebaseAuth) {
    const app = getFirebaseApp()
    firebaseAuth = getAuth(app)
  }

  return firebaseAuth
}

/**
 * Get or initialize Google Auth Provider instance
 * @returns Google Auth Provider instance
 */
export function getGoogleProvider(): GoogleAuthProvider {
  if (!googleProvider) {
    googleProvider = new GoogleAuthProvider()
  }
  return googleProvider
}

/**
 * Get or initialize Firestore database instance
 * @returns Firestore database instance
 */
export function getFirestoreDB(): Firestore {
  if (!firebaseFirestore) {
    const app = getFirebaseApp()
    firebaseFirestore = getFirestore(app)
  }
  return firebaseFirestore
}

/**
 * Get or initialize Firebase Storage instance
 * @returns Firebase Storage instance
 */
export function getFirebaseStorage(): FirebaseStorage {
  if (!firebaseStorage) {
    const app = getFirebaseApp()
    firebaseStorage = getStorage(app)
  }
  return firebaseStorage
}
