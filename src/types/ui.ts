// UI-specific types for dashboard components

export interface CallListItem {
  id: string
  conversationId: string
  phoneNumber: string
  date: string
  time: string
  duration: string
  formattedDuration: number // duration in seconds for calculations
}

export interface CallStats {
  totalCalls: number
  callsToday: number
  callsLastWeek: number
  callsLast30Days: number
}

export type CallAge = "today" | "week" | "month" | "old"


export type TranscriptItem = {
  role: "user" | "agent"
  message: string
}
