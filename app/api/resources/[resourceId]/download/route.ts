import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/resources/[resourceId]/download
 * No-op endpoint (downloads are not tracked)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    await params
    return NextResponse.json({ success: true, message: "Downloads are not tracked" }, { status: 200 })
  } catch (error) {
    console.error("Error handling download:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process download" },
      { status: 500 }
    )
  }
}

