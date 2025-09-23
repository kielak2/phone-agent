// Transformation layer between Convex data and UI components
import type { ConversationModel } from "@/types/convex"
import type { CallListItem } from "@/types/ui"

/**
 * Transform a Convex conversation record into a UI call list item
 */
export function conversationToCallItem(conversation: ConversationModel): CallListItem {
  const dateObj = new Date(conversation.startTime * 1000)
  const durationSeconds = conversation.duration
  
  // Map callSuccessful to evaluation result
  const evaluationResult = conversation.callSuccessful === "success" ? "Successful" : 
                          conversation.callSuccessful === "failure" ? "Failed" : "Unknown"
  
  // Estimate messages based on duration (rough estimate: 1 message per 15 seconds)
  const estimatedMessages = Math.max(1, Math.floor(durationSeconds / 15))
  
  return {
    id: conversation._id,
    conversationId: conversation.conversationId,
    phoneNumber: conversation.customerPhoneNumber,
    date: dateObj.toISOString().split('T')[0],
    time: dateObj.toTimeString().slice(0, 5),
    duration: `${Math.floor(durationSeconds / 60)}:${String(durationSeconds % 60).padStart(2, '0')}`,
    formattedDuration: durationSeconds,
    messages: estimatedMessages,
    evaluationResult: evaluationResult as "Successful" | "Failed" | "Unknown",
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

// removed call statistics and age helpers as part of UI simplification

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

/**
 * Filter calls by date range
 */
export function filterCallsByDateRange(
  calls: CallListItem[], 
  dateAfter?: string, 
  dateBefore?: string
): CallListItem[] {
  return calls.filter(call => {
    const callDate = call.date
    
    if (dateAfter && callDate < dateAfter) {
      return false
    }
    
    if (dateBefore && callDate > dateBefore) {
      return false
    }
    
    return true
  })
}
