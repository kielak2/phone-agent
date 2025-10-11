import { NextRequest } from "next/server"
import client from "@/lib/elevenlabs"

async function toUint8Array(data: unknown): Promise<Uint8Array> {
  if (!data) return new Uint8Array()
  if (data instanceof ArrayBuffer) return new Uint8Array(data)
  if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer as ArrayBuffer)
  if (typeof Blob !== "undefined" && data instanceof Blob) {
    const buf = await data.arrayBuffer()
    return new Uint8Array(buf)
  }
  // ReadableStream
  if (typeof data === "object" && data !== null && ("getReader" in data || "tee" in data)) {
    const reader = (data as ReadableStream<Uint8Array>).getReader()
    const chunks: Uint8Array[] = []
    let total = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        chunks.push(value)
        total += value.byteLength
      }
    }
    const out = new Uint8Array(total)
    let offset = 0
    for (const chunk of chunks) {
      out.set(chunk, offset)
      offset += chunk.byteLength
    }
    return out
  }
  // Fallback: try to String and encode
  if (typeof data === "string") {
    return new TextEncoder().encode(data)
  }
  return new Uint8Array()
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const conversationId = id
  if (!conversationId) {
    return new Response("Missing conversationId", { status: 400 })
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    return new Response("ElevenLabs API key not configured", { status: 500 })
  }

  try {
    const raw = await client.conversationalAi.conversations.audio.get(conversationId)
    const bytes = await toUint8Array(raw)
    const size = bytes.byteLength

    // Log memory size for diagnostics
    console.log(`[audio] conversation ${conversationId} size: ${size} bytes (${(size / 1024 / 1024).toFixed(2)} MB)`)

    const baseHeaders: Record<string, string> = {
      "Content-Type": "audio/mpeg",
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-store",
      "Content-Disposition": "inline; filename=conversation.mp3",
    }

    const range = req.headers.get("range")
    if (range) {
      const match = /bytes=(\d+)-(\d+)?/.exec(range)
      if (match) {
        const start = parseInt(match[1], 10)
        const end = match[2] ? Math.min(parseInt(match[2], 10), size - 1) : size - 1
        if (isNaN(start) || start < 0 || start >= size || start > end) {
          return new Response(null, {
            status: 416,
            headers: { ...baseHeaders, "Content-Range": `bytes */${size}` },
          })
        }
        const chunk = bytes.subarray(start, end + 1)
        return new Response(new Uint8Array(chunk), {
          status: 206,
          headers: {
            ...baseHeaders,
            "Content-Length": String(chunk.byteLength),
            "Content-Range": `bytes ${start}-${end}/${size}`,
          },
        })
      }
    }

    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: { ...baseHeaders, "Content-Length": String(size) },
    })
  } catch (e) {
    console.error("Error fetching conversation audio:", e)
    return new Response("Failed to fetch conversation audio", { status: 500 })
  }
}
