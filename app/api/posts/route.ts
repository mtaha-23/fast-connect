import { NextRequest, NextResponse } from "next/server"
import { getAllPosts, createPost } from "@/lib/services/post.service"

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

/**
 * POST /api/posts
 * Create a new post
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.author || !body.content || !body.type) {
      return NextResponse.json(
        { error: "Author, content, and type are required" },
        { status: 400 }
      )
    }
    
    const postId = await createPost({
      author: body.author,
      content: body.content,
      image: body.image,
      type: body.type,
      isPinned: body.isPinned || false,
    })
    
    return NextResponse.json({ success: true, postId, message: "Post created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create post" },
      { status: 500 }
    )
  }
}

