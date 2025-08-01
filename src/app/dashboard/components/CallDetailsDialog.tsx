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
          className="border-2 border-gray-300 bg-white text-gray-700 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 font-medium"
        >
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Call Details
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base font-medium">
            {call.phoneNumber} • {call.date} at {call.time} • Duration: {call.duration}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 mt-6">
          {/* Audio Player */}
          <Card className="border-2 border-blue-200 bg-blue-50/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
                  <Play className="h-5 w-5 text-blue-600" />
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
                  className="border-2 border-blue-300 bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors font-medium"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2 border-emerald-300 bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden border border-gray-300">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full w-1/3 transition-all duration-300"></div>
                </div>
                <span className="text-sm text-gray-600 font-mono font-medium">{call.duration}</span>
              </div>
            </CardContent>
          </Card>

          {/* Transcript */}
          <Card className="border-2 border-emerald-200 bg-emerald-50/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-emerald-100 rounded-lg border border-emerald-200">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                </div>
                AI Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={call.transcript}
                readOnly
                className="min-h-[150px] resize-none bg-white border-2 border-emerald-200 text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
} 