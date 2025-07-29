"use client"

import { useState } from "react"
import { Phone, Play, Pause, Download } from "lucide-react"
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
    date: "2024-01-26", // Today
    time: "14:30",
    duration: "5:23",
    audioUrl: "/audio/call-1.mp3",
    transcript:
      "Hello, I'd like to place an order for two premium t-shirts in size large and one baseball cap in blue. Can you help me with that? I need them shipped to 123 Main Street in New York.",
  },
]

export default function Dashboard() {
  const { isSignedIn, isLoaded } = useUser()
  const [isPlaying, setIsPlaying] = useState(false)

  // Calculate stats for different time periods
  const today = new Date().toISOString().split("T")[0] // Get today's date in YYYY-MM-DD format
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const stats = {
    totalCalls: callsData.length,
    callsToday: callsData.filter((call) => call.date === today).length,
    callsLastWeek: callsData.filter((call) => call.date >= oneWeekAgo).length,
    callsLast30Days: callsData.filter((call) => call.date >= thirtyDaysAgo).length,
  }

  const getCallAge = (date: string) => {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg w-fit mx-auto mb-4">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              AI Phone Dashboard
            </h1>
            <p className="text-gray-600">Zaloguj się, aby uzyskać dostęp do panelu</p>
          </div>
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-lg border-0 bg-white/95 backdrop-blur-sm",
                headerTitle: "text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
                headerSubtitle: "text-gray-600",
                formButtonPrimary: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
                formFieldInput: "focus:ring-2 focus:ring-blue-500",
                footerActionLink: "text-blue-600 hover:text-blue-700"
              }
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                AI Phone Dashboard
              </h1>
            </div>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-lg border-0",
                  userButtonPopoverActionButton: "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                }
              }}
            />
          </div>
          <p className="text-muted-foreground">Monitor your AI phone calls and transcripts</p>

          {/* Account Info */}
          <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Account Phone Number</p>
                <p className="font-mono text-lg font-semibold text-blue-600">+1-555-AI-PHONE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {/* Total Calls */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Wszystkie Rozmowy</CardTitle>
              <Phone className="h-4 w-4 text-white/80" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">{stats.totalCalls}</div>
              <p className="text-xs text-white/70">Cały czas</p>
            </CardContent>
          </Card>

          {/* Today */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Dzisiaj</CardTitle>
              <Phone className="h-4 w-4 text-white/80" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">{stats.callsToday}</div>
              <p className="text-xs text-white/70">Rozmowy dzisiaj</p>
            </CardContent>
          </Card>

          {/* Last 7 Days */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Ostatnie 7 Dni</CardTitle>
              <Phone className="h-4 w-4 text-white/80" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">{stats.callsLastWeek}</div>
              <p className="text-xs text-white/70">Ten tydzień</p>
            </CardContent>
          </Card>

          {/* Last 30 Days */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Ostatnie 30 Dni</CardTitle>
              <Phone className="h-4 w-4 text-white/80" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">{stats.callsLast30Days}</div>
              <p className="text-xs text-white/70">Ten miesiąc</p>
            </CardContent>
          </Card>
        </div>

        {/* Call History */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <CardTitle className="text-xl">Call History</CardTitle>
            <CardDescription>All incoming calls with recordings and transcripts</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold">Date/Time</TableHead>
                  <TableHead className="font-semibold">Phone Number</TableHead>
                  <TableHead className="font-semibold">Duration</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callsData.map((call) => {
                  const callAge = getCallAge(call.date)
                  return (
                    <TableRow
                      key={call.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-medium">{call.date}</div>
                            <div className="text-sm text-muted-foreground">{call.time}</div>
                          </div>
                          {callAge === "today" && (
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">New</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-blue-600">{call.phoneNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {call.duration}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-200"
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-sm">
                            <DialogHeader>
                              <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Call Details
                              </DialogTitle>
                              <DialogDescription className="text-base">
                                {call.phoneNumber} • {call.date} at {call.time} • Duration: {call.duration}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6">
                              {/* Audio Player */}
                              <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-purple-50">
                                <CardHeader>
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <Play className="h-5 w-5 text-blue-600" />
                                    Call Recording
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex items-center gap-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setIsPlaying(!isPlaying)}
                                      className="hover:bg-blue-500 hover:text-white transition-colors"
                                    >
                                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                      {isPlaying ? "Pause" : "Play"}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="hover:bg-green-500 hover:text-white transition-colors bg-transparent"
                                    >
                                      <Download className="w-4 h-4 mr-2" />
                                      Download
                                    </Button>
                                    <div className="flex-1 bg-white/60 h-3 rounded-full overflow-hidden">
                                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full w-1/3 transition-all duration-300"></div>
                                    </div>
                                    <span className="text-sm text-muted-foreground font-mono">{call.duration}</span>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Transcript */}
                              <Card className="border-0 shadow-md bg-gradient-to-r from-emerald-50 to-teal-50">
                                <CardHeader>
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                                    Call Transcript
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <Textarea
                                    value={call.transcript}
                                    readOnly
                                    className="min-h-[150px] resize-none bg-white/60 border-0 focus:ring-2 focus:ring-emerald-500"
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
