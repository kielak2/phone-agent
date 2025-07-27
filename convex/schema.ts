import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(), // Clerk user ID
    email: v.optional(v.string()), // Cached from Clerk
    createdAt: v.number(), // Unix timestamp
    updatedAt: v.number(), // Unix timestamp
    isActive: v.boolean(), // Account status
  })
    .index("by_clerk_id", ["clerkId"]),

  phoneNumbers: defineTable({
    userId: v.id("users"), // Reference to user
    phoneNumber: v.string(), // E.164 format
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"]),
}); 