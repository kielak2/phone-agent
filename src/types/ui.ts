// UI-specific types for dashboard components

export interface CallListItem {
  id: string
  conversationId: string
  phoneNumber: string
  date: string
  time: string
  duration: string
  formattedDuration: number // duration in seconds for calculations
  messages: number
  evaluationResult: "Successful" | "Failed" | "Unknown"
}

// Removed CallStats and CallAge as part of UI simplification


export type TranscriptItem = {
  role: "user" | "agent"
  message: string
}
