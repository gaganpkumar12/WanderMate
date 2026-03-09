import { query, mutation } from "./_generated/server.js";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./auth.helpers.js";

// Get all trips for current user
export const getUserTrips = query({
  args: {
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    return await ctx.db
      .query("trips")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Get a trip by ID
export const getTripById = query({
  args: {
    tripId: v.id("trips"),
  },
  async handler(ctx, args) {
    return await ctx.db.get(args.tripId);
  },
});

// Create a new trip
export const createTrip = mutation({
  args: {
    userId: v.id("users"),
    destination: v.string(),
    country: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    tripVibe: v.string(),
    tripPreferences: v.array(v.string()),
    budget: v.string(),
    groupSize: v.number(),
    coverImageUrl: v.optional(v.string()),
    isPublic: v.boolean(),
  },
  async handler(ctx, args) {
    const authUser = await getAuthenticatedUser(ctx);
    if (authUser._id !== args.userId) {
      throw new Error("Not authorized to create trips for another user");
    }

    const tripId = await ctx.db.insert("trips", {
      userId: args.userId,
      destination: args.destination,
      country: args.country,
      startDate: args.startDate,
      endDate: args.endDate,
      tripVibe: args.tripVibe,
      tripPreferences: args.tripPreferences,
      budget: args.budget,
      groupSize: args.groupSize,
      coverImageUrl: args.coverImageUrl || "",
      isPublic: args.isPublic,
      status: "planning",
      createdAt: Date.now(),
    });

    return await ctx.db.get(tripId);
  },
});

// Update a trip
export const updateTrip = mutation({
  args: {
    tripId: v.id("trips"),
    destination: v.optional(v.string()),
    country: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    tripVibe: v.optional(v.string()),
    tripPreferences: v.optional(v.array(v.string())),
    budget: v.optional(v.string()),
    groupSize: v.optional(v.number()),
    coverImageUrl: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
    status: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const authUser = await getAuthenticatedUser(ctx);
    const trip = await ctx.db.get(args.tripId);
    if (!trip) throw new Error("Trip not found");
    if (trip.userId !== authUser._id) {
      throw new Error("Not authorized to update this trip");
    }

    const { tripId, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(tripId, cleanUpdates);
    return await ctx.db.get(tripId);
  },
});

// Delete a trip
export const deleteTrip = mutation({
  args: {
    tripId: v.id("trips"),
  },
  async handler(ctx, args) {
    const authUser = await getAuthenticatedUser(ctx);
    const trip = await ctx.db.get(args.tripId);
    if (!trip) throw new Error("Trip not found");
    if (trip.userId !== authUser._id) {
      throw new Error("Not authorized to delete this trip");
    }

    await ctx.db.delete(args.tripId);
    return { success: true };
  },
});

// Get public trips (for discovery)
export const getPublicTrips = query({
  args: {
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    // Get all public trips except the current user's
    const publicTrips = await ctx.db
      .query("trips")
      .filter((q) =>
        q.and(
          q.eq(q.field("isPublic"), true),
          q.neq(q.field("userId"), args.userId)
        )
      )
      .collect();

    // Filter out trips where user has already liked/disliked
    const userLikes = await ctx.db
      .query("likes")
      .withIndex("by_from", (q) => q.eq("fromUserId", args.userId))
      .collect();

    const likedUserIds = new Set(userLikes.map((l) => l.toUserId));
    return publicTrips.filter((t) => !likedUserIds.has(t.userId));
  },
});
