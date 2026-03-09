import { query, mutation } from "./_generated/server.js";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./auth.helpers.js";

// Send a message in a match conversation
export const sendMessage = mutation({
  args: {
    matchId: v.id("matches"),
    senderId: v.id("users"),
    text: v.string(),
    imageUrl: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const authUser = await getAuthenticatedUser(ctx);
    if (authUser._id !== args.senderId) {
      throw new Error("Not authorized to send messages as another user");
    }

    const match = await ctx.db.get(args.matchId);
    if (!match) throw new Error("Match not found");
    if (match.userAId !== args.senderId && match.userBId !== args.senderId) {
      throw new Error("Not authorized to send messages in this match");
    }

    const messageId = await ctx.db.insert("messages", {
      matchId: args.matchId,
      senderId: args.senderId,
      text: args.text,
      imageUrl: args.imageUrl,
      isRead: false,
      createdAt: Date.now(),
    });

    const otherUserId =
      match.userAId === args.senderId ? match.userBId : match.userAId;
    const sender = await ctx.db.get(args.senderId);

    await ctx.db.insert("notifications", {
      userId: otherUserId,
      type: "new_message",
      data: {
        matchId: args.matchId,
        senderId: args.senderId,
        senderName: sender?.firstName || "Someone",
        preview: args.text.length > 50 ? args.text.slice(0, 50) + "…" : args.text,
      },
      isRead: false,
      createdAt: Date.now(),
    });

    return messageId;
  },
});

// Get all messages for a match conversation
export const getMessages = query({
  args: {
    matchId: v.id("matches"),
  },
  async handler(ctx, args) {
    const authUser = await getAuthenticatedUser(ctx);

    // Verify caller is a participant in this match
    const match = await ctx.db.get(args.matchId);
    if (!match) throw new Error("Match not found");
    if (match.userAId !== authUser._id && match.userBId !== authUser._id) {
      throw new Error("Not authorized to view messages in this match");
    }

    return await ctx.db
      .query("messages")
      .withIndex("by_match", (q) => q.eq("matchId", args.matchId))
      .order("asc")
      .collect();
  },
});

// Mark all messages from other user as read in a match
export const markAsRead = mutation({
  args: {
    matchId: v.id("matches"),
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const authUser = await getAuthenticatedUser(ctx);
    if (authUser._id !== args.userId) {
      throw new Error("Not authorized to mark messages as read for another user");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_match", (q) => q.eq("matchId", args.matchId))
      .collect();

    const unread = messages.filter(
      (m) => m.senderId !== args.userId && !m.isRead,
    );

    await Promise.all(
      unread.map((m) => ctx.db.patch(m._id, { isRead: true })),
    );

    return unread.length;
  },
});

// Get unread message count for a user across all matches
export const getUnreadCount = query({
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

    let total = 0;
    for (const match of allMatches) {
      const messages = await ctx.db
        .query("messages")
        .withIndex("by_match", (q) => q.eq("matchId", match._id))
        .collect();
      total += messages.filter(
        (m) => m.senderId !== args.userId && !m.isRead,
      ).length;
    }

    return total;
  },
});

// Get unread count for a specific match
export const getUnreadCountForMatch = query({
  args: {
    matchId: v.id("matches"),
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_match", (q) => q.eq("matchId", args.matchId))
      .collect();

    return messages.filter(
      (m) => m.senderId !== args.userId && !m.isRead,
    ).length;
  },
});

// Get last message for a match
export const getLastMessage = query({
  args: {
    matchId: v.id("matches"),
  },
  async handler(ctx, args) {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_match", (q) => q.eq("matchId", args.matchId))
      .order("desc")
      .first();

    return messages;
  },
});
