// Shared component library
import { MapPin, Calendar, Users, Heart, MessageCircle } from "lucide-react";
import { Badge } from "../ui";

// TripCard - Display a trip in card format
export function TripCard({ trip, onClick }) {
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
    <div
      className="shared-trip-card"
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <div className="stc-header">
        <MapPin size={16} />
        <span className="stc-dest">{trip?.destination}</span>
        <span className="stc-budget">{getBudgetEmoji(trip?.budget)}</span>
      </div>
      <div className="stc-dates">
        <Calendar size={14} />
        <span>
          {formatDate(trip?.startDate)} → {formatDate(trip?.endDate)}
        </span>
      </div>
      {trip?.tripVibe && <Badge variant="default">{trip.tripVibe}</Badge>}
    </div>
  );
}

// UserCard - Display user profile in card format
export function UserCard({ user, compatibilityScore, onLike }) {
  return (
    <div className="shared-user-card">
      <div className="suc-avatar">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.firstName} />
        ) : (
          <div className="suc-avatar-placeholder">
            {user?.firstName?.[0] || "?"}
          </div>
        )}
      </div>
      <div className="suc-info">
        <h4>
          {user?.firstName} {user?.lastName?.[0]}.
        </h4>
        {user?.bio && <p className="suc-bio">{user.bio}</p>}
      </div>
      {compatibilityScore !== undefined && (
        <CompatibilityMeter score={compatibilityScore} />
      )}
      {onLike && (
        <button className="suc-like-btn" onClick={onLike}>
          <Heart size={18} />
        </button>
      )}
    </div>
  );
}

// MatchCard - Display a match in card format
export function MatchCard({ match, onClick, isActive }) {
  const otherUser = match?.otherUser;
  const trip = match?.trip;

  return (
    <div
      className={`shared-match-card ${isActive ? "active" : ""}`}
      onClick={onClick}
      role="button"
    >
      <div className="smc-avatars">
        <div className="smc-avatar">
          {otherUser?.avatarUrl ? (
            <img src={otherUser.avatarUrl} alt={otherUser.firstName} />
          ) : (
            <div className="smc-avatar-placeholder">
              {otherUser?.firstName?.[0] || "?"}
            </div>
          )}
        </div>
      </div>
      <div className="smc-info">
        <h4>
          {otherUser?.firstName} {otherUser?.lastName?.[0]}.
        </h4>
        {trip && (
          <span className="smc-trip">
            <MapPin size={12} /> {trip.destination}
          </span>
        )}
      </div>
      <div className="smc-meta">
        {match?.compatibilityScore > 0 && (
          <span className="smc-score">{match.compatibilityScore}%</span>
        )}
        <MessageCircle size={16} className="smc-chat-icon" />
      </div>
    </div>
  );
}

// CompatibilityMeter - Show compatibility percentage
export function CompatibilityMeter({ score, size = "sm" }) {
  const radius = size === "sm" ? 20 : 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const viewBox = size === "sm" ? "0 0 50 50" : "0 0 100 100";
  const center = size === "sm" ? 25 : 50;

  const getColor = (s) => {
    if (s >= 75) return "var(--color-teal)";
    if (s >= 50) return "var(--color-accent)";
    if (s >= 25) return "#E5A000";
    return "#8892A4";
  };

  return (
    <div className={`shared-compat-meter compat-${size}`}>
      <svg viewBox={viewBox}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={size === "sm" ? 3 : 6}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={size === "sm" ? 3 : 6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <span className="compat-value">{score}%</span>
    </div>
  );
}
