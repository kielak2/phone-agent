import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/elevenlabs'

export async function GET(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      )
    }
    
    // Fetch conversations from ElevenLabs using the new client
    const response = await client.conversationalAi.conversations.list()
    
    // Transform the data to be more frontend-friendly
    const transformedConversations = response.conversations.map(conv => ({
      id: conv.conversationId,
      agentId: conv.agentId,
      agentName: conv.agentName,
      startTime: conv.startTimeUnixSecs,
      duration: conv.callDurationSecs,
      messageCount: conv.messageCount,
      status: conv.status,
      callSuccessful: conv.callSuccessful,
      transcriptSummary: '',
      callSummaryTitle: '',
      // Convert Unix timestamp to readable date
      startDate: new Date(conv.startTimeUnixSecs * 1000).toISOString().split('T')[0],
      startTimeFormatted: new Date(conv.startTimeUnixSecs * 1000).toLocaleTimeString(),
      // Convert duration to MM:SS format
      durationFormatted: `${Math.floor(conv.callDurationSecs / 60)}:${(conv.callDurationSecs % 60).toString().padStart(2, '0')}`
    }))
    
    return NextResponse.json({
      conversations: transformedConversations,
      hasMore: response.hasMore,
      nextCursor: response.nextCursor,
      totalCount: response.conversations.length
    })
    
  } catch (error) {
    console.error('Error fetching conversations:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch conversations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 