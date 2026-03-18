import { NextResponse } from "next/server"

export const runtime = "nodejs"

type ChatRequest = {
  message: string
  topk?: number
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as ChatRequest | null

  if (!body?.message || typeof body.message !== "string") {
    return NextResponse.json({ error: "Missing 'message'." }, { status: 400 })
  }

  const backendUrl = process.env.RAG_BACKEND_URL || "http://127.0.0.1:8001/chat"

  try {
    const r = await fetch(backendUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: body.message,
        topk: typeof body.topk === "number" ? body.topk : undefined,
      }),
    })

    const data = (await r.json().catch(() => null)) as { reply?: string; detail?: string } | null

    if (!r.ok) {
      return NextResponse.json(
        { error: data?.detail || "RAG backend error." },
        { status: 502 }
      )
    }

    return NextResponse.json({ reply: data?.reply ?? "" })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to reach RAG backend." },
      { status: 502 }
    )
  }
}

