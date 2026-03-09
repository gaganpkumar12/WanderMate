import { useQuery } from "convex/react";
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";

export function useAuth() {
  const { isLoaded, isSignedIn, userId } = useClerkAuth();
  const { user } = useUser();

  return {
    isLoaded,
    isSignedIn: isSignedIn ?? false,
    user: user ?? null,
    userId: userId ?? null,
    email: user?.emailAddresses?.[0]?.emailAddress ?? null,
    firstName: user?.firstName ?? null,
    lastName: user?.lastName ?? null,
  };
}

// useCurrentUser - Get current user from Convex with Clerk integration
export function useCurrentUser() {
  const auth = useAuth();

  const convexUser = useQuery(
    api.users.getCurrentUser,
    auth.isLoaded && auth.isSignedIn && auth.user?.id
      ? { clerkId: auth.user.id }
      : "skip",
  );

  const isLoading = !auth.isLoaded || convexUser === undefined;

  return {
    auth,
    convexUser: convexUser ?? null,
    isLoading,
    data: convexUser ?? null,
    error: null,
  };
}

// useMatches - Get current user's matches
export function useMatches() {
  const { convexUser } = useCurrentUser();
  const matches = useQuery(
    api.matches.getMyMatches,
    convexUser?._id ? { userId: convexUser._id } : "skip",
  );
  return matches || [];
}

// useTrips - Get current user's trips
export function useTrips() {
  // TODO: Implement with Convex query when trips table is populated
  return [];
}

// useNotifications - Get real-time notifications
export function useNotifications() {
  const { convexUser } = useCurrentUser();
  const notifications = useQuery(
    api.notifications.getMyNotifications,
    convexUser?._id ? { userId: convexUser._id } : "skip",
  );
  const unreadCount = useQuery(
    api.notifications.getUnreadCount,
    convexUser?._id ? { userId: convexUser._id } : "skip",
  );
  return {
    notifications: notifications || [],
    unreadCount: unreadCount || 0,
  };
}
