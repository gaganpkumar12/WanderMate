import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "../components/ui";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Globe,
  Edit2,
  Trash2,
  Search,
} from "lucide-react";
import { useAuth } from "../hooks/index.js";
import "../styles/pages/trip-detail.css";

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get convex user
  const convexUser = useQuery(
    api.users.getCurrentUser,
    user?.id ? { clerkId: user.id } : "skip",
  );

  // Fetch trip by ID
  const trip = useQuery(api.trips.getTripById, id ? { tripId: id } : "skip");

  // Delete mutation
  const deleteTrip = useMutation(api.trips.deleteTrip);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await deleteTrip({ tripId: id });
        navigate("/app/trips");
      } catch (error) {
        console.error("Error deleting trip:", error);
        alert("Failed to delete trip");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "planning":
        return { text: "Planning" };
      case "active":
        return { text: "In Progress" };
      case "completed":
        return { text: "Completed" };
      default:
        return { text: status };
    }
  };

  const getBudgetLabel = (budget) => {
    switch (budget) {
      case "budget":
        return { text: "$ Budget-Friendly" };
      case "mid-range":
        return { text: "$$ Mid-Range" };
      case "luxury":
        return { text: "$$$ Luxury" };
      default:
        return { text: budget };
    }
  };

  // Loading state
  if (!trip) {
    return (
      <div className="page-trip-detail">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading trip details...</p>
        </div>
      </div>
    );
  }

  const isOwner = convexUser && trip.userId === convexUser._id;
  const statusInfo = getStatusLabel(trip.status);
  const budgetInfo = getBudgetLabel(trip.budget);
  const duration = getDaysDuration(trip.startDate, trip.endDate);

  return (
    <div className="page-trip-detail">
      {/* Hero Section */}
      <div className="trip-hero">
        {trip.coverImageUrl ? (
          <img
            src={trip.coverImageUrl}
            alt={trip.destination}
            className="hero-image"
          />
        ) : (
          <div className="hero-placeholder">
            <MapPin size={64} />
          </div>
        )}
        <div className="hero-overlay">
          <button
            className="back-button"
            onClick={() => navigate("/app/trips")}
          >
            <ArrowLeft size={20} />
            Back to Trips
          </button>
          <div className="hero-content">
            <span className="status-badge">{statusInfo.text}</span>
            <h1>{trip.destination}</h1>
            <p className="country">
              <Globe size={18} />
              {trip.country}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="trip-content">
        {/* Info Cards */}
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">
              <Calendar size={24} />
            </div>
            <div className="info-details">
              <span className="label">Dates</span>
              <span className="value">
                {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
              </span>
              <span className="sub-value">{duration} days</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <DollarSign size={24} />
            </div>
            <div className="info-details">
              <span className="label">Budget</span>
              <span className="value">{budgetInfo.text}</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <Users size={24} />
            </div>
            <div className="info-details">
              <span className="label">Group Size</span>
              <span className="value">
                Looking for {trip.groupSize}{" "}
                {trip.groupSize === 1 ? "companion" : "companions"}
              </span>
            </div>
          </div>
        </div>

        {/* Trip Vibe */}
        {trip.tripVibe && (
          <div className="section">
            <h2>Trip Vibe</h2>
            <div className="vibe-badge">{trip.tripVibe}</div>
          </div>
        )}

        {/* Activities / Preferences */}
        {trip.tripPreferences && trip.tripPreferences.length > 0 && (
          <div className="section">
            <h2>Activities & Interests</h2>
            <div className="tags-list">
              {trip.tripPreferences.map((activity, index) => (
                <span key={index} className="activity-tag">
                  {activity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Visibility */}
        <div className="section">
          <h2>Visibility</h2>
          <div
            className={`visibility-badge ${trip.isPublic ? "public" : "private"}`}
          >
            {trip.isPublic
              ? "Public - Discoverable by other travelers"
              : "Private - Only visible to you"}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          {trip.isPublic && trip.status !== "completed" && (
            <Button
              variant="primary"
              className="find-mates-btn"
              onClick={() => navigate(`/app/discover?tripId=${trip._id}`)}
            >
              <Search size={20} />
              Find Mates for This Trip
            </Button>
          )}

          {isOwner && (
            <div className="owner-actions">
              <Button
                variant="secondary"
                onClick={() => navigate(`/app/trips/${trip._id}/edit`)}
              >
                <Edit2 size={18} />
                Edit Trip
              </Button>
              <Button
                variant="ghost"
                className="delete-btn"
                onClick={handleDelete}
              >
                <Trash2 size={18} />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
