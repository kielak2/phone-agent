'use client'
import { Phone, TrendingUp, Clock, Users, PhoneCall, Timer } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserButton, useUser } from "@clerk/nextjs"
import { CallDetailsDialog } from "./components/CallDetailsDialog"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"

export default function Dashboard() {
  const { user } = useUser()
  
  const convexUser = useQuery(api.user.getUserByClerkId, 
    user?.id ? { clerkId: user.id } : "skip"
  )
  
  const phoneNumbers = useQuery(api.phoneNumber.getPhoneNumbersByUser,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  )

  const conversations = useQuery(api.conversations.getConversationsByUser,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  ) as any[] | undefined

  const rows = (conversations ?? [])
    .sort((a, b) => b.startTime - a.startTime)
    .map((c) => {
      const dateObj = new Date((c.startTime ?? 0) * 1000)
      const date = dateObj.toISOString().split('T')[0]
      const time = dateObj.toTimeString().slice(0,5)
      const duration = `${Math.floor((c.duration ?? 0) / 60)}:${String((c.duration ?? 0) % 60).padStart(2,'0')}`
      return {
        id: c._id as string,
        conversationId: c.conversationId as string,
        phoneNumber: c.customerPhoneNumber as string,
        date,
        time,
        duration,
      }
    })

  const today = new Date().toISOString().split("T")[0]
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const stats = {
    totalCalls: rows.length,
    callsToday: rows.filter((r) => r.date === today).length,
    callsLastWeek: rows.filter((r) => r.date >= oneWeekAgo).length,
    callsLast30Days: rows.filter((r) => r.date >= thirtyDaysAgo).length,
  }

  const getCallAge = (date: string) => {
    const callDate = new Date(date)
    const now = new Date()
    const diffDays = Math.ceil(Math.abs(now.getTime() - callDate.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 1) return "today"
    if (diffDays <= 7) return "week"
    if (diffDays <= 30) return "month"
    return "old"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-teal-200 bg-teal-600 p-3 shadow-md">
              <Phone className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                AI Phone Hub
              </h1>
              <p className="mt-1 text-slate-600">Monitor and analyze your AI-powered calls</p>
            </div>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-11 h-11 ring-4 ring-teal-100 border-2 border-white shadow-md",
                userButtonPopoverCard: "shadow-xl border border-slate-200 bg-white",
                userButtonPopoverActionButton: "hover:bg-teal-50 text-slate-700",
              },
            }}
          />
        </div>

        {/* Account + Stats */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-md backdrop-blur">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl border border-slate-300 bg-slate-100 p-3">
                <PhoneCall className="h-6 w-6 text-teal-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Active Phone Number</p>
                <p className="font-mono text-lg font-semibold text-teal-700">
                  {phoneNumbers && phoneNumbers.length > 0 
                    ? phoneNumbers[0].phoneNumber 
                    : "+1-555-AI-PHONE"}
                </p>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 md:w-auto">
              <StatChip icon={<TrendingUp className="h-4 w-4 text-teal-700" />} label="Total Calls" value={stats.totalCalls} />
              <StatChip icon={<Clock className="h-4 w-4 text-teal-700" />} label="Today" value={stats.callsToday} />
              <StatChip icon={<Users className="h-4 w-4 text-teal-700" />} label="7 Days" value={stats.callsLastWeek} />
              <StatChip icon={<PhoneCall className="h-4 w-4 text-teal-700" />} label="30 Days" value={stats.callsLast30Days} />
            </div>
          </div>
        </div>

        {/* Call History */}
        <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <CardHeader className="border-b border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
                  <div className="rounded-lg border border-teal-200 bg-teal-50 p-2">
                    <Phone className="h-5 w-5 text-teal-700" />
                  </div>
                  Call History
                </CardTitle>
                <CardDescription className="mt-1 text-slate-600">
                  Complete record of all incoming calls with AI transcription
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative overflow-x-auto">
              <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white" />
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-200 bg-slate-50/70">
                    <TableHead className="p-5 font-semibold text-slate-700">Date & Time</TableHead>
                    <TableHead className="font-semibold text-slate-700">Phone Number</TableHead>
                    <TableHead className="text-right font-semibold text-slate-700">Duration</TableHead>
                    <TableHead className="pr-5 text-right font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((call, index) => {
                    const callAge = getCallAge(call.date)
                    return (
                      <TableRow
                        key={call.id}
                        className={`group border-b border-slate-200 transition-all duration-200 hover:bg-teal-50/50 ${
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                        }`}
                      >
                        <TableCell className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg border border-slate-200 bg-slate-100 p-2">
                              <Clock className="h-4 w-4 text-slate-600" />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-900">
                                {call.date}
                              </span>
                              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                                {call.time}
                              </span>
                            </div>
                            {callAge === "today" && (
                              <Badge className="ml-1 border border-teal-200 bg-teal-50 text-teal-800">
                                New
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono font-semibold text-teal-700">
                          {call.phoneNumber}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 font-mono text-sm text-slate-700">
                            <Timer className="h-3.5 w-3.5 text-slate-500" />
                            {call.duration}
                          </span>
                        </TableCell>
                        <TableCell className="pr-5 text-right">
                          <CallDetailsDialog call={call} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-1 flex items-center justify-center gap-2">
        {icon}
        <span className="text-xl font-bold text-slate-900">{value}</span>
      </div>
      <p className="text-center text-xs uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  )
}