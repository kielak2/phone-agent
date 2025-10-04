"use client"
import type { TranscriptItem } from "@/types/ui"

type TranscriptProps = {
  items: TranscriptItem[]
  loading?: boolean
  className?: string
}

export function Transcript({ items, loading = false, className = "" }: TranscriptProps) {
  return (
    <div className={`space-y-6 h-full overflow-y-auto pr-2 ${className}`}>
      {loading ? (
        <div className="space-y-3">
          <div className="h-6 w-2/5 animate-pulse rounded-md bg-slate-200" />
          <div className="h-16 w-4/5 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-6 w-1/3 animate-pulse rounded-md bg-slate-200" />
          <div className="h-20 w-3/4 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      ) : items.filter((m) => typeof m.message === "string" && m.message.trim().length > 0).length === 0 ? (
        <div className="text-sm text-slate-500">No transcript available.</div>
      ) : (
        <div className="animate-in fade-in duration-300 space-y-6">
          {items
            .filter((m) => typeof m.message === "string" && m.message.trim().length > 0)
            .map((item, idx) => {
              const isUser = item.role === "user"
              return (
                <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                  isUser ? "bg-emerald-50 border border-emerald-200 text-slate-900" : "bg-white border border-slate-200 text-slate-900"
                }`}>
                  <div className={`mb-1 text-xs font-semibold ${isUser ? "text-slate-500" : "text-slate-500"}`}>
                      {isUser ? "Customer" : "Agent"}
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed">{item.message.trim()}</div>
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}

