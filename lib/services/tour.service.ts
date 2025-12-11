/**
 * Tour Service
 * Handles all tour location-related business logic
 */

import { collection, query, orderBy, getDocs, Timestamp } from "firebase/firestore"
import { getFirestoreDB } from "@/lib/firebase"

export interface TourLocation {
  id: string
  name: string
  description: string
  image: string
  icon: string // Icon name as string (e.g., "Building", "BookOpen", "Utensils")
  order?: number // Optional order field for custom sorting
  createdAt: Timestamp
  updatedAt: Timestamp
}

/**
 * Get all tour locations, sorted by order (if available) or by createdAt
 */
export async function getAllTourLocations(): Promise<TourLocation[]> {
  try {
    const db = getFirestoreDB()
    const locationsRef = collection(db, "tourLocations")
    
    // Query locations ordered by order field (if exists), then by createdAt
    const q = query(locationsRef, orderBy("order", "asc"))
    const querySnapshot = await getDocs(q)
    
    const locations: TourLocation[] = []
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data()
      const createdAt = data.createdAt || Timestamp.now()
      locations.push({
        id: docSnapshot.id,
        name: data.name,
        description: data.description,
        image: data.image,
        icon: data.icon || "MapPin",
        order: data.order || 0,
        createdAt: createdAt,
        updatedAt: data.updatedAt || createdAt,
      })
    })
    
    // If no locations have order field, sort by createdAt
    if (locations.every(loc => loc.order === 0 || !loc.order)) {
      locations.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis())
    }
    
    return locations
  } catch (error) {
    // If orderBy fails (e.g., no order field), try without it
    try {
      const db = getFirestoreDB()
      const locationsRef = collection(db, "tourLocations")
      const querySnapshot = await getDocs(locationsRef)
      
      const locations: TourLocation[] = []
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data()
        const createdAt = data.createdAt || Timestamp.now()
        locations.push({
          id: docSnapshot.id,
          name: data.name,
          description: data.description,
          image: data.image,
          icon: data.icon || "MapPin",
          order: data.order || 0,
          createdAt: createdAt,
          updatedAt: data.updatedAt || createdAt,
        })
      })
      
      // Sort by order if available, otherwise by createdAt
      locations.sort((a, b) => {
        if (a.order && b.order) {
          return a.order - b.order
        }
        return a.createdAt.toMillis() - b.createdAt.toMillis()
      })
      
      return locations
    } catch (fallbackError) {
      throw new Error(
        fallbackError instanceof Error ? fallbackError.message : "Failed to fetch tour locations."
      )
    }
  }
}

