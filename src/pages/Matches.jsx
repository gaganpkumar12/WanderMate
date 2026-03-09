import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../hooks/index.js";
import { Button } from "../components/ui";
import {
  Heart,
  MessageCircle,
  MapPin,
  Calendar,
  Sparkles,
  Compass,
  ThumbsUp,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/pages/matches.css";

export default function Matches() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [activeTab, setActiveTab] = useState("matches"); // "matches" | "likes"

  // Get convex user
  const convexUser = useQuery(
    api.users.getCurrentUser,
    user?.id ? { clerkId: user.id } : "skip",
  );

  // Get matches (now enriched with lastMessage + unreadCount)
  const matches = useQuery(
    api.matches.getMyMatches,
    convexUser?._id ? { userId: convexUser._id } : "skip",
  );

  // Get likes received
  const likesReceived = useQuery(
    api.likes.getLikesReceivedWithDetails,
    convexUser?._id ? { userId: convexUser._id } : "skip",
  );

  const likeUserMutation = useMutation(api.likes.likeUser);

  const handleLikeBack = async (like) => {
    if (!convexUser) return;
    try {
      const result = await likeUserMutation({
        fromUserId: convexUser._id,
        toUserId: like.fromUserId,
        tripId: like.tripId,
      });
      if (result.isMatch) {
        setActiveTab("matches");
      }
    } catch (err) {
      console.error("Like back failed:", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getRelativeTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(new Date(timestamp).toISOString());
  };

  // Loading
  if (!convexUser) {
    return (
      <div className="page-matches">
        <div className="matches-loading">
          <div className="loading-spinner" />
          <p>Loading matches...</p>
        </div>
      </div>
    );
  }

  const matchList = matches || [];

  return (
    <div className="page-matches">
      {/* Header */}
      <div className="matches-header">
        <div className="matches-title">
          <Heart size={24} className="icon-gold" fill="currentColor" />
          <h1>{activeTab === "matches" ? "Your Matches" : "Who Liked You"}</h1>
          {activeTab === "matches" && matchList.length > 0 && (
            <span className="match-count">{matchList.length}</span>
          )}
          {activeTab === "likes" && (likesReceived?.length || 0) > 0 && (
            <span className="match-count">{likesReceived.length}</span>
          )}
        </div>
        <div className="matches-tabs">
          <button
            className={`matches-tab ${activeTab === "matches" ? "active" : ""}`}
            onClick={() => setActiveTab("matches")}
          >
            <MessageCircle size={16} />
            Matches
          </button>
          <button
            className={`matches-tab ${activeTab === "likes" ? "active" : ""}`}
            onClick={() => setActiveTab("likes")}
          >
            <ThumbsUp size={16} />
            Likes
            {(likesReceived?.filter((l) => !l.isMutual)?.length || 0) > 0 && (
              <span className="tab-badge">
                {likesReceived.filter((l) => !l.isMutual).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === "likes" ? (
        /* Likes Tab */
        <div className="likes-tab-content">
          {!likesReceived || likesReceived.length === 0 ? (
            <div className="matches-empty">
              <motion.div
                className="empty-illustration"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Eye size={48} style={{ color: "var(--color-text-muted)" }} />
              </motion.div>
              <h2>No Likes Yet</h2>
              <p>
                When someone likes your trip, they'll appear here. Make sure
                your trips are public so others can discover you!
              </p>
              <Button variant="primary" onClick={() => navigate("/app/trips")}>
                <MapPin size={18} />
                Manage Trips
              </Button>
            </div>
          ) : (
            <div className="likes-list">
              <AnimatePresence>
                {likesReceived.map((like, idx) => (
                  <motion.div
                    key={like._id}
                    className={`like-card ${like.isMutual ? "mutual" : ""}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="like-card-avatar">
                      {like.fromUser?.avatarUrl ? (
                        <img
                          src={like.fromUser.avatarUrl}
                          alt={like.fromUser.firstName}
                        />
                      ) : (
                        <div className="like-avatar-placeholder">
                          {like.fromUser?.firstName?.[0] || "?"}
                        </div>
                      )}
                    </div>
                    <div className="like-card-info">
                      <h4>
                        {like.fromUser?.firstName} {like.fromUser?.lastName}
                        {like.isMutual && (
                          <span className="mutual-badge">Matched</span>
                        )}
                      </h4>
                      <div className="like-trip-meta">
                        <MapPin size={14} />
                        <span>{like.trip?.destination || "Unknown trip"}</span>
                        {like.trip?.startDate && (
                          <>
                            <Calendar size={14} />
                            <span>
                              {new Date(like.trip.startDate).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="like-card-actions">
                      {like.isMutual ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setActiveTab("matches");
                          }}
                        >
                          <MessageCircle size={16} />
                          Chat
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleLikeBack(like)}
                        >
                          <Heart size={16} />
                          Like Back
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      ) : matchList.length === 0 ? (
        /* Empty State */
        <div className="matches-empty">
          <motion.div
            className="empty-illustration"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="empty-hearts">
              <Heart size={28} className="floating-heart h1" />
              <Heart size={24} className="floating-heart h2" />
              <Heart size={20} className="floating-heart h3" />
            </div>
          </motion.div>
          <h2>No Matches Yet</h2>
          <p>
            Start discovering travelers and like the ones you'd love to travel
            with. When someone likes you back — it's a match!
          </p>
          <Button variant="primary" onClick={() => navigate("/app/discover")}>
            <Compass size={18} />
            Discover Travelers
          </Button>
        </div>
      ) : (
        /* Match List + Detail */
        <div className="matches-layout">
          {/* Match Sidebar */}
          <div className="matches-sidebar">
            <AnimatePresence>
              {matchList.map((match, idx) => (
                <motion.div
                  key={match._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div
                    className={`shared-match-card ${selectedMatch?._id === match._id ? "active" : ""}`}
                    onClick={() => setSelectedMatch(match)}
                  >
                    <div className="smc-avatars">
                      <div className="smc-avatar">
                        {match.otherUser?.avatarUrl ? (
                          <img
                            src={match.otherUser.avatarUrl}
                            alt={match.otherUser.firstName}
                          />
                        ) : (
                          <div className="smc-avatar-placeholder">
                            {match.otherUser?.firstName?.[0] || "?"}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="smc-info">
                      <h4>
                        {match.otherUser?.firstName} {match.otherUser?.lastName}
                      </h4>
                      {match.lastMessage ? (
                        <p className="smc-last-message">
                          {match.lastMessage.senderId === convexUser._id
                            ? "You: "
                            : ""}
                          {match.lastMessage.text.length > 40
                            ? match.lastMessage.text.slice(0, 40) + "…"
                            : match.lastMessage.text}
                        </p>
                      ) : (
                        <div className="smc-trip">
                          <MapPin size={12} />
                          <span>{match.trip?.destination || "Trip"}</span>
                        </div>
                      )}
                    </div>
                    <div className="smc-meta">
                      <div className="smc-meta-col">
                        <span className="smc-time">
                          {getRelativeTime(
                            match.lastMessage?.createdAt || match.createdAt,
                          )}
                        </span>
                        {match.unreadCount > 0 && (
                          <span className="smc-unread">
                            {match.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Detail Panel */}
          <div className="matches-detail">
            {selectedMatch ? (
              <motion.div
                key={selectedMatch._id}
                className="match-detail-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* User Info */}
                <div className="detail-user">
                  <div className="detail-avatar">
                    {selectedMatch.otherUser?.avatarUrl ? (
                      <img
                        src={selectedMatch.otherUser.avatarUrl}
                        alt={selectedMatch.otherUser.firstName}
                      />
                    ) : (
                      <div className="detail-avatar-placeholder">
                        {selectedMatch.otherUser?.firstName?.[0] || "?"}
                      </div>
                    )}
                  </div>
                  <div className="detail-info">
                    <h2>
                      {selectedMatch.otherUser?.firstName}{" "}
                      {selectedMatch.otherUser?.lastName}
                    </h2>
                    {selectedMatch.otherUser?.bio && (
                      <p className="detail-bio">
                        {selectedMatch.otherUser.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Trip Info */}
                {selectedMatch.trip && (
                  <div className="detail-trip">
                    <h3>Shared Trip</h3>
                    <div className="detail-trip-card">
                      <div className="dtc-row">
                        <MapPin size={16} />
                        <span>
                          {selectedMatch.trip.destination},{" "}
                          {selectedMatch.trip.country}
                        </span>
                      </div>
                      <div className="dtc-row">
                        <Calendar size={16} />
                        <span>
                          {formatDate(selectedMatch.trip.startDate)} →{" "}
                          {formatDate(selectedMatch.trip.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Compatibility */}
                {selectedMatch.compatibilityScore > 0 && (
                  <div className="detail-compat">
                    <Sparkles size={16} />
                    <span>{selectedMatch.compatibilityScore}% compatible</span>
                  </div>
                )}

                {/* Matched Time */}
                <div className="detail-time">
                  Matched {getRelativeTime(selectedMatch.createdAt)}
                </div>

                {/* Interests */}
                {selectedMatch.otherUser?.interestTags?.length > 0 && (
                  <div className="detail-interests">
                    <h3>Interests</h3>
                    <div className="detail-tags">
                      {selectedMatch.otherUser.interestTags.map((tag) => (
                        <span key={tag} className="detail-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat CTA */}
                <div className="detail-actions">
                  <Button
                    variant="primary"
                    className="chat-cta"
                    onClick={() => navigate(`/app/chat/${selectedMatch._id}`)}
                  >
                    <MessageCircle size={18} />
                    Start Chatting
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="detail-placeholder">
                <MessageCircle size={48} className="icon-muted" />
                <h3>Select a Match</h3>
                <p>Choose a match from the list to see their details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
