import { NextRequest, NextResponse } from "next/server"
import client from "@/lib/elevenlabs"

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const conversationId = id
    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversationId" }, { status: 400 })
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 500 })
    }

    const details = await client.conversationalAi.conversations.get(conversationId)

    const transcript = Array.isArray((details as any)?.transcript) ? (details as any).transcript : []

    return NextResponse.json({
      conversationId,
      status: (details as any)?.status,
      metadata: (details as any)?.metadata,
      analysis: (details as any)?.analysis,
      transcript,
    })
  } catch (error) {
    console.error("Error fetching conversation details:", error)
    return NextResponse.json({ error: "Failed to fetch conversation details" }, { status: 500 })
  }
}
