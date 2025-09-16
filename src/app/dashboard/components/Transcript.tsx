"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { TranscriptItem } from "@/types/ui"

interface TranscriptProps {
  title?: string
  loading?: boolean
  items: TranscriptItem[]
  isOpen: boolean
  onToggle: () => void
}

export function Transcript({ title = "AI Transcript", loading = false, items, isOpen, onToggle }: TranscriptProps) {
  return (
    <Card className="border border-slate-200 bg-slate-50/50 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-900">{title}</CardTitle>
          <Button
            size="sm"
            onClick={onToggle}
            className="border border-teal-300 bg-white text-teal-700 transition-colors hover:border-teal-500 hover:bg-teal-600 hover:text-white"
          >
            {isOpen ? "Hide transcript" : "Open transcript"}
          </Button>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent>
          {loading ? (
            <div className="text-sm text-slate-600">Loading transcript...</div>
          ) : (
            <div className="space-y-4 max-h-[480px] min-h-[160px] overflow-y-auto pr-2">
              {items.filter((m) => typeof m.message === "string" && m.message.trim().length > 0).length === 0 ? (
                <div className="text-sm text-slate-500">No transcript available.</div>
              ) : (
                items
                  .filter((m) => typeof m.message === "string" && m.message.trim().length > 0)
                  .map((item, idx) => {
                  const isUser = item.role === "user"
                  return (
                    <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                        isUser ? "bg-teal-600 text-white" : "bg-white border border-slate-200 text-slate-900"
                      }`}>
                        <div className={`mb-1 text-xs font-semibold ${isUser ? "text-teal-50/90" : "text-slate-500"}`}>
                          {isUser ? "Customer" : "Agent"}
                        </div>
                        <div className="whitespace-pre-wrap leading-relaxed">{item.message.trim()}</div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

