// Transformation layer between Convex data and UI components
import type { ConversationModel } from "@/types/convex"
import type { CallListItem, CallStats, CallAge } from "@/types/ui"

/**
 * Transform a Convex conversation record into a UI call list item
 */
export function conversationToCallItem(conversation: ConversationModel): CallListItem {
  const dateObj = new Date(conversation.startTime * 1000)
  const durationSeconds = conversation.duration
  
  return {
    id: conversation._id,
    conversationId: conversation.conversationId,
    phoneNumber: conversation.customerPhoneNumber,
    date: dateObj.toISOString().split('T')[0],
    time: dateObj.toTimeString().slice(0, 5),
    duration: `${Math.floor(durationSeconds / 60)}:${String(durationSeconds % 60).padStart(2, '0')}`,
    formattedDuration: durationSeconds,
  }
}

/**
 * Sort call items by start time (newest first)
 */
export function sortCallsByNewest(calls: CallListItem[]): CallListItem[] {
  return [...calls].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}:00`)
    const dateB = new Date(`${b.date}T${b.time}:00`)
    return dateB.getTime() - dateA.getTime()
  })
}

/**
 * Calculate call statistics from call list
 */
export function calculateCallStats(calls: CallListItem[]): CallStats {
  const today = new Date().toISOString().split("T")[0]
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  return {
    totalCalls: calls.length,
    callsToday: calls.filter((call) => call.date === today).length,
    callsLastWeek: calls.filter((call) => call.date >= oneWeekAgo).length,
    callsLast30Days: calls.filter((call) => call.date >= thirtyDaysAgo).length,
  }
}

/**
 * Determine the age category of a call
 */
export function getCallAge(date: string): CallAge {
  const callDate = new Date(date)
  const now = new Date()
  const diffDays = Math.ceil(Math.abs(now.getTime() - callDate.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return "today"
  if (diffDays <= 7) return "week"
  if (diffDays <= 30) return "month"
  return "old"
}

/**
 * Parse duration string (MM:SS) to seconds
 */
export function parseDurationToSeconds(duration: string): number {
  const [minutes, seconds] = duration.split(":").map((n) => parseInt(n, 10))
  if (Number.isFinite(minutes) && Number.isFinite(seconds)) {
    return minutes * 60 + seconds
  }
  return 0
}

/**
 * Format seconds to MM:SS string
 */
export function formatDurationFromSeconds(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00"
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`
}
