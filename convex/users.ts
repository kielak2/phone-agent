import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update user from Clerk webhook
export const syncUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      return await ctx.db.patch(existingUser._id, {
        email: args.email,
        isActive: args.isActive,
        updatedAt: now,
      });
    } else {
      // Create new user
      return await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        createdAt: now,
        updatedAt: now,
        isActive: args.isActive,
      });
    }
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Get user by Convex ID
export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Get all users (for admin purposes)
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Deactivate user (for Clerk webhook)
export const deactivateUser = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (user) {
      return await ctx.db.patch(user._id, {
        isActive: false,
        updatedAt: Date.now(),
      });
    }
    return null;
  },
});

// Delete user (for Clerk webhook)
export const deleteUser = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (user) {
      // First delete all phone numbers associated with this user
      const phoneNumbers = await ctx.db
        .query("phoneNumbers")
        .withIndex("by_user_id", (q) => q.eq("userId", user._id))
        .collect();

      for (const phoneNumber of phoneNumbers) {
        await ctx.db.delete(phoneNumber._id);
      }

      // Then delete the user
      return await ctx.db.delete(user._id);
    }
    return null;
  },
}); 