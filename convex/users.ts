import { query, mutation } from "./_generated/server.js";
import { v } from "convex/values";
import { getAuthenticatedUser, getIdentity } from "./auth.helpers.js";

// Create or update user from Clerk auth (with full onboarding data)
export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    username: v.string(),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    dob: v.optional(v.string()),
    gender: v.optional(v.string()),
    travelStyles: v.optional(v.array(v.string())),
    dietaryRestrictions: v.optional(v.array(v.string())),
    languages: v.optional(v.array(v.string())),
    interests: v.optional(v.array(v.string())),
    financialNature: v.optional(v.string()),
  },
  async handler(ctx, args) {
    // Verify the caller's identity matches the clerkId
    const identity = await getIdentity(ctx);
    if (!identity) throw new Error("Not authenticated");
    if (identity.subject !== args.clerkId) {
      throw new Error("Not authorized to modify this user");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const userData = {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      username: args.username,
      bio: args.bio || "",
      avatarUrl: args.avatarUrl || "",
      dob: args.dob || "",
      gender: args.gender || "",
      travelStyles: args.travelStyles || [],
      dietaryRestrictions: args.dietaryRestrictions || [],
      languages: args.languages || [],
      interestTags: args.interests || [],
      financialNature: args.financialNature || "normal",
    };

    if (existingUser) {
      await ctx.db.patch(existingUser._id, userData);
      return existingUser._id;
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      ...userData,
      travelerType: "",
      isVerified: false,
      createdAt: Date.now(),
    });
  },
});

// Get current user
export const getCurrentUser = query({
  args: {
    clerkId: v.string(),
  },
  async handler(ctx, args) {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Get user by username
export const getUserByUsername = query({
  args: {
    username: v.string(),
  },
  async handler(ctx, args) {
    return await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    firstName: v.string(),
    lastName: v.string(),
    bio: v.string(),
    dob: v.string(),
    gender: v.string(),
    financialNature: v.string(),
    dietaryRestrictions: v.array(v.string()),
    languages: v.array(v.string()),
    travelStyles: v.array(v.string()),
    interestTags: v.array(v.string()),
    travelerType: v.string(),
  },
  async handler(ctx, args) {
    const authUser = await getAuthenticatedUser(ctx);
    if (authUser._id !== args.userId) {
      throw new Error("Not authorized to update this profile");
    }

    const { userId, ...updates } = args;
    await ctx.db.patch(userId, updates);
    return await ctx.db.get(userId);
  },
});

// Get user stats (trip count, match count, countries visited)
export const getUserStats = query({
  args: {
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const trips = await ctx.db
      .query("trips")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const matchesA = await ctx.db
      .query("matches")
      .withIndex("by_userA", (q) => q.eq("userAId", args.userId))
      .collect();
    const matchesB = await ctx.db
      .query("matches")
      .withIndex("by_userB", (q) => q.eq("userBId", args.userId))
      .collect();

    const countries = new Set(trips.map((t) => t.country));

    return {
      tripCount: trips.length,
      matchCount: matchesA.length + matchesB.length,
      countryCount: countries.size,
      trips,
    };
  },
});
