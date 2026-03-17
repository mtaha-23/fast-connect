import { NextRequest, NextResponse } from "next/server"
import { cloudinary } from "@/lib/cloudinary"

export const runtime = "nodejs"

function sanitizeBaseName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "")
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const desiredNameRaw = formData.get("desiredName")

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (typeof file === "string") {
      return NextResponse.json({ error: "Invalid file data" }, { status: 400 })
    }

    const maxBytes = 5 * 1024 * 1024 // 5MB
    if ((file as File).size && (file as File).size > maxBytes) {
      return NextResponse.json(
        { error: "File too large", details: "Maximum file size is 5 MB" },
        { status: 400 },
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileObj = file as File
    const contentType = fileObj.type || ""
    const originalName = fileObj.name || "resource"
    const originalExtMatch = originalName.match(/\.([a-z0-9]+)$/i)
    const originalExt = originalExtMatch?.[1]?.toLowerCase()
    const isImage = contentType.startsWith("image/")
    const resourceType: "image" | "raw" = isImage ? "image" : "raw"

    const desiredBase =
      typeof desiredNameRaw === "string" && desiredNameRaw.trim().length > 0
        ? sanitizeBaseName(desiredNameRaw)
        : undefined

    const result = await new Promise<{ secure_url: string; public_id: string; format?: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "fastconnect/resources",
          resource_type: resourceType,
          ...(desiredBase
            ? {
                public_id: `fastconnect/resources/${desiredBase}-${Date.now()}`,
                overwrite: false,
              }
            : {
                use_filename: true,
                unique_filename: true,
              }),
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload failed"))
            return
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
          })
        },
      )

      uploadStream.end(buffer)
    })

    const format = (result.format || originalExt || "").toLowerCase() || undefined

    const urlRaw =
      resourceType === "raw"
        ? cloudinary.url(result.public_id, {
            secure: true,
            resource_type: "raw",
            type: "upload",
            ...(format ? { format } : {}),
          })
        : undefined

    const url = resourceType === "raw" ? (urlRaw || result.secure_url) : result.secure_url
    const finalName = desiredBase ? `${desiredBase}${format ? `.${format}` : ""}` : originalName

    return NextResponse.json(
      {
        url,
        publicId: result.public_id,
        fileName: finalName,
        fileExt: format,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Cloudinary upload error (resources):", error)
    return NextResponse.json(
      { error: "Failed to upload file", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

