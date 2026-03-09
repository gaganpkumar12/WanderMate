import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useAuth } from "../hooks/index.js";
import {
  calculateCompatibilityScore,
  TRIP_VIBES,
  BUDGET_LEVELS,
} from "../lib/constants.js";
import { Button, Badge } from "../components/ui";
import {
  Heart,
  X,
  MapPin,
  Calendar,
  DollarSign,
  Globe,
  Users,
  Filter,
  LayoutGrid,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import "../styles/pages/discover.css";

// ─── Match Overlay ────────────────────────────────────────
function MatchOverlay({ otherUser, trip, onChat, onKeepExploring }) {
  return (
    <motion.div
      className="match-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="match-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{
              opacity: 0,
              scale: 0,
              x: 0,
              y: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: (Math.random() - 0.5) * 400,
              y: (Math.random() - 0.5) * 400,
            }}
            transition={{
              duration: 2,
              delay: Math.random() * 0.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="match-content"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
      >
        <div className="match-avatars">
          <motion.div
            className="match-avatar-wrapper"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", delay: 0.4 }}
          >
            <div className="match-avatar">
              {otherUser?.avatarUrl ? (
                <img src={otherUser.avatarUrl} alt={otherUser.firstName} />
              ) : (
                <div className="avatar-placeholder">
                  {otherUser?.firstName?.[0] || "?"}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="match-heart"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Heart
              size={32}
              fill="var(--color-teal)"
              color="var(--color-teal)"
            />
          </motion.div>

          <motion.div
            className="match-avatar-wrapper"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", delay: 0.4 }}
          >
            <div className="match-avatar you">
              <div className="avatar-placeholder">You</div>
            </div>
          </motion.div>
        </div>

        <motion.h1
          className="match-title"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          It&apos;s a Match!
        </motion.h1>

        <motion.p
          className="match-subtitle"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          You and {otherUser?.firstName} both want to explore{" "}
          {trip?.destination}!
        </motion.p>

        <motion.div
          className="match-actions"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Button
            variant="primary"
            className="match-btn chat-btn"
            onClick={onChat}
          >
            <MessageCircle size={20} />
            Start Chatting
          </Button>
          <Button
            variant="ghost"
            className="match-btn"
            onClick={onKeepExploring}
          >
            Keep Exploring
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Compatibility Gauge ──────────────────────────────────
function CompatibilityGauge({ score }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 75) return "var(--color-teal)";
    if (s >= 50) return "var(--color-accent)";
    if (s >= 25) return "#E5A000";
    return "#8892A4";
  };

  return (
    <div className="compat-gauge">
      <svg viewBox="0 0 100 100" className="gauge-svg">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="6"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="gauge-label">
        <span className="gauge-score">{score}</span>
        <span className="gauge-percent">%</span>
      </div>
    </div>
  );
}

// ─── Swipe Card ───────────────────────────────────────────
function SwipeCard({ candidate, onLike, onPass, isTop }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-25, 25]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 120) {
      onLike();
    } else if (info.offset.x < -120) {
      onPass();
    }
  };

  const { user, trip, compatibilityScore } = candidate;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getBudgetEmoji = (b) => {
    switch (b) {
      case "budget":
        return "$";
      case "mid-range":
        return "$$";
      case "luxury":
        return "$$$";
      default:
        return "$";
    }
  };

  return (
    <motion.div
      className={`swipe-card ${isTop ? "top-card" : ""}`}
      style={{ x, rotate, zIndex: isTop ? 10 : 1 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={isTop ? handleDragEnd : undefined}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      exit={{ x: 500, opacity: 0, transition: { duration: 0.3 } }}
    >
      {/* Like / Pass Overlays */}
      {isTop && (
        <>
          <motion.div
            className="card-stamp like-stamp"
            style={{ opacity: likeOpacity }}
          >
            <Heart size={48} />
            <span>LIKE</span>
          </motion.div>
          <motion.div
            className="card-stamp pass-stamp"
            style={{ opacity: passOpacity }}
          >
            <X size={48} />
            <span>PASS</span>
          </motion.div>
        </>
      )}

      {/* Card Content */}
      <div className="swipe-card-inner">
        <div className="card-avatar-section">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.firstName}
              className="card-avatar-img"
            />
          ) : (
            <div className="card-avatar-placeholder">
              <span>
                {user?.firstName?.[0] || "?"}
                {user?.lastName?.[0] || ""}
              </span>
            </div>
          )}
          <div className="card-avatar-overlay">
            <h2 className="card-name">
              {user?.firstName} {user?.lastName?.[0]}.
            </h2>
            {user?.bio && <p className="card-bio">{user.bio}</p>}
          </div>
        </div>

        <div className="card-details">
          <div className="card-compat">
            <CompatibilityGauge score={compatibilityScore} />
            <span className="compat-text">Match</span>
          </div>

          <div className="card-trip-info">
            <div className="card-info-row">
              <MapPin size={16} />
              <span>
                {trip.destination}, {trip.country}
              </span>
            </div>
            <div className="card-info-row">
              <Calendar size={16} />
              <span>
                {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
              </span>
            </div>
            <div className="card-info-row">
              <DollarSign size={16} />
              <span>
                {getBudgetEmoji(trip.budget)} {trip.budget}
              </span>
            </div>
            <div className="card-info-row">
              <Users size={16} />
              <span>
                Looking for {trip.groupSize}{" "}
                {trip.groupSize === 1 ? "companion" : "companions"}
              </span>
            </div>
          </div>

          {/* Trip Vibe */}
          {trip.tripVibe && (
            <div className="card-vibe">
              <Badge variant="default">{trip.tripVibe}</Badge>
            </div>
          )}

          {/* Shared Interests */}
          {user?.interestTags && user.interestTags.length > 0 && (
            <div className="card-interests">
              {user.interestTags.slice(0, 5).map((tag) => (
                <Badge key={tag} variant="lavender">
                  {tag}
                </Badge>
              ))}
              {user.interestTags.length > 5 && (
                <Badge variant="default">+{user.interestTags.length - 5}</Badge>
              )}
            </div>
          )}

          {/* Languages */}
          {user?.languages && user.languages.length > 0 && (
            <div className="card-languages">
              <Globe size={14} />
              <span>{user.languages.join(", ")}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── List Card ────────────────────────────────────────────
function ListCard({ candidate, onLike }) {
  const { user, trip, compatibilityScore } = candidate;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <motion.div
      className="list-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div className="list-card-left">
        <div className="list-avatar">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.firstName} />
          ) : (
            <div className="list-avatar-placeholder">
              {user?.firstName?.[0] || "?"}
            </div>
          )}
        </div>
        <div className="list-info">
          <h3>
            {user?.firstName} {user?.lastName?.[0]}.
          </h3>
          <div className="list-trip-meta">
            <span>
              <MapPin size={14} /> {trip.destination}
            </span>
            <span>
              <Calendar size={14} /> {formatDate(trip.startDate)} →{" "}
              {formatDate(trip.endDate)}
            </span>
          </div>
          {user?.interestTags && user.interestTags.length > 0 && (
            <div className="list-tags">
              {user.interestTags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="lavender" className="list-tag">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="list-card-right">
        <CompatibilityGauge score={compatibilityScore} />
        <Button variant="primary" size="sm" onClick={() => onLike(candidate)}>
          <Heart size={16} />
          Like
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Filter Sidebar ───────────────────────────────────────
function FilterSidebar({ filters, setFilters, isOpen, onToggle }) {
  return (
    <div className={`filter-sidebar ${isOpen ? "open" : ""}`}>
      <div className="filter-header" onClick={onToggle}>
        <Filter size={18} />
        <span>Filters</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {isOpen && (
        <motion.div
          className="filter-body"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
        >
          {/* Destination Search */}
          <div className="filter-group">
            <label>Destination</label>
            <input
              type="text"
              className="input filter-input"
              placeholder="Search destination..."
              value={filters.destination}
              onChange={(e) =>
                setFilters((f) => ({ ...f, destination: e.target.value }))
              }
            />
          </div>

          {/* Budget */}
          <div className="filter-group">
            <label>Budget</label>
            <div className="filter-checks">
              {BUDGET_LEVELS.map((b) => (
                <label key={b.id} className="filter-check">
                  <input
                    type="checkbox"
                    checked={filters.budgets.includes(b.id)}
                    onChange={(e) => {
                      setFilters((f) => ({
                        ...f,
                        budgets: e.target.checked
                          ? [...f.budgets, b.id]
                          : f.budgets.filter((x) => x !== b.id),
                      }));
                    }}
                  />
                  <span>{b.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Trip Vibe */}
          <div className="filter-group">
            <label>Trip Vibe</label>
            <div className="filter-checks">
              {TRIP_VIBES.map((v) => (
                <label key={v.id} className="filter-check">
                  <input
                    type="checkbox"
                    checked={filters.vibes.includes(v.id)}
                    onChange={(e) => {
                      setFilters((f) => ({
                        ...f,
                        vibes: e.target.checked
                          ? [...f.vibes, v.id]
                          : f.vibes.filter((x) => x !== v.id),
                      }));
                    }}
                  />
                  <span>{v.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="filter-group">
            <label>Sort By</label>
            <select
              className="input filter-select"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((f) => ({ ...f, sortBy: e.target.value }))
              }
            >
              <option value="best-match">Best Match</option>
              <option value="newest">Newest</option>
              <option value="soonest">Soonest Trip</option>
            </select>
          </div>

          {/* Reset */}
          <Button
            variant="ghost"
            size="sm"
            className="filter-reset"
            onClick={() =>
              setFilters({
                destination: "",
                budgets: [],
                vibes: [],
                sortBy: "best-match",
              })
            }
          >
            Reset Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// ─── Main Discover Page ───────────────────────────────────
export default function Discover() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const tripIdParam = searchParams.get("tripId");

  // State
  const [viewMode, setViewMode] = useState("swipe"); // "swipe" | "list"
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchData, setMatchData] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    destination: "",
    budgets: [],
    vibes: [],
    sortBy: "best-match",
  });

  // Convex queries
  const convexUser = useQuery(
    api.users.getCurrentUser,
    user?.id ? { clerkId: user.id } : "skip",
  );

  const myTrips = useQuery(
    api.trips.getUserTrips,
    convexUser?._id ? { userId: convexUser._id } : "skip",
  );

  const publicTrips = useQuery(
    api.trips.getPublicTrips,
    convexUser?._id ? { userId: convexUser._id } : "skip",
  );

  // Mutations
  const likeUserMutation = useMutation(api.likes.likeUser);
  const passUserMutation = useMutation(api.likes.passUser);

  // Find the selected trip (from query param or user's first public trip)
  const selectedTrip = tripIdParam
    ? myTrips?.find((t) => t._id === tripIdParam)
    : myTrips?.find((t) => t.isPublic && t.status !== "completed");

  // Build candidates with compatibility scoring
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    if (!publicTrips || !convexUser || !selectedTrip) return;

    // We need user data for each trip owner - for now use trip data only
    // In production, this would be a joined query
    const scored = publicTrips.map((trip) => {
      // Calculate partial score with what we have
      const score = calculateCompatibilityScore(
        convexUser,
        { travelStyles: [], languages: [], interestTags: [] }, // placeholder for other user
        selectedTrip,
        trip,
      );

      return {
        trip,
        user: null, // Will be fetched separately
        compatibilityScore: score,
      };
    });

    setCandidates(scored);
  }, [publicTrips, convexUser, selectedTrip]);

  // Fetch user data for each candidate trip
  const candidateUserIds = publicTrips?.map((t) => t.userId) || [];
  // We'll use individual queries for each user via a lookup approach

  // Apply filters
  const filteredCandidates = candidates.filter((c) => {
    if (filters.destination) {
      const dest = c.trip.destination.toLowerCase();
      const country = c.trip.country.toLowerCase();
      const search = filters.destination.toLowerCase();
      if (!dest.includes(search) && !country.includes(search)) return false;
    }
    if (
      filters.budgets.length > 0 &&
      !filters.budgets.includes(c.trip.budget)
    ) {
      return false;
    }
    if (filters.vibes.length > 0 && !filters.vibes.includes(c.trip.tripVibe)) {
      return false;
    }
    return true;
  });

  // Sort
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    switch (filters.sortBy) {
      case "newest":
        return b.trip.createdAt - a.trip.createdAt;
      case "soonest":
        return (
          new Date(a.trip.startDate).getTime() -
          new Date(b.trip.startDate).getTime()
        );
      case "best-match":
      default:
        return b.compatibilityScore - a.compatibilityScore;
    }
  });

  // Swipe handlers
  const handleLike = useCallback(
    async (candidate) => {
      const c = candidate || sortedCandidates[currentIndex];
      if (!c || !convexUser) return;

      try {
        const result = await likeUserMutation({
          fromUserId: convexUser._id,
          toUserId: c.trip.userId,
          tripId: c.trip._id,
        });

        if (result.isMatch) {
          setMatchData({
            otherUser: c.user,
            trip: c.trip,
            matchId: result.matchId,
          });
        }

        if (!candidate) {
          // swipe mode - advance
          setCurrentIndex((i) => i + 1);
        } else {
          // list mode - remove from list
          setCandidates((prev) =>
            prev.filter((cc) => cc.trip._id !== c.trip._id),
          );
        }
      } catch (err) {
        console.error("Like failed:", err);
      }
    },
    [sortedCandidates, currentIndex, convexUser, likeUserMutation],
  );

  const handlePass = useCallback(async () => {
    const c = sortedCandidates[currentIndex];
    if (!c || !convexUser) return;

    try {
      await passUserMutation({
        fromUserId: convexUser._id,
        toUserId: c.trip.userId,
        tripId: c.trip._id,
      });
      setCurrentIndex((i) => i + 1);
    } catch (err) {
      console.error("Pass failed:", err);
    }
  }, [sortedCandidates, currentIndex, convexUser, passUserMutation]);

  // Keyboard controls for swipe mode
  useEffect(() => {
    if (viewMode !== "swipe") return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleLike();
      if (e.key === "ArrowLeft") handlePass();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, handleLike, handlePass]);

  // Loading state
  if (!convexUser) {
    return (
      <div className="page-discover">
        <div className="discover-loading">
          <div className="loading-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const remainingCards = sortedCandidates.slice(currentIndex);
  const hasCards = remainingCards.length > 0;

  return (
    <div className="page-discover">
      {/* Header */}
      <div className="discover-header">
        <div className="discover-title">
          <Sparkles size={24} className="icon-teal" />
          <h1>Discover Mates</h1>
        </div>

        {selectedTrip && (
          <div className="current-trip-badge">
            <MapPin size={14} />
            <span>
              Matching for: <strong>{selectedTrip.destination}</strong>
            </span>
          </div>
        )}

        <div className="discover-controls">
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === "swipe" ? "active" : ""}`}
              onClick={() => setViewMode("swipe")}
              title="Card Swipe Mode"
            >
              <Layers size={18} />
            </button>
            <button
              className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="List Browse Mode"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {!selectedTrip && myTrips && (
        <div className="no-trip-warning">
          <p>
            Select one of your public trips to start matching, or create a new
            one.
          </p>
          <div className="trip-select-grid">
            {myTrips
              .filter((t) => t.isPublic && t.status !== "completed")
              .map((trip) => (
                <button
                  key={trip._id}
                  className="trip-select-card"
                  onClick={() => navigate(`/app/discover?tripId=${trip._id}`)}
                >
                  <MapPin size={16} />
                  <span>{trip.destination}</span>
                </button>
              ))}
            <button
              className="trip-select-card new-trip"
              onClick={() => navigate("/app/trips/new")}
            >
              + Create Trip
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="discover-body">
        {/* Swipe Mode */}
        {viewMode === "swipe" && selectedTrip && (
          <div className="swipe-container">
            {hasCards ? (
              <>
                <div className="card-stack">
                  <AnimatePresence mode="popLayout">
                    {remainingCards.slice(0, 3).map((candidate, idx) => (
                      <SwipeCard
                        key={candidate.trip._id}
                        candidate={candidate}
                        isTop={idx === 0}
                        onLike={() => handleLike()}
                        onPass={handlePass}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="swipe-actions">
                  <button className="action-btn pass-btn" onClick={handlePass}>
                    <X size={28} />
                  </button>
                  <button
                    className="action-btn like-btn"
                    onClick={() => handleLike()}
                  >
                    <Heart size={28} />
                  </button>
                </div>

                <p className="swipe-hint">Drag card or use ← → arrow keys</p>
              </>
            ) : (
              <div className="empty-discover">
                <div className="empty-icon">
                  <Globe size={48} />
                </div>
                <h2>No More Travelers</h2>
                <p>
                  You&apos;ve seen everyone available right now. Check back
                  later or expand your trip dates!
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate("/app/trips")}
                >
                  <ArrowLeft size={18} />
                  Back to Trips
                </Button>
              </div>
            )}
          </div>
        )}

        {/* List Mode */}
        {viewMode === "list" && selectedTrip && (
          <div className="list-container">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              isOpen={filtersOpen}
              onToggle={() => setFiltersOpen((o) => !o)}
            />

            <div className="list-results">
              <p className="results-count">
                {sortedCandidates.length} traveler
                {sortedCandidates.length !== 1 ? "s" : ""} found
              </p>

              {sortedCandidates.length > 0 ? (
                <div className="list-grid">
                  {sortedCandidates.map((candidate) => (
                    <ListCard
                      key={candidate.trip._id}
                      candidate={candidate}
                      onLike={handleLike}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-discover">
                  <div className="empty-icon">
                    <Filter size={48} />
                  </div>
                  <h2>No Results</h2>
                  <p>Try adjusting your filters or check back later.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Match Overlay */}
      <AnimatePresence>
        {matchData && (
          <MatchOverlay
            otherUser={matchData.otherUser}
            trip={matchData.trip}
            onChat={() => {
              setMatchData(null);
              navigate(`/app/matches`);
            }}
            onKeepExploring={() => setMatchData(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
