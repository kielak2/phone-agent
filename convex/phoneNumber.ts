import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add a phone number to a user
export const addPhoneNumber = mutation({
  args: {
    userId: v.id("user"),
    phoneNumber: v.string(),
    agentId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Validate phone number format (basic E.164 validation)
    if (!args.phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
      throw new Error("Phone number must be in E.164 format (e.g., +1234567890)");
    }

    // Check if phone number already exists for any user
    const existingPhoneNumber = await ctx.db
      .query("phoneNumber")
      .filter((q) => q.eq(q.field("phoneNumber"), args.phoneNumber))
      .first();

    if (existingPhoneNumber) {
      throw new Error("Phone number already exists for another user");
    }

    //Check if agentId is already associated with another user
    const existingAgentId = await ctx.db
      .query("phoneNumber")
      .filter((q) => q.eq(q.field("agentId"), args.agentId))
      .first();
      
      if (existingAgentId) {
        throw new Error("Agent ID already associated with another user");
      }

    return await ctx.db.insert("phoneNumber", {
      userId: args.userId,
      phoneNumber: args.phoneNumber,
      agentId: args.agentId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get all phone numbers for a user
export const getPhoneNumbersByUser = query({
  args: { userId: v.id("user") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("phoneNumber")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Get phone number by ID
export const getPhoneNumber = query({
  args: { phoneNumberId: v.id("phoneNumber") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.phoneNumberId);
  },
});

// Update phone number
export const updatePhoneNumber = mutation({
  args: {
    phoneNumberId: v.id("phoneNumber"),
    phoneNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Validate phone number format
    if (!args.phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
      throw new Error("Phone number must be in E.164 format (e.g., +1234567890)");
    }

    // Check if phone number already exists for any user
    const existingPhoneNumber = await ctx.db
      .query("phoneNumber")
      .filter((q) => q.eq(q.field("phoneNumber"), args.phoneNumber))
      .first();

    if (existingPhoneNumber) {
      throw new Error("Phone number already exists for another user");
    }

    return await ctx.db.patch(args.phoneNumberId, {
      phoneNumber: args.phoneNumber,
      updatedAt: now,
    });
  },
});

// Delete phone number
export const deletePhoneNumber = mutation({
  args: { phoneNumberId: v.id("phoneNumber") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.phoneNumberId);
  },
});

// Get phone number by phone number string
export const getPhoneNumberByNumber = query({
  args: { phoneNumber: v.string() },
  handler: async (ctx, args) => {
    const phoneNumbers = await ctx.db.query("phoneNumber").collect();
    return phoneNumbers.find(pn => pn.phoneNumber === args.phoneNumber);
  },
}); 