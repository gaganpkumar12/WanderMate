import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { useClerk } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../hooks/index.js";
import { Button, Badge } from "../components/ui";
import {
  Edit3,
  MapPin,
  Calendar,
  Heart,
  Globe,
  Settings,
  LogOut,
  Shield,
  ChevronRight,
  Sparkles,
  Plane,
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { TRAVELER_TYPES, INTEREST_TAGS } from "../lib/constants.js";
import "../styles/pages/profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { signOut } = useClerk();
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("planning");

  // Get convex user
  const convexUser = useQuery(
    api.users.getCurrentUser,
    user?.id ? { clerkId: user.id } : "skip",
  );

  // Get stats
  const stats = useQuery(
    api.users.getUserStats,
    convexUser?._id ? { userId: convexUser._id } : "skip",
  );

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Loading
  if (!convexUser) {
    return (
      <div className="page-profile">
        <div className="profile-loading">
          <div className="loading-spinner" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const travelerLabel =
    TRAVELER_TYPES.find((t) => t.id === convexUser.travelerType)?.label ||
    convexUser.travelerType;

  const joinedDate = convexUser.createdAt
    ? format(new Date(convexUser.createdAt), "MMMM yyyy")
    : "";

  const filteredTrips = (stats?.trips || []).filter((t) => {
    if (activeTab === "planning") return t.status === "planning";
    if (activeTab === "active") return t.status === "active";
    if (activeTab === "completed") return t.status === "completed";
    return true;
  });

  return (
    <div className="page-profile">
      {/* Cover Banner */}
      <div className="profile-cover">
        <div className="cover-gradient" />
      </div>

      {/* Profile Card (floating over cover) */}
      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="profile-card-top">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {convexUser.avatarUrl ? (
                <img src={convexUser.avatarUrl} alt={convexUser.firstName} />
              ) : (
                <div className="profile-avatar-placeholder">
                  {convexUser.firstName?.[0]}
                  {convexUser.lastName?.[0]}
                </div>
              )}
            </div>
            {convexUser.isVerified && (
              <div className="verified-badge" title="Verified">
                <Shield size={14} />
              </div>
            )}
          </div>

          <div className="profile-identity">
            <h1>
              {convexUser.firstName} {convexUser.lastName}
            </h1>
            <p className="profile-username">@{convexUser.username}</p>
            {travelerLabel && (
              <Badge variant="lavender" className="traveler-badge">
                {travelerLabel}
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="edit-profile-btn"
            onClick={() => navigate("/app/profile/edit")}
          >
            <Edit3 size={16} />
            Edit Profile
          </Button>
        </div>

        {convexUser.bio && <p className="profile-bio">{convexUser.bio}</p>}

        <div className="profile-meta-row">
          {convexUser.gender && (
            <span className="meta-item">{convexUser.gender}</span>
          )}
          {joinedDate && (
            <span className="meta-item">
              <Calendar size={14} /> Joined {joinedDate}
            </span>
          )}
        </div>
      </motion.div>

      {/* Travel Stats */}
      <motion.div
        className="stats-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="profile-stats">
          <div className="profile-stat">
            <div className="stat-number">{stats?.tripCount || 0}</div>
            <div className="stat-label">
              <Plane size={14} /> Trips
            </div>
          </div>
          <div className="stat-divider" />
          <div className="profile-stat">
            <div className="stat-number">{stats?.matchCount || 0}</div>
            <div className="stat-label">
              <Heart size={14} /> Matches
            </div>
          </div>
          <div className="stat-divider" />
          <div className="profile-stat">
            <div className="stat-number">{stats?.countryCount || 0}</div>
            <div className="stat-label">
              <Globe size={14} /> Countries
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interests */}
      {convexUser.interestTags?.length > 0 && (
        <motion.div
          className="profile-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="section-title">
            <Sparkles size={16} /> My Interests
          </h3>
          <div className="interest-tags">
            {convexUser.interestTags.map((tagId) => {
              const tag = INTEREST_TAGS.find((t) => t.id === tagId);
              return (
                <span key={tagId} className="interest-pill">
                  {tag?.label || tagId}
                </span>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Travel Styles */}
      {convexUser.travelStyles?.length > 0 && (
        <motion.div
          className="profile-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="section-title">Travel Styles</h3>
          <div className="interest-tags">
            {convexUser.travelStyles.map((style) => (
              <span key={style} className="style-pill">
                {style}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Languages */}
      {convexUser.languages?.length > 0 && (
        <motion.div
          className="profile-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="section-title">
            <Globe size={16} /> Languages
          </h3>
          <div className="interest-tags">
            {convexUser.languages.map((lang) => (
              <span key={lang} className="lang-pill">
                {lang}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* My Trips Timeline */}
      <motion.div
        className="profile-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="section-title">
          <MapPin size={16} /> My Trips
        </h3>
        <div className="trip-tabs">
          {["planning", "active", "completed"].map((tab) => (
            <button
              key={tab}
              className={`trip-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="trip-timeline">
          {filteredTrips.length === 0 ? (
            <div className="timeline-empty">
              <p>No {activeTab} trips yet</p>
            </div>
          ) : (
            <div className="timeline-scroll">
              {filteredTrips.map((trip) => (
                <div
                  key={trip._id}
                  className="timeline-card"
                  onClick={() => navigate(`/app/trips/${trip._id}`)}
                >
                  <div className="timeline-dest">
                    <MapPin size={14} />
                    <span>{trip.destination}</span>
                  </div>
                  <div className="timeline-country">{trip.country}</div>
                  <div className="timeline-dates">
                    {format(new Date(trip.startDate), "MMM d")} →{" "}
                    {format(new Date(trip.endDate), "MMM d")}
                  </div>
                  <Badge variant="default">{trip.tripVibe}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Settings */}
      <motion.div
        className="profile-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <button
          className="settings-toggle"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={16} />
          <span>Settings</span>
          <ChevronRight
            size={16}
            className={`settings-chevron ${showSettings ? "open" : ""}`}
          />
        </button>

        {showSettings && (
          <motion.div
            className="settings-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
          >
            <button className="settings-item danger" onClick={handleSignOut}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
