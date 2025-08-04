"use client"
import { useState } from "react"
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

interface CallData {
  id: string
  phoneNumber: string
  date: string
  time: string
  duration: string
  audioUrl: string
  transcript: string
}

interface CallDetailsDialogProps {
  call: CallData
}

export function CallDetailsDialog({ call }: CallDetailsDialogProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border border-slate-300 bg-white text-slate-800 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
        >
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto border border-slate-200 bg-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Call Details
          </DialogTitle>
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
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="border border-teal-300 bg-white text-teal-700 transition-colors hover:border-teal-500 hover:bg-teal-600 hover:text-white"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span className="ml-2">{isPlaying ? "Pause" : "Play"}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border border-slate-300 bg-white text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-100"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <div className="h-3 flex-1 overflow-hidden rounded-full border border-slate-300 bg-slate-200">
                  <div className="h-full w-1/3 rounded-full bg-teal-600 transition-all duration-300" />
                </div>
                <span className="font-mono text-sm text-slate-700">{call.duration}</span>
              </div>
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
                value={call.transcript}
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