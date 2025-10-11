"use client"
import { useEffect, useRef, useState } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Play, Pause, Download, X, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export function CallDetailsDialog({ call, open: openProp, onOpenChange, hideTrigger }: CallDetailsDialogProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [internalOpen, setInternalOpen] = useState(false)
  const open = openProp ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen
  const [transcript, setTranscript] = useState<TranscriptItem[]>([])
  const [loading, setLoading] = useState(false)
  const [audioLoading, setAudioLoading] = useState(true)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(() => parseDurationToSeconds(call.duration))
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const [volume, setVolume] = useState<number>(1)

  // Load transcript when dialog opens or conversation changes
  useEffect(() => {
    if (!open) return
    let cancelled = false
    const run = async () => {
      setLoading(true)
      const { data: res } = await tryCatch(fetch(`/api/conversations/${encodeURIComponent(call.conversationId)}`))
      if (!res || !res.ok) {
        if (!cancelled) {
          setTranscript([])
          setLoading(false)
        }
        return
      }
      const { data: body } = await tryCatch(res.json() as Promise<Record<string, unknown>>)
      const items: TranscriptItem[] = Array.isArray(body?.transcript)
        ? body.transcript
            .filter((t: unknown): t is Record<string, unknown> => {
              const obj = t as Record<string, unknown>
              return obj && (obj.role === "agent" || obj.role === "user") && typeof obj.message === "string" && obj.message.trim().length > 0
            })
            .map((t: Record<string, unknown>) => ({ 
              role: t.role as "user" | "agent", 
              message: (t.message as string).trim() 
            }))
        : []
      if (!cancelled) {
        setTranscript(items)
        setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [open, call.conversationId])

  // Point audio element to streaming endpoint when opened
  useEffect(() => {
    setAudioError(null)
    setAudioLoading(true)
    setCurrentTime(0)
    setTotalDuration(parseDurationToSeconds(call.duration))
    if (!open) return
    if (!audioRef.current) return
    const url = `/api/conversations/${encodeURIComponent(call.conversationId)}/audio`
    audioRef.current.src = url
    audioRef.current.load()
    setIsPlaying(false)
  }, [open, call.conversationId, call.duration])

  // Apply playback rate and volume changes
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.playbackRate = playbackRate
    audioRef.current.volume = volume
  }, [playbackRate, volume])

  const togglePlay = async () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      // Wait until the audio element has enough data to start playing smoothly
      if ((audioRef.current.readyState ?? 0) < 2) {
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

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setIsPlaying(false)
      setTranscript([])
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      {!hideTrigger && (
        <DialogPrimitive.Trigger asChild>
          <Button variant="outline" size="sm" className="border border-slate-300 bg-white text-slate-800 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800">
            View Details
          </Button>
        </DialogPrimitive.Trigger>
      )}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 duration-400 fixed inset-0 z-40 bg-black/40" />
        <DialogPrimitive.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right data-[state=open]:duration-400 data-[state=closed]:duration-200 data-[state=open]:ease-out data-[state=closed]:ease-in fixed inset-y-0 right-0 z-50 flex h-screen w-full min-w-0 flex-col overflow-hidden border-l border-slate-200 bg-white p-6 shadow-2xl focus:outline-none sm:w-full md:w-2/3 lg:w-1/2 xl:w-5/12">
          <div className="-mx-6 sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="flex items-center justify-between">
              <DialogPrimitive.Title className="text-xl font-semibold text-slate-900">Call details</DialogPrimitive.Title>
              <DialogPrimitive.Close
                onClick={() => setOpen(false)}
                className="rounded-xs p-1 text-slate-500 transition-colors hover:text-slate-700 focus:outline-none"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </DialogPrimitive.Close>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Phone Number</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{call.phoneNumber}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Date & Time</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{call.date}</p>
                <p className="text-xs text-slate-600">{call.time}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Duration</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{call.duration}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-1 min-h-0 flex-col gap-6">
          {/* Audio Player */}
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              {/* Timeline above controls - Simple & Elegant */}
              <div className="group">
                <div className="relative flex items-center">
                  {/* Background track */}
                  <div className="absolute h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    {/* Progress fill */}
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{
                        width: `${((currentTime / (Number.isFinite(totalDuration) && totalDuration > 0 ? totalDuration : 1)) * 100)}%`
                      }}
                    />
                  </div>
                  {/* Input slider */}
                  <input
                    type="range"
                    min={0}
                    max={Number.isFinite(totalDuration) && totalDuration > 0 ? totalDuration : 0}
                    step={0.1}
                    value={Math.min(currentTime, Number.isFinite(totalDuration) && totalDuration > 0 ? totalDuration : 0)}
                    onChange={(e) => {
                      const v = Number(e.currentTarget.value)
                      if (audioRef.current && Number.isFinite(v)) {
                        audioRef.current.currentTime = v
                        setCurrentTime(v)
                      }
                    }}
                    className="relative z-10 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-emerald-500 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:ring-2 [&::-moz-range-thumb]:ring-emerald-500 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110"
                    aria-label="Seek"
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600">
                  <span>{formatDurationFromSeconds(currentTime)}</span>
                  <span>{Number.isFinite(totalDuration) && totalDuration > 0 ? formatDurationFromSeconds(totalDuration) : call.duration}</span>
                </div>
              </div>

              {/* Controls row */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    disabled={audioLoading}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={audioLoading ? "Loading..." : isPlaying ? "Pause" : "Play"}
                  >
                    {audioLoading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </button>

                  <div className="ml-1 flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-slate-600" />
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.currentTarget.value))}
                      className="h-2 w-28 cursor-pointer appearance-none rounded-full bg-slate-200 accent-emerald-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600"
                      aria-label="Volume"
                    />
                  </div>

                  <Select value={String(playbackRate)} onValueChange={(v) => setPlaybackRate(parseFloat(v))}>
                    <SelectTrigger className="h-8 w-[70px] border-slate-300 text-xs text-slate-700">
                      <SelectValue placeholder="Speed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.75">0.75x</SelectItem>
                      <SelectItem value="1">1x</SelectItem>
                      <SelectItem value="1.25">1.25x</SelectItem>
                      <SelectItem value="1.5">1.5x</SelectItem>
                      <SelectItem value="2">2x</SelectItem>
                    </SelectContent>
                  </Select>

                  <a href={`/api/conversations/${encodeURIComponent(call.conversationId)}/audio`} download>
                    <Button variant="outline" size="sm" className="border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-slate-100">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-slate-700">
                    {formatDurationFromSeconds(currentTime)} / {Number.isFinite(totalDuration) && totalDuration > 0 ? formatDurationFromSeconds(totalDuration) : call.duration}
                  </span>
                </div>
              </div>

              {/* Hidden native element */}
              <audio
                ref={audioRef}
                preload="metadata"
                onLoadedMetadata={() => {
                  const d = audioRef.current?.duration
                  if (typeof d === "number" && isFinite(d) && d > 0) {
                    setTotalDuration(d)
                  }
                }}
                onCanPlay={() => setAudioLoading(false)}
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
                onEnded={() => { setIsPlaying(false); setCurrentTime(0) }}
                onError={() => { 
                  setAudioError("Audio failed to load")
                  setAudioLoading(false)
                }}
                className="hidden"
              >
                <source src={`/api/conversations/${encodeURIComponent(call.conversationId)}/audio`} type="audio/mpeg" />
              </audio>
              {audioError && <div className="mt-2 text-sm text-red-600">{audioError}</div>}
            </CardContent>
          </Card>

          {/* Transcript section (fills remaining height; its own scroll) */}
          <div className="flex-1 min-h-0 pt-6 border-t border-slate-200">
            <div className="mb-4 text-base font-semibold text-slate-800">Transcription</div>
            <Transcript
              loading={loading}
              items={transcript}
              className="h-full"
            />
          </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}