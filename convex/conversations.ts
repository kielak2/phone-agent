import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { api } from "./_generated/api";
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
    customerPhoneNumber: v.string(),
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
      customerPhoneNumber: args.customerPhoneNumber || "unknown",
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

export const getConversationsByUserPaginated = query({
  args: {
    userId: v.id("user"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { page, isDone, continueCursor } = await ctx.db
      .query("conversation")
      .withIndex("by_user_id_start_time", (q) => q.eq("userId", args.userId))
      .order("desc")
      .paginate(args.paginationOpts);
    return { page, isDone, continueCursor };
  },
});

// Query to get the most recent conversation by startTime across all users
export const getMostRecentConversation = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("conversation")
      .withIndex("by_start_time")
      .order("desc")
      .first();
  },
});

export const triggerConversationSync = mutation({
  args: {},
  async handler(ctx) {
    await ctx.scheduler.runAfter(0, api.syncElevenLabs.syncConversationsFromElevenLabs);
    return { enqueued: true };
  },
});
