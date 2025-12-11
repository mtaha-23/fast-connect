import { NextRequest, NextResponse } from "next/server"
import { getAllTourLocations } from "@/lib/services/tour.service"

/**
 * GET /api/tour-locations
 * Fetch all tour locations
 */
export async function GET(request: NextRequest) {
  try {
    const locations = await getAllTourLocations()
    
    // Serialize Firestore Timestamps to ISO strings for JSON response
    const serializedLocations = locations.map((location) => ({
      ...location,
      createdAt: location.createdAt.toDate().toISOString(),
      updatedAt: location.updatedAt.toDate().toISOString(),
    }))
    
    return NextResponse.json({ locations: serializedLocations }, { status: 200 })
  } catch (error) {
    console.error("Error fetching tour locations:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch tour locations" },
      { status: 500 }
    )
  }
}

