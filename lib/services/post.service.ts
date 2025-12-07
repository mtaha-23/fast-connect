/**
 * Post Service
 * Handles all post-related business logic
 */

import { collection, query, orderBy, getDocs, doc, getDoc, updateDoc, deleteDoc, addDoc, arrayUnion, arrayRemove, Timestamp } from "firebase/firestore"
import { getFirestoreDB } from "@/lib/firebase"

export interface PostAuthor {
  name: string
  role: string
  avatar?: string
  uid: string
}

export interface Post {
  id: string
  author: PostAuthor
  content: string
  image?: string
  timestamp: string
  createdAt: Timestamp
  likes: number
  likedBy: string[] // Array of user UIDs who liked the post
  comments: number
  isPinned?: boolean
  type: "announcement" | "event" | "news" | "update"
}

/**
 * Get all posts, sorted by latest first (pinned posts at top)
 */
export async function getAllPosts(): Promise<Post[]> {
  try {
    const db = getFirestoreDB()
    const postsRef = collection(db, "posts")
    
    // Query posts ordered by createdAt descending
    const q = query(postsRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    
    const posts: Post[] = []
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data()
      const createdAt = data.createdAt || Timestamp.now()
      posts.push({
        id: docSnapshot.id,
        author: data.author,
        content: data.content,
        image: data.image,
        timestamp: formatTimestamp(createdAt),
        createdAt: createdAt,
        likes: data.likes || 0,
        likedBy: data.likedBy || [],
        comments: data.comments || 0,
        isPinned: data.isPinned || false,
        type: data.type || "announcement",
      })
    })
    
    // Sort: pinned posts first, then by createdAt
    posts.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return b.createdAt.toMillis() - a.createdAt.toMillis()
    })
    
    return posts
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch posts."
    )
  }
}

/**
 * Toggle like on a post
 */
export async function togglePostLike(postId: string, userId: string): Promise<{ likes: number; isLiked: boolean }> {
  try {
    const db = getFirestoreDB()
    const postRef = doc(db, "posts", postId)
    const postDoc = await getDoc(postRef)
    
    if (!postDoc.exists()) {
      throw new Error("Post not found")
    }
    
    const data = postDoc.data()
    const likedBy = data.likedBy || []
    const isLiked = likedBy.includes(userId)
    
    if (isLiked) {
      // Unlike: remove user from array and decrement count
      await updateDoc(postRef, {
        likedBy: arrayRemove(userId),
        likes: Math.max(0, (data.likes || 0) - 1),
      })
      return {
        likes: Math.max(0, (data.likes || 0) - 1),
        isLiked: false,
      }
    } else {
      // Like: add user to array and increment count
      await updateDoc(postRef, {
        likedBy: arrayUnion(userId),
        likes: (data.likes || 0) + 1,
      })
      return {
        likes: (data.likes || 0) + 1,
        isLiked: true,
      }
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to toggle like."
    )
  }
}

/**
 * Create a new post
 */
export async function createPost(data: {
  author: PostAuthor
  content: string
  image?: string
  type: "announcement" | "event" | "news" | "update"
  isPinned?: boolean
}): Promise<string> {
  try {
    const db = getFirestoreDB()
    const postsRef = collection(db, "posts")
    
    const postData = {
      author: data.author,
      content: data.content,
      image: data.image || null,
      type: data.type,
      isPinned: data.isPinned || false,
      likes: 0,
      likedBy: [],
      comments: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    
    const docRef = await addDoc(postsRef, postData)
    return docRef.id
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create post."
    )
  }
}

/**
 * Update an existing post
 */
export async function updatePost(
  postId: string,
  data: {
    content?: string
    image?: string
    type?: "announcement" | "event" | "news" | "update"
    isPinned?: boolean
  }
): Promise<void> {
  try {
    const db = getFirestoreDB()
    const postRef = doc(db, "posts", postId)
    const postDoc = await getDoc(postRef)
    
    if (!postDoc.exists()) {
      throw new Error("Post not found")
    }
    
    const updateData: any = {
      updatedAt: Timestamp.now(),
    }
    
    if (data.content !== undefined) updateData.content = data.content
    if (data.image !== undefined) updateData.image = data.image || null
    if (data.type !== undefined) updateData.type = data.type
    if (data.isPinned !== undefined) updateData.isPinned = data.isPinned
    
    await updateDoc(postRef, updateData)
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to update post."
    )
  }
}

/**
 * Delete a post
 */
export async function deletePost(postId: string): Promise<void> {
  try {
    const db = getFirestoreDB()
    const postRef = doc(db, "posts", postId)
    const postDoc = await getDoc(postRef)
    
    if (!postDoc.exists()) {
      throw new Error("Post not found")
    }
    
    await deleteDoc(postRef)
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete post."
    )
  }
}

/**
 * Get a single post by ID
 */
export async function getPostById(postId: string): Promise<Post | null> {
  try {
    const db = getFirestoreDB()
    const postRef = doc(db, "posts", postId)
    const postDoc = await getDoc(postRef)
    
    if (!postDoc.exists()) {
      return null
    }
    
    const data = postDoc.data()
    const createdAt = data.createdAt || Timestamp.now()
    
    return {
      id: postDoc.id,
      author: data.author,
      content: data.content,
      image: data.image,
      timestamp: formatTimestamp(createdAt),
      createdAt: createdAt,
      likes: data.likes || 0,
      likedBy: data.likedBy || [],
      comments: data.comments || 0,
      isPinned: data.isPinned || false,
      type: data.type || "announcement",
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch post."
    )
  }
}

/**
 * Format Firestore timestamp to relative time string
 */
function formatTimestamp(timestamp: Timestamp): string {
  const now = new Date()
  const postDate = timestamp.toDate()
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? "day" : "days"} ago`
  } else {
    return postDate.toLocaleDateString()
  }
}

