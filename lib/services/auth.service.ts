/**
 * Authentication Service
 * Handles all authentication-related business logic
 */

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signOut,
  sendEmailVerification,
  type User
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { getFirebaseAuth, getGoogleProvider, getFirestoreDB } from "@/lib/firebase"

export type UserRole = "admin" | "student"

export interface SignupData {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface LoginData {
  email: string
  password: string
}

export interface UserData {
  uid: string
  name: string
  email: string
  emailVerified: boolean
  role: UserRole
  photoURL?: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Create a new user account with email and password
 */
export async function signUpWithEmail(data: SignupData): Promise<{ user: User; userData: UserData }> {
  try {
    const auth = getFirebaseAuth()
    const credential = await createUserWithEmailAndPassword(auth, data.email, data.password)
    const user = credential.user

    // Save user data to Firestore
    const db = getFirestoreDB()
    const userData: UserData = {
      uid: user.uid,
      name: data.name,
      email: data.email,
      emailVerified: false,
      role: data.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await setDoc(doc(db, "users", user.uid), userData)

    // Send verification email
    await sendEmailVerification(user)

    return { user, userData }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create account. Please try again."
    )
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(data: LoginData): Promise<{ user: User; emailVerified: boolean; role: UserRole }> {
  try {
    const auth = getFirebaseAuth()
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password)
    const user = userCredential.user

    // Fetch user role from Firestore
    const db = getFirestoreDB()
    const userDoc = await getDoc(doc(db, "users", user.uid))
    const userData = userDoc.exists() ? (userDoc.data() as UserData) : null
    const role = userData?.role || "student" // Default to student if role not found

    return {
      user,
      emailVerified: user.emailVerified,
      role,
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to sign in. Please check your credentials and try again."
    )
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(name?: string): Promise<{ user: User; userData: UserData; role: UserRole }> {
  try {
    const auth = getFirebaseAuth()
    const provider = getGoogleProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    // Save or update user data in Firestore
    const db = getFirestoreDB()
    
    // Check if user already exists to preserve their role
    const existingUserDoc = await getDoc(doc(db, "users", user.uid))
    const existingRole = existingUserDoc.exists() ? (existingUserDoc.data() as UserData).role : "student"
    
    const userData: UserData = {
      uid: user.uid,
      name: user.displayName || name || "User",
      email: user.email || "",
      emailVerified: user.emailVerified,
      role: existingRole, // Preserve existing role or default to student
      photoURL: user.photoURL || null,
      createdAt: existingUserDoc.exists() ? (existingUserDoc.data() as UserData).createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await setDoc(doc(db, "users", user.uid), userData, { merge: true })

    return { user, userData, role: existingRole }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Google sign-in failed. Please try again."
    )
  }
}

/**
 * Resend email verification
 */
export async function resendEmailVerification(email: string, password: string): Promise<void> {
  try {
    const auth = getFirebaseAuth()
    // Sign in temporarily to get the user
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    if (!user.emailVerified) {
      await sendEmailVerification(user)
    }

    // Sign out after sending email
    await signOut(auth)
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to resend verification email. Please try again."
    )
  }
}

/**
 * Sign out the current user
 */
export async function signOutUser(): Promise<void> {
  try {
    const auth = getFirebaseAuth()
    await signOut(auth)
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to sign out. Please try again."
    )
  }
}

/**
 * Get user data from Firestore
 */
export async function getUserData(uid: string): Promise<UserData | null> {
  try {
    const db = getFirestoreDB()
    const userDoc = await getDoc(doc(db, "users", uid))
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData
    }
    
    return null
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch user data."
    )
  }
}

