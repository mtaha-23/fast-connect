import { NextRequest, NextResponse } from "next/server"
import { getResourceById, updateResource, deleteResource } from "@/lib/services/resource.service"
import { cloudinary } from "@/lib/cloudinary"

/**
 * GET /api/resources/[resourceId]
 * Get a single resource by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params
    const resource = await getResourceById(resourceId)
    
    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      resource: {
        ...resource,
        createdAt: resource.createdAt.toDate().toISOString(),
        updatedAt: resource.updatedAt.toDate().toISOString(),
      }
    }, { status: 200 })
  } catch (error) {
    console.error("Error fetching resource:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch resource" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/resources/[resourceId]
 * Update a resource
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params
    const body = await request.json()
    
    await updateResource(resourceId, body)
    
    return NextResponse.json({ success: true, message: "Resource updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error updating resource:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update resource" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/resources/[resourceId]
 * Delete a resource
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params
    // Fetch resource to get Cloudinary public ID (if any)
    const resource = await getResourceById(resourceId)

    if (resource && resource.filePublicId) {
      try {
        // Resources can be uploaded as "raw" (pdf/docx) or "image"
        const rawResult = await cloudinary.uploader.destroy(resource.filePublicId, { resource_type: "raw" })
        if (rawResult?.result === "not found") {
          await cloudinary.uploader.destroy(resource.filePublicId, { resource_type: "image" })
        }
      } catch (err) {
        console.error("Failed to delete Cloudinary file for resource:", err)
      }
    }

    await deleteResource(resourceId)
    
    return NextResponse.json({ success: true, message: "Resource deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting resource:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete resource" },
      { status: 500 }
    )
  }
}

