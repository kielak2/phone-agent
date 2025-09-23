'use client'
import { useState } from "react"
import { PhoneCall } from "lucide-react"
/* removed card wrappers for minimal layout */
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserButton, useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import type { ConversationModel } from "@/types/convex"
import {
  conversationToCallItem,
  sortCallsByNewest,
  filterCallsByDateRange,
} from "./utils/transforms"
import { DateFilterChip } from "./components/DateFilterChip"
import { CallDetailsDialog } from "./components/CallDetailsDialog"

export default function Dashboard() {
  const { user } = useUser()
  const [dateAfter, setDateAfter] = useState<string>("")
  const [dateBefore, setDateBefore] = useState<string>("")
  
  const convexUser = useQuery(api.user.getUserByClerkId, 
    user?.id ? { clerkId: user.id } : "skip"
  )
  
  const phoneNumbers = useQuery(api.phoneNumber.getPhoneNumbersByUser,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  )

  const conversations = useQuery(api.conversations.getConversationsByUser,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  ) as ConversationModel[] | undefined

  // Transform Convex data to UI format using our clean transform layer
  const callItems = conversations ? conversations.map(conversationToCallItem) : []
  const sortedCalls = sortCallsByNewest(callItems)
  const filteredCalls = filterCallsByDateRange(sortedCalls, dateAfter, dateBefore)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-6">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-end">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </div>

		{/* Call History */}
		<div className="">
			<div className="mb-4 flex items-start justify-between">
				<div>
					<h2 className="text-xl font-semibold text-gray-900">Call history</h2>
					<div className="mt-3 flex items-center gap-2">
                <DateFilterChip 
                  label="Date After" 
                  value={dateAfter}
                  onApply={(v) => setDateAfter(v)}
                  onClear={() => setDateAfter("")}
                />
                <DateFilterChip 
                  label="Date Before" 
                  value={dateBefore}
                  onApply={(v) => setDateBefore(v)}
                  onClear={() => setDateBefore("")}
                />
              </div>
				</div>
				<div className="hidden md:flex items-center gap-2 text-slate-600">
					<PhoneCall className="h-4 w-4 text-teal-700" />
					<span className="text-sm">Active Phone Number</span>
					<span className="font-mono text-sm rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-teal-700">
						{phoneNumbers && phoneNumbers.length > 0 ? phoneNumbers[0].phoneNumber : "+1-555-AI-PHONE"}
					</span>
				</div>
			</div>
			<div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 hover:bg-transparent cursor-default">
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Messages
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Evaluation result
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {filteredCalls.map((call) => (
                    <RowWithDialog key={call.id} call={call} />
                  ))}
                </TableBody>
              </Table>
			</div>
		</div>
      </div>
    </div>
  )
}

function RowWithDialog({ call }: { call: any }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <TableRow className="hover:bg-gray-50 cursor-pointer" onClick={() => setOpen(true)}>
        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {new Date(`${call.date}T${call.time}`).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {call.duration}
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {call.messages}
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap">
          <Badge
            className={
              call.evaluationResult === "Successful"
                ? "bg-green-100 text-green-800 border-green-200"
                : call.evaluationResult === "Failed"
                ? "bg-red-100 text-red-800 border-red-200"
                : "bg-gray-100 text-gray-800 border-gray-200"
            }
          >
            {call.evaluationResult}
          </Badge>
        </TableCell>
      </TableRow>
      <CallDetailsDialog call={call} open={open} onOpenChange={setOpen} hideTrigger />
    </>
  )
}