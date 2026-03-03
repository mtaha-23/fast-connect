import { NextRequest, NextResponse } from "next/server"
import { cloudinary } from "@/lib/cloudinary"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (typeof file === "string") {
      return NextResponse.json({ error: "Invalid file data" }, { status: 400 })
    }

    const maxBytes = 5 * 1024 * 1024 // 5MB
    if ((file as File).size && (file as File).size > maxBytes) {
      return NextResponse.json(
        { error: "File too large", details: "Maximum image size is 5 MB" },
        { status: 400 },
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "fastconnect/posts",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload failed"))
            return
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          })
        },
      )

      uploadStream.end(buffer)
    })

    return NextResponse.json(
      {
        url: result.secure_url,
        publicId: result.public_id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload image", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

