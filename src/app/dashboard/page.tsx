 import { Phone, TrendingUp, Clock, Users, PhoneCall } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserButton} from "@clerk/nextjs"
import { CallDetailsDialog } from "./components/CallDetailsDialog"

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
                        <CallDetailsDialog call={call} />
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