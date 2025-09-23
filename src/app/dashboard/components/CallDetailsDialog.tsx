"use client"
import { useEffect, useRef, useState } from "react"
import { Play, Pause, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { CallListItem, TranscriptItem } from "@/types/ui"
import { parseDurationToSeconds, formatDurationFromSeconds } from "../utils/transforms"
import { Transcript } from "./Transcript"
import { tryCatch } from "@/lib/tryCatch"

interface CallDetailsDialogProps {
  call: CallListItem
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
}

// Use formatDurationFromSeconds from transforms instead of local formatTime

export function CallDetailsDialog({ call, open: openProp, onOpenChange, hideTrigger }: CallDetailsDialogProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [internalOpen, setInternalOpen] = useState(false)
  const open = openProp ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen
  const [transcript, setTranscript] = useState<TranscriptItem[]>([])
  const [loading, setLoading] = useState(false)
  const [transcriptOpen, setTranscriptOpen] = useState(false)
  const [transcriptLoaded, setTranscriptLoaded] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(() => parseDurationToSeconds(call.duration))
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Lazy-load transcript when section is opened
  useEffect(() => {
    if (!open) return
    if (!transcriptOpen) return
    if (transcriptLoaded) return
    let cancelled = false
    const run = async () => {
      setLoading(true)
      const { data: res } = await tryCatch(fetch(`/api/conversations/${encodeURIComponent(call.conversationId)}`))
      if (!res) {
        if (!cancelled) setTranscript([])
        if (!cancelled) setLoading(false)
        return
      }
      if (!res.ok) {
        if (!cancelled) setTranscript([])
        if (!cancelled) setLoading(false)
        return
      }
      const { data: body } = await tryCatch(res.json() as Promise<any>)
      const items: TranscriptItem[] = Array.isArray(body?.transcript)
        ? body.transcript
            .filter((t: any) => t && (t.role === "agent" || t.role === "user") && typeof t.message === "string" && t.message.trim().length > 0)
            .map((t: any) => ({ role: t.role, message: t.message.trim() }))
        : []
      if (!cancelled) setTranscript(items)
      if (!cancelled) setTranscriptLoaded(true)
      if (!cancelled) setLoading(false)
    }
    run()
    return () => { cancelled = true }
  }, [open, transcriptOpen, transcriptLoaded, call.conversationId])

  // Point audio element to streaming endpoint when opened
  useEffect(() => {
    setAudioReady(false)
    setAudioError(null)
    setCurrentTime(0)
    setTotalDuration(parseDurationToSeconds(call.duration))
    if (!open) return
    if (!audioRef.current) return
    const url = `/api/conversations/${encodeURIComponent(call.conversationId)}/audio`
    audioRef.current.src = url
    audioRef.current.load()
    setIsPlaying(false)
  }, [open, call.conversationId, call.duration])

  const togglePlay = async () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      if (!audioReady) {
        await new Promise<void>((resolve) => {
          const onCanPlay = () => { audioRef.current?.removeEventListener("canplay", onCanPlay); resolve() }
          audioRef.current?.addEventListener("canplay", onCanPlay)
        })
      }
      const { error } = await tryCatch(audioRef.current.play())
      if (error) {
        setAudioError("Playback failed")
        return
      }
      setIsPlaying(true)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v && audioRef.current) { audioRef.current.pause(); setIsPlaying(false) } if (!v) { setTranscriptOpen(false); setTranscriptLoaded(false); setTranscript([]) } }}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="border border-slate-300 bg-white text-slate-800 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800">
            View Details
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl max-h={80}vh overflow-y-auto border border-slate-200 bg-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Call Details</DialogTitle>
          <DialogDescription className="text-base font-medium text-slate-600">
            {call.phoneNumber} • {call.date} at {call.time} • Duration: {call.duration}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 grid gap-6">
          {/* Audio Player */}
          <Card className="border border-teal-200 bg-teal-50/50 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <div className="rounded-lg border border-teal-200 bg-teal-50 p-2">
                  <Play className="h-5 w-5 text-teal-700" />
                </div>
                Call Recording
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlay}
                  className="border border-teal-300 bg-white text-teal-700 transition-colors hover:border-teal-500 hover:bg-teal-600 hover:text-white"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span className="ml-2">{isPlaying ? "Pause" : "Play"}</span>
                </Button>
                <a href={`/api/conversations/${encodeURIComponent(call.conversationId)}/audio`} download>
                  <Button variant="outline" size="sm" className="border border-slate-300 bg-white text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-100">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </a>
                <span className="font-mono text-sm text-slate-700">
                  {formatDurationFromSeconds(currentTime)} / {Number.isFinite(totalDuration) && totalDuration > 0 ? formatDurationFromSeconds(totalDuration) : call.duration}
                </span>
              </div>
              {audioError && <div className="mt-2 text-sm text-red-600">{audioError}</div>}
              <audio
                ref={audioRef}
                controls
                preload="metadata"
                onCanPlay={() => setAudioReady(true)}
                onLoadedMetadata={() => {
                  const d = audioRef.current?.duration
                  if (typeof d === "number" && isFinite(d) && d > 0) {
                    setTotalDuration(d)
                  }
                }}
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
                onEnded={() => { setIsPlaying(false); setCurrentTime(0) }}
                onError={() => setAudioError("Audio failed to load")}
                className="mt-3 w-full"
              >
                <source src={`/api/conversations/${encodeURIComponent(call.conversationId)}/audio`} type="audio/mpeg" />
              </audio>
            </CardContent>
          </Card>

          {/* Transcript */}
          <Transcript
            loading={loading}
            items={transcript}
            isOpen={transcriptOpen}
            onToggle={() => setTranscriptOpen((p) => !p)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}