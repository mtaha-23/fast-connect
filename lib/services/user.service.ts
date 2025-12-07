/**
 * User Service
 * Handles user-related database operations
 */

import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { getFirestoreDB } from "@/lib/firebase"

export interface UserProfile {
  uid: string
  name: string
  email: string
  emailVerified: boolean
  photoURL?: string | null
  createdAt: string
  updatedAt: string
  // Add more user fields as needed
  bio?: string
  phone?: string
  address?: string
}

/**
 * Get user profile by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const db = getFirestoreDB()
    const userDoc = await getDoc(doc(db, "users", uid))
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    }
    
    return null
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch user profile."
    )
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    const db = getFirestoreDB()
    const userRef = doc(db, "users", uid)
    
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to update user profile."
    )
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  try {
    const db = getFirestoreDB()
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("email", "==", email))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0]!.data() as UserProfile
    }
    
    return null
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to find user."
    )
  }
}

