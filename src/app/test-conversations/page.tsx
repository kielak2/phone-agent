"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'

interface SyncResult {
  success?: boolean
  savedCount?: number
  skippedCount?: number
  processed?: number
  enqueued?: boolean
}

export default function TestConversations() {
  const [result, setResult] = useState<SyncResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const triggerSync = useMutation(api.conversations.triggerConversationSync)

  const fetchConversations = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await triggerSync({})
      setResult(res as unknown as SyncResult)
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
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Sync Conversations (Convex)</h1>
          <p className="text-gray-600 mb-6">Enqueue a background sync from ElevenLabs and save to Convex</p>
          
          <Button 
            onClick={fetchConversations} 
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? 'Enqueuing...' : 'Enqueue Sync Job'}
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700 font-medium">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sync Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Job</p>
                    <p className="text-2xl font-bold">{result.enqueued ? 'Enqueued' : 'Unknown'}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">The action will run on the server shortly. Check your Convex logs for progress.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 