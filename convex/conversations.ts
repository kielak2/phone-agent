import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation to add a new conversation
export const addConversation = mutation({
  args: {
    userId: v.id("user"),
    conversationId: v.string(),
    agentId: v.string(),
    agentName: v.string(),
    startTime: v.number(),
    duration: v.number(),
    callSuccessful: v.union(v.literal("success"), v.literal("failure"), v.literal("unknown")),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("conversation", {
      userId: args.userId,
      conversationId: args.conversationId,
      agentId: args.agentId,
      agentName: args.agentName,
      startTime: args.startTime,
      duration: args.duration,
      callSuccessful: args.callSuccessful,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
    });
  },
});

// Query to get conversations by userId
export const getConversationsByUser = query({
  args: { userId: v.id("user") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversation")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();
  },
}); 