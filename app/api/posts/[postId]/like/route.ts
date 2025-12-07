import { NextRequest, NextResponse } from "next/server"
import { togglePostLike } from "@/lib/services/post.service"

/**
 * POST /api/posts/[postId]/like
 * Toggle like on a post
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const result = await togglePostLike(postId, userId)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to toggle like" },
      { status: 500 }
    )
  }
}

