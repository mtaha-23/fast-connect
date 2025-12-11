import { NextRequest, NextResponse } from "next/server"
import { getFirestoreDB } from "@/lib/firebase"
import { collection, addDoc, Timestamp } from "firebase/firestore"

/**
 * POST /api/tour-locations/seed
 * Seed database with dummy tour locations
 * TODO: Remove this endpoint after seeding is complete
 */
export async function POST(request: NextRequest) {
  try {
    const dummyLocations = [
      {
        name: "Main Building",
        description: "The central administrative building housing offices, lecture halls, and the library.",
        image: "/tour imgs/Main Building.jpeg",
        icon: "Building",
        order: 1,
      },
      {
        name: "Library",
        description: "State-of-the-art library with digital resources, study areas, and research facilities.",
        image: "/tour imgs/Library.jpeg",
        icon: "BookOpen",
        order: 2,
      },
      {
        name: "Computer Labs",
        description: "Advanced computing facilities with latest hardware and software for practical learning.",
        image: "/tour imgs/Computer Lab.jpg",
        icon: "FlaskConical",
        order: 3,
      },
      {
        name: "Cafeteria",
        description: "Spacious dining area offering diverse food options for students and faculty.",
        image: "/tour imgs/Dhabaa.jpeg",
        icon: "Utensils",
        order: 4,
      },
      {
        name: "Hostel",
        description: "Comfortable accommodation facilities for students with modern amenities and a supportive living environment.",
        image: "/tour imgs/Hostel.png",
        icon: "Trees",
        order: 5,
      },
    ]

    const db = getFirestoreDB()
    const locationsRef = collection(db, "tourLocations")

    const createdLocations = []
    for (const location of dummyLocations) {
      const docRef = await addDoc(locationsRef, {
        ...location,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      createdLocations.push({ id: docRef.id, name: location.name })
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `Successfully seeded ${createdLocations.length} tour locations`,
        locations: createdLocations
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error seeding tour locations:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to seed tour locations" },
      { status: 500 }
    )
  }
}

