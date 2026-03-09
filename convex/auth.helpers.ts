import { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Get the authenticated Convex user from the current request context.
 * Throws if not authenticated or user record not found.
 */
export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (!user) {
    throw new Error("User not found. Please complete onboarding.");
  }

  return user;
}

/**
 * Get the Clerk identity from context. Returns null if not authenticated.
 */
export async function getIdentity(ctx: QueryCtx | MutationCtx) {
  return await ctx.auth.getUserIdentity();
}
