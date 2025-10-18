import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitContactMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    shopWebsiteUrl: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactMessage", {
      name: args.name,
      email: args.email,
      shopWebsiteUrl: args.shopWebsiteUrl,
      message: args.message,
    });
  },
});


