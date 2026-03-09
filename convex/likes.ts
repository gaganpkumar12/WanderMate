import { query, mutation } from "./_generated/server.js";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./auth.helpers.js";

// Like a user for a specific trip
export const likeUser = mutation({
  args: {
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    tripId: v.id("trips"),
  },
  async handler(ctx, args) {
    const authUser = await getAuthenticatedUser(ctx);
    if (authUser._id !== args.fromUserId) {
      throw new Error("Not authorized to like on behalf of another user");
    }

    if (args.fromUserId === args.toUserId) {
      throw new Error("Cannot like yourself");
    }

    // Check if already liked
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_from", (q) => q.eq("fromUserId", args.fromUserId))
      .filter((q) => q.eq(q.field("toUserId"), args.toUserId))
      .first();

    if (existingLike) {
      return { alreadyLiked: true, isMatch: false };
    }

    // Record the like with type
    await ctx.db.insert("likes", {
      fromUserId: args.fromUserId,
      toUserId: args.toUserId,
      tripId: args.tripId,
      type: "like",
      createdAt: Date.now(),
    });

    // Check for mutual like (match detection) — only real likes, not passes
    const mutualLike = await ctx.db
      .query("likes")
      .withIndex("by_from", (q) => q.eq("fromUserId", args.toUserId))
      .filter((q) =>
        q.and(
          q.eq(q.field("toUserId"), args.fromUserId),
          q.neq(q.field("type"), "pass")
        )
      )
      .first();

    if (mutualLike) {
      const matchId = await ctx.db.insert("matches", {
        userAId: args.fromUserId,
        userBId: args.toUserId,
        tripId: args.tripId,
        compatibilityScore: 0,
        createdAt: Date.now(),
      });

      await ctx.db.insert("notifications", {
        userId: args.fromUserId,
        type: "new_match",
        data: { matchId, otherUserId: args.toUserId, tripId: args.tripId },
        isRead: false,
        createdAt: Date.now(),
      });

      await ctx.db.insert("notifications", {
        userId: args.toUserId,
        type: "new_match",
        data: { matchId, otherUserId: args.fromUserId, tripId: args.tripId },
        isRead: false,
        createdAt: Date.now(),
      });

      return { alreadyLiked: false, isMatch: true, matchId };
    }

    // Create notification for liked user
    await ctx.db.insert("notifications", {
      userId: args.toUserId,
      type: "trip_like",
      data: { fromUserId: args.fromUserId, tripId: args.tripId },
      isRead: false,
      createdAt: Date.now(),
    });

    return { alreadyLiked: false, isMatch: false };
  },
});

// Pass on a user (skip without liking)
export const passUser = mutation({
  args: {
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    tripId: v.id("trips"),
  },
  async handler(ctx, args) {
    const authUser = await getAuthenticatedUser(ctx);
    if (authUser._id !== args.fromUserId) {
      throw new Error("Not authorized to pass on behalf of another user");
    }

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_from", (q) => q.eq("fromUserId", args.fromUserId))
      .filter((q) => q.eq(q.field("toUserId"), args.toUserId))
      .first();

    if (!existingLike) {
      await ctx.db.insert("likes", {
        fromUserId: args.fromUserId,
        toUserId: args.toUserId,
        tripId: args.tripId,
        type: "pass",
        createdAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Get likes received by a user
export const getLikesReceived = query({
  args: {
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_to", (q) => q.eq("toUserId", args.userId))
      .collect();

    // Filter out passes — only return real likes
    return likes.filter((l) => l.type !== "pass");
  },
});

// Get likes received with user and trip details
export const getLikesReceivedWithDetails = query({
  args: {
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_to", (q) => q.eq("toUserId", args.userId))
      .collect();

    // Filter out passes — only show real likes
    const realLikes = likes.filter((l) => l.type !== "pass");

    // Check which of these have become mutual matches
    const myLikes = await ctx.db
      .query("likes")
      .withIndex("by_from", (q) => q.eq("fromUserId", args.userId))
      .collect();
    const myLikedUserIds = new Set(
      myLikes
        .filter((l) => l.type !== "pass")
        .map((l) => l.toUserId)
    );

    const enriched = await Promise.all(
      realLikes.map(async (like) => {
        const fromUser = await ctx.db.get(like.fromUserId);
        const trip = await ctx.db.get(like.tripId);
        const isMutual = myLikedUserIds.has(like.fromUserId);
        return {
          ...like,
          fromUser,
          trip,
          isMutual,
        };
      })
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  },
});
