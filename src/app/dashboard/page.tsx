"use client"

import { useState } from "react"
import { Phone, Play, Pause, Download, TrendingUp, Clock, Users, PhoneCall } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { UserButton, SignIn, useUser } from "@clerk/nextjs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data with more recent dates
const callsData = [
  {
    id: "1",
    phoneNumber: "+1-555-0123",
    date: "2024-01-26",
    time: "14:30",
    duration: "5:23",
    audioUrl: "/audio/call-1.mp3",
    transcript:
      "Hello, I'd like to place an order for two premium t-shirts in size large and one baseball cap in blue. Can you help me with that? I need them shipped to 123 Main Street in New York.",
  },
  {
    id: "2",
    phoneNumber: "+1-555-0124",
    date: "2024-01-26",
    time: "16:45",
    duration: "3:12",
    audioUrl: "/audio/call-2.mp3",
    transcript:
      "Hi, I was calling to ask about your return policy. I purchased something last week and I'm not sure if I can return it. Could you please explain the process?",
  },
  {
    id: "3",
    phoneNumber: "+1-555-0125",
    date: "2024-01-25",
    time: "11:20",
    duration: "7:45",
    audioUrl: "/audio/call-3.mp3",
    transcript:
      "I'd like to order the wireless headphones I saw on your website. They're the ones that cost $149.99. I also need a phone case to go with it. Can you process this order for me?",
  },
  {
    id: "4",
    phoneNumber: "+1-555-0123",
    date: "2024-01-24",
    time: "09:15",
    duration: "2:30",
    audioUrl: "/audio/call-4.mp3",
    transcript:
      "Good morning, I'm calling to check on the status of my order. I placed it a few days ago and haven't received any updates yet.",
  },
  {
    id: "5",
    phoneNumber: "+1-555-0124",
    date: "2024-01-22",
    time: "15:22",
    duration: "4:18",
    audioUrl: "/audio/call-5.mp3",
    transcript:
      "Hello, I need to update my shipping address for an order I just placed. Is it possible to change it before it ships out?",
  },
]

export default function Dashboard() {
  const { isSignedIn, isLoaded } = useUser()
  const [isPlaying, setIsPlaying] = useState(false)

  // Calculate stats for different time periods
  const today = new Date().toISOString().split("T")[0]
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const stats = {
    totalCalls: callsData.length,
    callsToday: callsData.filter((call) => call.date === today).length,
    callsLastWeek: callsData.filter((call) => call.date >= oneWeekAgo).length,
    callsLast30Days: callsData.filter((call) => call.date >= thirtyDaysAgo).length,
  }

  const getCallAge = (date) => {
    const callDate = new Date(date)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - callDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "today"
    if (diffDays <= 7) return "week"
    if (diffDays <= 30) return "month"
    return "old"
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl w-fit mx-auto mb-6 shadow-xl">
              <Phone className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              AI Phone Hub
            </h1>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-xl border-2 border-gray-200 bg-white/95 backdrop-blur-sm",
                headerTitle: "text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent",
                headerSubtitle: "text-gray-600",
                formButtonPrimary:
                  "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                formFieldInput: "border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                footerActionLink: "text-indigo-600 hover:text-indigo-700",
              },
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg border-2 border-indigo-200">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI Phone Hub
                </h1>
                <p className="text-gray-600 mt-1">Monitor and analyze your AI-powered calls</p>
              </div>
            </div>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-12 h-12 ring-4 ring-indigo-100 border-2 border-white shadow-lg",
                  userButtonPopoverCard: "shadow-xl border-2 border-gray-200 bg-white",
                  userButtonPopoverActionButton: "hover:bg-indigo-50 text-gray-700",
                },
              }}
            />
          </div>

          {/* Account Info Bar */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl border-2 border-gray-300">
                  <PhoneCall className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Active Phone Number</p>
                  <p className="font-mono text-xl font-bold text-indigo-600">+1-555-AI-PHONE</p>
                </div>
              </div>
              
              {/* Elegant Stats Row */}
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span className="text-2xl font-bold text-gray-800">{stats.totalCalls}</span>
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Calls</p>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-800">{stats.callsToday}</span>
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Today</p>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-2xl font-bold text-gray-800">{stats.callsLastWeek}</span>
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">7 Days</p>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <PhoneCall className="h-4 w-4 text-orange-600" />
                    <span className="text-2xl font-bold text-gray-800">{stats.callsLast30Days}</span>
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">30 Days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call History */}
        <Card className="border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-indigo-50 border-b-2 border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg border border-indigo-200">
                    <Phone className="h-5 w-5 text-indigo-600" />
                  </div>
                  Call History
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2 font-medium">
                  Complete record of all incoming calls with AI transcription
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-gray-200 bg-gray-50/50">
                  <TableHead className="font-bold text-gray-700 p-6">Date & Time</TableHead>
                  <TableHead className="font-bold text-gray-700">Phone Number</TableHead>
                  <TableHead className="font-bold text-gray-700">Duration</TableHead>
                  <TableHead className="font-bold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callsData.map((call, index) => {
                  const callAge = getCallAge(call.date)
                  return (
                    <TableRow
                      key={call.id}
                      className={`border-b border-gray-200 hover:bg-indigo-50/50 transition-all duration-300 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                      }`}
                    >
                      <TableCell className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg border border-gray-200">
                            <Clock className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{call.date}</div>
                            <div className="text-sm text-gray-500">{call.time}</div>
                          </div>
                          {callAge === "today" && (
                            <Badge className="bg-emerald-100 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-100 font-medium">
                              New
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-indigo-600 font-bold">{call.phoneNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono bg-gray-100 text-gray-700 border-2 border-gray-300 font-medium">
                          {call.duration}
                        </Badge>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}