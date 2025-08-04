"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Conversation {
  id: string
  agentId: string
  agentName: string
  startTime: number
  duration: number
  messageCount: number
  status: string
  callSuccessful: 'success' | 'failure' | 'unknown'
  transcriptSummary: string
  callSummaryTitle: string
  startDate: string
  startTimeFormatted: string
  durationFormatted: string
}

interface ConversationsResponse {
  conversations: Conversation[]
  hasMore: boolean
  nextCursor: string | null
  totalCount: number
}

export default function TestConversations() {
  const [data, setData] = useState<ConversationsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/conversations')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch conversations')
      }
      
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Test Conversations Endpoint</h1>
          <p className="text-gray-600 mb-6">Test the ElevenLabs conversations API endpoint</p>
          
          <Button 
            onClick={fetchConversations} 
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? 'Loading...' : 'Fetch Conversations'}
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700 font-medium">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {data && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Conversations</p>
                    <p className="text-2xl font-bold">{data.totalCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Has More</p>
                    <p className="text-2xl font-bold">{data.hasMore ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next Cursor</p>
                    <p className="text-sm font-mono">{data.nextCursor || 'None'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.conversations.map((conv) => (
                    <div key={conv.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{conv.callSummaryTitle}</h3>
                        <Badge 
                          variant={conv.callSuccessful === 'success' ? 'default' : 'destructive'}
                          className={conv.callSuccessful === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {conv.callSuccessful}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Agent</p>
                          <p className="font-medium">{conv.agentName}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Date & Time</p>
                          <p className="font-medium">{conv.startDate} {conv.startTimeFormatted}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Duration</p>
                          <p className="font-medium">{conv.durationFormatted}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Messages</p>
                          <p className="font-medium">{conv.messageCount}</p>
                        </div>
                      </div>
                      
                      {conv.transcriptSummary && (
                        <div className="mt-3">
                          <p className="text-gray-500 text-sm">Summary</p>
                          <p className="text-sm">{conv.transcriptSummary}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 