import { query, mutation } from "./_generated/server.js";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./auth.helpers.js";

// Get all matches for a user
export const getMyMatches = query({
  args: {
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const matchesA = await ctx.db
      .query("matches")
      .withIndex("by_userA", (q) => q.eq("userAId", args.userId))
      .collect();

    const matchesB = await ctx.db
      .query("matches")
      .withIndex("by_userB", (q) => q.eq("userBId", args.userId))
      .collect();

    const allMatches = [...matchesA, ...matchesB];

    // Enrich with user, trip, and last message data
    const enriched = await Promise.all(
      allMatches.map(async (match) => {
        const otherUserId =
          match.userAId === args.userId ? match.userBId : match.userAId;
        const otherUser = await ctx.db.get(otherUserId);
        const trip = await ctx.db.get(match.tripId);

        // Get last message for this match
        const lastMessage = await ctx.db
          .query("messages")
          .withIndex("by_match", (q) => q.eq("matchId", match._id))
          .order("desc")
          .first();

        // Get unread count for this user
        const allMessages = await ctx.db
          .query("messages")
          .withIndex("by_match", (q) => q.eq("matchId", match._id))
          .collect();
        const unreadCount = allMessages.filter(
          (m) => m.senderId !== args.userId && !m.isRead,
        ).length;

        return {
          ...match,
          otherUser,
          trip,
          lastMessage,
          unreadCount,
        };
      }),
    );

    // Sort by most recent message first, then by match creation date
    return enriched.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || a.createdAt;
      const bTime = b.lastMessage?.createdAt || b.createdAt;
      return bTime - aTime;
    });
  },
});

// Get a single match by ID
export const getMatchById = query({
  args: {
    matchId: v.id("matches"),
  },
  async handler(ctx, args) {
    const match = await ctx.db.get(args.matchId);
    if (!match) return null;

    const userA = await ctx.db.get(match.userAId);
    const userB = await ctx.db.get(match.userBId);
    const trip = await ctx.db.get(match.tripId);

    return { ...match, userA, userB, trip };
  },
});

// Update compatibility score on a match
export const updateCompatibilityScore = mutation({
  args: {
    matchId: v.id("matches"),
    compatibilityScore: v.number(),
  },
  async handler(ctx, args) {
    const authUser = await getAuthenticatedUser(ctx);
    const match = await ctx.db.get(args.matchId);
    if (!match) throw new Error("Match not found");
    if (match.userAId !== authUser._id && match.userBId !== authUser._id) {
      throw new Error("Not authorized to update this match");
    }

    await ctx.db.patch(args.matchId, {
      compatibilityScore: args.compatibilityScore,
    });
  },
});
