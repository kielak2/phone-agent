import { mutation } from "./_generated/server"
import { v } from "convex/values"

export const addTestConversations = mutation({
  args: {
    userId: v.id("user"),
    count: v.number(),
    agentId: v.optional(v.string()),
    agentName: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    secondsBetweenCalls: v.optional(v.number()),
  },
  async handler(ctx, args) {
    const nowMs = Date.now()
    const nowSecs = Math.floor(nowMs / 1000)
    const insertCount = Math.min(Math.max(args.count, 0), 10000)
    const baseAgentId = args.agentId ?? "test-agent"
    const baseAgentName = args.agentName ?? "Test Agent"
    const spacing = Math.max(args.secondsBetweenCalls ?? 300, 1)

    const randomInt = (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    const randomPhone = (): string => {
      if (args.phoneNumber) return args.phoneNumber
      // Generate a Polish-like 9-digit local number; UI formats to +48 later
      const digits = Array.from({ length: 9 }, () => String(randomInt(0, 9))).join("")
      return digits
    }

    let inserted = 0
    for (let i = 0; i < insertCount; i++) {
      const conversationId = `test-${nowMs}-${i}-${Math.random().toString(36).slice(2, 10)}`
      const startTime = nowSecs - i * spacing - randomInt(0, 60)
      const duration = randomInt(60, 5 * 60) // 1–5 minutes
      const callSuccessful = ["success", "failure", "unknown"][randomInt(0, 2)] as
        | "success"
        | "failure"
        | "unknown"

      await ctx.db.insert("conversation", {
        userId: args.userId,
        conversationId,
        agentId: baseAgentId,
        agentName: baseAgentName,
        startTime,
        duration,
        callSuccessful,
        customerPhoneNumber: randomPhone(),
        updatedAt: Date.now(),
      })
      inserted++
    }

    return { inserted }
  },
})

export const deleteUserConversations = mutation({
  args: { userId: v.id("user") },
  async handler(ctx, { userId }) {
    const docs = await ctx.db
      .query("conversation")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect()
    let deleted = 0
    for (const doc of docs) {
      await ctx.db.delete(doc._id)
      deleted++
    }
    return { deleted }
  },
})


