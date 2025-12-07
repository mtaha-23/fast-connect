"use client"

/**
 * Auth Hook
 * Provides authentication state management
 */

import { useState, useEffect } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { getFirebaseAuth } from "@/lib/firebase"
import { getUserData, type UserData } from "@/lib/services/auth.service"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getFirebaseAuth()
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      
      // Fetch user data from Firestore if user is logged in
      if (firebaseUser) {
        try {
          const data = await getUserData(firebaseUser.uid)
          setUserData(data)
        } catch (error) {
          console.error("Failed to fetch user data:", error)
          setUserData(null)
        }
      } else {
        setUserData(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, userData, loading }
}

