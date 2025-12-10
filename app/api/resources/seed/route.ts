import { NextRequest, NextResponse } from "next/server"
import { createResource } from "@/lib/services/resource.service"

/**
 * POST /api/resources/seed
 * Seed database with dummy resources
 * TODO: Remove this endpoint after seeding is complete
 */
export async function POST(request: NextRequest) {
  try {
    const dummyResources = [
      {
        title: "FAST Entry Test Past Papers 2023",
        type: "Past Paper" as const,
        category: "Entry Test" as const,
        subject: "All Subjects",
        date: "2023",
        size: "2.4 MB",
        icon: "FileText",
        color: "bg-blue-500",
      },
      {
        title: "Mathematics Formula Sheet",
        type: "Study Guide" as const,
        category: "Mathematics" as const,
        subject: "Mathematics",
        date: "2024",
        size: "1.1 MB",
        icon: "Calculator",
        color: "bg-emerald-500",
      },
      {
        title: "English Vocabulary Guide",
        type: "Study Guide" as const,
        category: "English" as const,
        subject: "English",
        date: "2024",
        size: "3.2 MB",
        icon: "BookOpen",
        color: "bg-pink-500",
      },
      {
        title: "Computer Science Fundamentals",
        type: "Notes" as const,
        category: "CS" as const,
        subject: "Computer Science",
        date: "2024",
        size: "5.7 MB",
        icon: "Code",
        color: "bg-indigo-500",
      },
      {
        title: "Entry Test Sample Paper #1",
        type: "Past Paper" as const,
        category: "Entry Test" as const,
        subject: "All Subjects",
        date: "2022",
        size: "1.8 MB",
        icon: "FileText",
        color: "bg-blue-500",
      },
      {
        title: "Analytical Reasoning Practice",
        type: "Practice Set" as const,
        category: "Analytical" as const,
        subject: "IQ/Analytical",
        date: "2024",
        size: "2.1 MB",
        icon: "GraduationCap",
        color: "bg-orange-500",
      },
      {
        title: "FAST Prospectus 2024",
        type: "Official Document" as const,
        category: "General" as const,
        subject: "Information",
        date: "2024",
        size: "8.5 MB",
        icon: "FileType",
        color: "bg-cyan-500",
      },
      {
        title: "Calculus Complete Notes",
        type: "Notes" as const,
        category: "Mathematics" as const,
        subject: "Mathematics",
        date: "2024",
        size: "4.2 MB",
        icon: "Calculator",
        color: "bg-emerald-500",
      },
    ]

    const createdResources = []
    for (const resource of dummyResources) {
      const resourceId = await createResource(resource)
      createdResources.push({ id: resourceId, title: resource.title })
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `Successfully seeded ${createdResources.length} resources`,
        resources: createdResources
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error seeding resources:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to seed resources" },
      { status: 500 }
    )
  }
}

