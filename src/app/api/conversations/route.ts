import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/elevenlabs'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      )
    }
    
    // Get the most recent conversation from our database
    const mostRecentConversation = await convex.query(api.conversations.getMostRecentConversation)
    const cutoffTime = mostRecentConversation 
      ? mostRecentConversation.startTime + (24 * 60 * 60) // Add 24 hours in seconds
      : 0 // If no conversations exist, get all
    
    // Fetch conversations from ElevenLabs using the new client
    const response = await client.conversationalAi.conversations.list()
    
    // Filter conversations to only process newer ones
    const conversationsToProcess = response.conversations.filter(conv => 
      conv.startTimeUnixSecs > cutoffTime
    )
    
    console.log(`Found ${response.conversations.length} total conversations, processing ${conversationsToProcess.length} newer than cutoff`)
    
    // Save conversations to Convex database
    let savedCount = 0
    let skippedCount = 0
    
    for (const conv of conversationsToProcess) {
      try {
        // Get userId by agentId
        const userId = await convex.query(api.user.getUserByAgentId, { agentId: conv.agentId })
        
        if (userId) {
          // Check if conversation already exists
          const existingConversations = await convex.query(api.conversations.getConversationsByUser, { userId })
          const exists = existingConversations.some((existing: any) => existing.conversationId === conv.conversationId)
          
          if (!exists) {
            // Save new conversation to Convex
            const now = Date.now()
            await convex.mutation(api.conversations.addConversation, {
              userId: userId,
              conversationId: conv.conversationId,
              agentId: conv.agentId,
              agentName: conv.agentName,
              startTime: conv.startTimeUnixSecs,
              duration: conv.callDurationSecs,
              callSuccessful: conv.callSuccessful as "success" | "failure" | "unknown",
              createdAt: now,
              updatedAt: now,
            })
            savedCount++
          } else {
            skippedCount++
          }
        }
      } catch (error) {
        console.error(`Error saving conversation ${conv.conversationId}:`, error)
      }
    }
    
    console.log(`Conversations processed: ${savedCount} saved, ${skippedCount} skipped`)
    return NextResponse.json({ success: true, savedCount, skippedCount }, { status: 200 })
    
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