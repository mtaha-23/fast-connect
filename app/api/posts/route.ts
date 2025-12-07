import { NextRequest, NextResponse } from "next/server"
import { getAllPosts } from "@/lib/services/post.service"

/**
 * GET /api/posts
 * Fetch all posts and announcements
 */
export async function GET(request: NextRequest) {
  try {
    const posts = await getAllPosts()
    
    // Serialize Firestore Timestamps to ISO strings for JSON response
    const serializedPosts = posts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toDate().toISOString(),
    }))
    
    return NextResponse.json({ posts: serializedPosts }, { status: 200 })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch posts" },
      { status: 500 }
    )
  }
}

