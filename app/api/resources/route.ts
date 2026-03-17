import { NextRequest, NextResponse } from "next/server"
import { getAllResources, createResource } from "@/lib/services/resource.service"

/**
 * GET /api/resources
 * Fetch all resources
 */
export async function GET(request: NextRequest) {
  try {
    const resources = await getAllResources()
    
    // Serialize Firestore Timestamps to ISO strings for JSON response
    const serializedResources = resources.map((resource) => ({
      ...resource,
      createdAt: resource.createdAt.toDate().toISOString(),
      updatedAt: resource.updatedAt.toDate().toISOString(),
    }))
    
    return NextResponse.json({ resources: serializedResources }, { status: 200 })
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch resources" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/resources
 * Create a new resource
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Basic validation
    if (!body.title || !body.type || !body.category) {
      return NextResponse.json(
        { error: "Title, type, and category are required" },
        { status: 400 }
      )
    }

    // Require either a direct file URL or an uploaded file (represented by filePublicId)
    if (!body.fileUrl && !body.filePublicId) {
      return NextResponse.json(
        { error: "Either a file link or an uploaded file is required" },
        { status: 400 }
      )
    }
    
    const resourceId = await createResource({
      title: body.title,
      type: body.type,
      category: body.category,
      subject: body.subject ?? "",
      date: body.date ?? "",
      size: body.size,
      icon: body.icon,
      color: body.color,
      fileUrl: body.fileUrl,
      filePublicId: body.filePublicId,
      fileName: body.fileName,
    })
    
    return NextResponse.json({ success: true, resourceId, message: "Resource created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating resource:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create resource" },
      { status: 500 }
    )
  }
}

