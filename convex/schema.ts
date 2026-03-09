import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    username: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    dob: v.string(),
    gender: v.string(),
    bio: v.string(),
    avatarUrl: v.optional(v.string()),
    financialNature: v.string(), // "spender" | "normal" | "saver"
    dietaryRestrictions: v.array(v.string()),
    languages: v.array(v.string()),
    travelStyles: v.array(v.string()),
    interestTags: v.array(v.string()),
    travelerType: v.string(),
    isVerified: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_username", ["username"]),

  trips: defineTable({
    userId: v.id("users"),
    destination: v.string(),
    country: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    tripVibe: v.string(),
    tripPreferences: v.array(v.string()),
    budget: v.string(), // "budget" | "mid-range" | "luxury"
    groupSize: v.number(),
    coverImageUrl: v.optional(v.string()),
    status: v.string(), // "planning" | "active" | "completed"
    isPublic: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"]),

  likes: defineTable({
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    tripId: v.id("trips"),
    type: v.optional(v.string()), // "like" | "pass" — optional for backward compat
    createdAt: v.number(),
  })
    .index("by_from", ["fromUserId"])
    .index("by_to", ["toUserId"])
    .index("by_trip", ["tripId"]),

  matches: defineTable({
    userAId: v.id("users"),
    userBId: v.id("users"),
    tripId: v.id("trips"),
    compatibilityScore: v.number(),
    createdAt: v.number(),
  })
    .index("by_userA", ["userAId"])
    .index("by_userB", ["userBId"])
    .index("by_trip", ["tripId"]),

  messages: defineTable({
    matchId: v.id("matches"),
    senderId: v.id("users"),
    text: v.string(),
    imageUrl: v.optional(v.string()),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_match", ["matchId"])
    .index("by_sender", ["senderId"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(), // "new_match" | "new_message" | "trip_like"
    data: v.any(),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_type", ["type"]),
});
