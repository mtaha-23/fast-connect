import { NextRequest, NextResponse } from "next/server"
import { updatePost, deletePost, getPostById } from "@/lib/services/post.service"

/**
 * GET /api/posts/[postId]
 * Get a single post by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const post = await getPostById(postId)
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }
    
    return NextResponse.json({
      post: {
        ...post,
        createdAt: post.createdAt.toDate().toISOString(),
      },
    }, { status: 200 })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch post" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/posts/[postId]
 * Update a post
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const body = await request.json()
    
    await updatePost(postId, body)
    
    return NextResponse.json({ success: true, message: "Post updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update post" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/posts/[postId]
 * Delete a post
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    await deletePost(postId)
    
    return NextResponse.json({ success: true, message: "Post deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete post" },
      { status: 500 }
    )
  }
}

