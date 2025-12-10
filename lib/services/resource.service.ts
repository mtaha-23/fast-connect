/**
 * Resource Service
 * Handles all resource-related business logic
 */

import { collection, query, orderBy, getDocs, doc, getDoc, updateDoc, deleteDoc, addDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDB } from "@/lib/firebase"

export interface Resource {
  id: string
  title: string
  type: "Past Paper" | "Study Guide" | "Notes" | "Practice Set" | "Official Document"
  category: "Entry Test" | "Mathematics" | "English" | "CS" | "Analytical" | "General"
  subject: string
  date: string
  size: string
  icon: string // Icon name as string (e.g., "FileText", "Calculator")
  color: string // Tailwind color class (e.g., "bg-blue-500")
  fileUrl?: string // URL to the actual file
  createdAt: Timestamp
  updatedAt: Timestamp
}

/**
 * Get all resources, sorted by latest first
 */
export async function getAllResources(): Promise<Resource[]> {
  try {
    const db = getFirestoreDB()
    const resourcesRef = collection(db, "resources")
    
    // Query resources ordered by createdAt descending
    const q = query(resourcesRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    
    const resources: Resource[] = []
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data()
      const createdAt = data.createdAt || Timestamp.now()
      resources.push({
        id: docSnapshot.id,
        title: data.title,
        type: data.type,
        category: data.category,
        subject: data.subject,
        date: data.date,
        downloads: data.downloads || 0,
        size: data.size,
        icon: data.icon || "FileText",
        color: data.color || "bg-blue-500",
        fileUrl: data.fileUrl,
        createdAt: createdAt,
        updatedAt: data.updatedAt || createdAt,
      })
    })
    
    return resources
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch resources."
    )
  }
}

/**
 * Get a single resource by ID
 */
export async function getResourceById(resourceId: string): Promise<Resource | null> {
  try {
    const db = getFirestoreDB()
    const resourceRef = doc(db, "resources", resourceId)
    const resourceDoc = await getDoc(resourceRef)
    
    if (!resourceDoc.exists()) {
      return null
    }
    
    const data = resourceDoc.data()
    const createdAt = data.createdAt || Timestamp.now()
    
    return {
      id: resourceDoc.id,
      title: data.title,
      type: data.type,
      category: data.category,
      subject: data.subject,
      date: data.date,
      size: data.size,
      icon: data.icon || "FileText",
      color: data.color || "bg-blue-500",
      fileUrl: data.fileUrl,
      createdAt: createdAt,
      updatedAt: data.updatedAt || createdAt,
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch resource."
    )
  }
}

/**
 * Create a new resource
 */
export async function createResource(data: {
  title: string
  type: "Past Paper" | "Study Guide" | "Notes" | "Practice Set" | "Official Document"
  category: "Entry Test" | "Mathematics" | "English" | "CS" | "Analytical" | "General"
  subject: string
  date: string
  size: string
  icon?: string
  color?: string
  fileUrl?: string
}): Promise<string> {
  try {
    const db = getFirestoreDB()
    const resourcesRef = collection(db, "resources")
    
    const resourceData = {
      title: data.title,
      type: data.type,
      category: data.category,
      subject: data.subject,
      date: data.date,
      size: data.size,
      icon: data.icon || "FileText",
      color: data.color || "bg-blue-500",
      fileUrl: data.fileUrl || null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    
    const docRef = await addDoc(resourcesRef, resourceData)
    return docRef.id
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create resource."
    )
  }
}

/**
 * Update an existing resource
 */
export async function updateResource(
  resourceId: string,
  data: {
    title?: string
    type?: "Past Paper" | "Study Guide" | "Notes" | "Practice Set" | "Official Document"
    category?: "Entry Test" | "Mathematics" | "English" | "CS" | "Analytical" | "General"
    subject?: string
    date?: string
    size?: string
    icon?: string
    color?: string
    fileUrl?: string
  }
): Promise<void> {
  try {
    const db = getFirestoreDB()
    const resourceRef = doc(db, "resources", resourceId)
    const resourceDoc = await getDoc(resourceRef)
    
    if (!resourceDoc.exists()) {
      throw new Error("Resource not found")
    }
    
    const updateData: any = {
      updatedAt: Timestamp.now(),
    }
    
    if (data.title !== undefined) updateData.title = data.title
    if (data.type !== undefined) updateData.type = data.type
    if (data.category !== undefined) updateData.category = data.category
    if (data.subject !== undefined) updateData.subject = data.subject
    if (data.date !== undefined) updateData.date = data.date
    if (data.size !== undefined) updateData.size = data.size
    if (data.icon !== undefined) updateData.icon = data.icon
    if (data.color !== undefined) updateData.color = data.color
    if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl || null
    
    await updateDoc(resourceRef, updateData)
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to update resource."
    )
  }
}

/**
 * Delete a resource
 */
export async function deleteResource(resourceId: string): Promise<void> {
  try {
    const db = getFirestoreDB()
    const resourceRef = doc(db, "resources", resourceId)
    const resourceDoc = await getDoc(resourceRef)
    
    if (!resourceDoc.exists()) {
      throw new Error("Resource not found")
    }
    
    await deleteDoc(resourceRef)
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete resource."
    )
  }
}

