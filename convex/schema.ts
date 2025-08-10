import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  user: defineTable({
    clerkId: v.string(),
    email: v.optional(v.string()),
    updatedAt: v.number(),
    isActive: v.boolean(),
  })
    .index("by_clerk_id", ["clerkId"]),

  phoneNumber: defineTable({
    userId: v.id("user"),
    agentId: v.string(),
    phoneNumber: v.string(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_agent_id", ["agentId"]),

  conversation: defineTable({
    userId: v.id("user"),
    conversationId: v.string(),
    agentId: v.string(),
    agentName: v.string(),
    startTime: v.number(),
    duration: v.number(),
    callSuccessful: v.union(v.literal("success"), v.literal("failure"), v.literal("unknown")),
    customerPhoneNumber: v.string(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_call_successful", ["callSuccessful"])
    .index("by_start_time", ["startTime"])
    
}); 

