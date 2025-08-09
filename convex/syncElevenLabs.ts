"use node";

import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

type SyncResult = { success: boolean; savedCount: number; skippedCount: number; processed: number };
export const syncConversationsFromElevenLabs = action({
  args: {},
  handler: async (ctx): Promise<SyncResult> => {
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) throw new Error("ELEVENLABS_API_KEY not configured");

    const client = new ElevenLabsClient({ apiKey: key });

    const mostRecent = await ctx.runQuery(api.conversations.getMostRecentConversation);
    const cutoff: number = mostRecent ? mostRecent.startTime + 24 * 60 * 60 : 0;

    const resp = await client.conversationalAi.conversations.list();
    const items: any[] = resp.conversations.filter((c: any) => c.startTimeUnixSecs > cutoff);

    let savedCount = 0, skippedCount = 0;
    for (const conv of items) {
      const userId = await ctx.runQuery(api.user.getUserByAgentId, { agentId: conv.agentId });
      if (!userId) continue;

      const existing = await ctx.runQuery(api.conversations.getConversationsByUser, { userId });
      if (existing.some((e: any) => e.conversationId === conv.conversationId)) { skippedCount++; continue; }

      const now = Date.now();
      await ctx.runMutation(api.conversations.addConversation, {
        userId,
        conversationId: conv.conversationId,
        agentId: conv.agentId,
        agentName: conv.agentName ?? "Unknown Agent",
        startTime: conv.startTimeUnixSecs,
        duration: conv.callDurationSecs,
        callSuccessful: (conv.callSuccessful ?? "unknown"),
        updatedAt: now,
      });
      savedCount++;
    }
    console.log(`Synced ${savedCount} conversations, skipped ${skippedCount} conversations`);
    return { success: true, savedCount, skippedCount, processed: items.length };
  },
}); 