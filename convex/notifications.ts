import { query, mutation } from "./_generated/server.js";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./auth.helpers.js";

// Get notifications for a user
export const getMyNotifications = query({
  args: {
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    return await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get unread notification count
export const getUnreadCount = query({
  args: {
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    return notifications.filter((n) => !n.isRead).length;
  },
});

// Mark a single notification as read
export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  async handler(ctx, args) {
    const authUser = await getAuthenticatedUser(ctx);
    const notification = await ctx.db.get(args.notificationId);
    if (!notification) throw new Error("Notification not found");
    if (notification.userId !== authUser._id) {
      throw new Error("Not authorized to mark this notification as read");
    }

    await ctx.db.patch(args.notificationId, { isRead: true });
  },
});

// Mark all notifications as read for a user
export const markAllAsRead = mutation({
  args: {
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const authUser = await getAuthenticatedUser(ctx);
    if (authUser._id !== args.userId) {
      throw new Error("Not authorized to mark notifications for another user");
    }

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => ctx.db.patch(n._id, { isRead: true })));

    return unread.length;
  },
});
