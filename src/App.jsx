import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ConvexReactClient, useQuery } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { api } from "../convex/_generated/api";
import { Shell } from "./components/layout/Shell";
import { useAuth } from "./hooks/index.js";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Lazy-loaded pages
const Landing = lazy(() => import("./pages/Landing"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Home = lazy(() => import("./pages/Home"));
const Trips = lazy(() => import("./pages/Trips"));
const NewTrip = lazy(() => import("./pages/NewTrip"));
const TripDetail = lazy(() => import("./pages/TripDetail"));
const Discover = lazy(() => import("./pages/Discover"));
const Matches = lazy(() => import("./pages/Matches"));
const Chat = lazy(() => import("./pages/Chat"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const EditTrip = lazy(() => import("./pages/EditTrip"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: "3px solid rgba(255,255,255,0.08)",
          borderTopColor: "#00d4aa",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
    </div>
  );
}

// Initialize Convex client
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Redirect authenticated users away from public pages
function PublicOnly({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;
  if (isSignedIn) return <Navigate to="/app/home" replace />;

  return children;
}

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn, user } = useAuth();

  const convexUser = useQuery(
    api.users.getCurrentUser,
    isLoaded && isSignedIn && user?.id ? { clerkId: user.id } : "skip",
  );

  if (!isLoaded) {
    return <div style={{ padding: "20px", color: "#666" }}>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Still loading Convex user
  if (convexUser === undefined) {
    return <PageLoader />;
  }

  // No Convex user record — needs onboarding
  if (convexUser === null) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

function ClerkConvexApp() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useClerkAuth}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicOnly>
                <Suspense fallback={<PageLoader />}>
                  <Landing />
                </Suspense>
              </PublicOnly>
            }
          />
          <Route
            path="/sign-in/*"
            element={<Navigate to="/app/home" replace />}
          />
          <Route
            path="/sign-up/*"
            element={<Navigate to="/app/home" replace />}
          />
          <Route
            path="/onboarding"
            element={
              <Suspense fallback={<PageLoader />}>
                <Onboarding />
              </Suspense>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <Shell>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="home" element={<Home />} />
                      <Route path="trips" element={<Trips />} />
                      <Route path="trips/new" element={<NewTrip />} />
                      <Route path="trips/:id" element={<TripDetail />} />
                      <Route path="trips/:id/edit" element={<EditTrip />} />
                      <Route path="discover" element={<Discover />} />
                      <Route path="matches" element={<Matches />} />
                      <Route path="chat/:matchId" element={<Chat />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="profile/edit" element={<EditProfile />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </Shell>
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route
            path="*"
            element={
              <Suspense fallback={<PageLoader />}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ClerkConvexApp />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
