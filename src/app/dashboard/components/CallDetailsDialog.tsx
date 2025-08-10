"use client"
import { useEffect, useRef, useState } from "react"
import { Play, Pause, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { CallData } from "../types"

interface CallDetailsDialogProps {
  call: CallData
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, "0")}`
}

function parseDurationToSeconds(duration: string): number {
  // duration format "M:SS" or "MM:SS"
  const [m, s] = duration.split(":").map((n) => parseInt(n, 10))
  if (Number.isFinite(m) && Number.isFinite(s)) return m * 60 + s
  return 0
}

export function CallDetailsDialog({ call }: CallDetailsDialogProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [open, setOpen] = useState(false)
  const [transcript, setTranscript] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(() => parseDurationToSeconds(call.duration))
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load transcript on open
  useEffect(() => { 
    if (!open) return
    let cancelled = false
    const run = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/conversations/${encodeURIComponent(call.conversationId)}`)
        if (res.ok) {
          const data = await res.json()
          const text = Array.isArray(data.transcript)
            ? data.transcript
                .map((t: any) => `${t.role === "agent" ? "Agent" : "User"}: ${t.message ?? ""}`)
                .join("\n")
            : ""
          if (!cancelled) setTranscript(text)
        } else {
          if (!cancelled) setTranscript("Failed to load transcript")
        }
      } catch {
        if (!cancelled) setTranscript("Failed to load transcript")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [open, call.conversationId])

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
      try {
        if (!audioReady) {
          await new Promise<void>((resolve) => {
            const onCanPlay = () => { audioRef.current?.removeEventListener("canplay", onCanPlay); resolve() }
            audioRef.current?.addEventListener("canplay", onCanPlay)
          })
        }
        await audioRef.current.play()
        setIsPlaying(true)
      } catch {
        setAudioError("Playback failed")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v && audioRef.current) { audioRef.current.pause(); setIsPlaying(false) } }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border border-slate-300 bg-white text-slate-800 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800">
          View Details
        </Button>
      </DialogTrigger>
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
                  {formatTime(currentTime)} / {Number.isFinite(totalDuration) && totalDuration > 0 ? formatTime(totalDuration) : call.duration}
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
          <Card className="border border-slate-200 bg-slate-50/50 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <div className="rounded-lg border border-slate-200 bg-white p-2">
                  <div className="h-5 w-5 rounded-full bg-teal-600" />
                </div>
                AI Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={loading ? "Loading transcript..." : transcript}
                readOnly
                className="min-h-[150px] resize-none bg-white text-slate-900 focus:ring-2 focus:ring-teal-500"
              />
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}