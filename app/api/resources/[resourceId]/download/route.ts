import { NextRequest, NextResponse } from "next/server"
import { getResourceById, incrementResourceDownloads } from "@/lib/services/resource.service"
import { cloudinary } from "@/lib/cloudinary"
import { logAnalyticsEvent } from "@/lib/services/analytics.service"

export const runtime = "nodejs"

function sanitizeFileName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "")
}

function inferExtFromUrl(url: string) {
  const m = url.match(/\.([a-z0-9]+)(?:\?|$)/i)
  return m?.[1]?.toLowerCase()
}

function inferExtFromName(name: string) {
  const m = name.match(/\.([a-z0-9]+)$/i)
  return m?.[1]?.toLowerCase()
}

function contentTypeForExt(ext?: string) {
  switch ((ext || "").toLowerCase()) {
    case "pdf":
      return "application/pdf"
    case "png":
      return "image/png"
    case "jpg":
    case "jpeg":
      return "image/jpeg"
    case "webp":
      return "image/webp"
    case "gif":
      return "image/gif"
    default:
      return undefined
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> },
) {
  try {
    const { resourceId } = await params
    const resource = await getResourceById(resourceId)

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    // Best-effort download tracking (do not fail the download if tracking fails)
    incrementResourceDownloads(resourceId)
      .then(() =>
        logAnalyticsEvent({
          type: "resource.downloaded",
          targetId: resourceId,
          meta: { title: resource.title, fileName: resource.fileName ?? null },
        }),
      )
      .catch(() => {})

    const extFromName = resource.fileName ? inferExtFromName(resource.fileName) : undefined

    const candidateUrls: string[] = []
    if (resource.fileUrl) candidateUrls.push(resource.fileUrl)

    // If stored URL is stale/broken, rebuild from Cloudinary publicId
    if (resource.filePublicId) {
      const rawWithFormat = cloudinary.url(resource.filePublicId, {
        secure: true,
        resource_type: "raw",
        type: "upload",
        ...(extFromName ? { format: extFromName } : {}),
      })
      const rawWithoutFormat = cloudinary.url(resource.filePublicId, {
        secure: true,
        resource_type: "raw",
        type: "upload",
      })
      const imageUrl = cloudinary.url(resource.filePublicId, {
        secure: true,
        resource_type: "image",
        type: "upload",
      })

      candidateUrls.push(rawWithFormat, rawWithoutFormat, imageUrl)
    }

    let upstream: Response | null = null
    let finalUrl: string | null = null
    for (const url of candidateUrls) {
      try {
        const res = await fetch(url, { cache: "no-store" })
        if (res.ok) {
          upstream = res
          finalUrl = url
          break
        }
      } catch {
        // ignore and try next
      }
    }

    if (!upstream || !finalUrl) {
      return NextResponse.json(
        {
          error: "Failed to download file",
          details: {
            status: 404,
            statusText: "Not Found",
          },
        },
        { status: 502 },
      )
    }

    const ext = inferExtFromUrl(finalUrl) || extFromName
    const inferredType = contentTypeForExt(ext)
    const upstreamType = upstream.headers.get("content-type") || ""
    const contentType = inferredType || upstreamType || "application/octet-stream"
    const base = sanitizeFileName(resource.fileName || resource.title || "resource") || "resource"
    const filename = ext && !base.toLowerCase().endsWith(`.${ext}`) ? `${base}.${ext}` : base
    const inline = request.nextUrl.searchParams.get("inline") === "1"

    const bytes = await upstream.arrayBuffer()
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error downloading resource:", error)
    return NextResponse.json(
      { error: "Failed to process download" },
      { status: 500 },
    )
  }
}

/**
 * POST /api/resources/[resourceId]/download
 * No-op endpoint (downloads are tracked on GET)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    await params
    return NextResponse.json({ success: true, message: "Downloads are tracked on GET" }, { status: 200 })
  } catch (error) {
    console.error("Error handling download:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process download" },
      { status: 500 }
    )
  }
}

