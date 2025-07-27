import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add a phone number to a user
export const addPhoneNumber = mutation({
  args: {
    userId: v.id("users"),
    phoneNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Validate phone number format (basic E.164 validation)
    if (!args.phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
      throw new Error("Phone number must be in E.164 format (e.g., +1234567890)");
    }

    // Check if phone number already exists for this user
    const existingPhoneNumber = await ctx.db
      .query("phoneNumbers")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("phoneNumber"), args.phoneNumber))
      .first();

    if (existingPhoneNumber) {
      throw new Error("Phone number already exists for this user");
    }

    return await ctx.db.insert("phoneNumbers", {
      userId: args.userId,
      phoneNumber: args.phoneNumber,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get all phone numbers for a user
export const getPhoneNumbersByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("phoneNumbers")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Get phone number by ID
export const getPhoneNumber = query({
  args: { phoneNumberId: v.id("phoneNumbers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.phoneNumberId);
  },
});

// Update phone number
export const updatePhoneNumber = mutation({
  args: {
    phoneNumberId: v.id("phoneNumbers"),
    phoneNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Validate phone number format
    if (!args.phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
      throw new Error("Phone number must be in E.164 format (e.g., +1234567890)");
    }

    // Check if the new phone number already exists for this user
    const existingPhoneNumber = await ctx.db.get(args.phoneNumberId);
    if (!existingPhoneNumber) {
      throw new Error("Phone number not found");
    }

    const duplicatePhoneNumber = await ctx.db
      .query("phoneNumbers")
      .withIndex("by_user_id", (q) => q.eq("userId", existingPhoneNumber.userId))
      .filter((q) => 
        q.and(
          q.eq(q.field("phoneNumber"), args.phoneNumber),
          q.neq(q.field("_id"), args.phoneNumberId)
        )
      )
      .first();

    if (duplicatePhoneNumber) {
      throw new Error("Phone number already exists for this user");
    }

    return await ctx.db.patch(args.phoneNumberId, {
      phoneNumber: args.phoneNumber,
      updatedAt: now,
    });
  },
});

// Delete phone number
export const deletePhoneNumber = mutation({
  args: { phoneNumberId: v.id("phoneNumbers") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.phoneNumberId);
  },
});

// Get phone number by phone number string
export const getPhoneNumberByNumber = query({
  args: { phoneNumber: v.string() },
  handler: async (ctx, args) => {
    const phoneNumbers = await ctx.db.query("phoneNumbers").collect();
    return phoneNumbers.find(pn => pn.phoneNumber === args.phoneNumber);
  },
}); 