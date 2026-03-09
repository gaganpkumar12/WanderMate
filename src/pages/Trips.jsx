import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "../components/ui";
import {
  PlusCircle,
  MapPin,
  Calendar,
  Users,
  Edit2,
  Trash2,
} from "lucide-react";
import { useAuth } from "../hooks/index.js";
import "../styles/pages/trips.css";

export default function Trips() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get current user from Convex
  const convexUser = useQuery(
    api.users.getCurrentUser,
    user?.id ? { clerkId: user.id } : "skip",
  );

  // Fetch user's trips
  const trips =
    useQuery(
      api.trips.getUserTrips,
      convexUser?._id ? { userId: convexUser._id } : "skip",
    ) || [];

  // Delete trip mutation
  const deleteTrip = useMutation(api.trips.deleteTrip);

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await deleteTrip({ tripId });
      } catch (error) {
        console.error("Error deleting trip:", error);
        alert("Failed to delete trip");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getDaysDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="page-trips">
      {/* Header */}
      <div className="trips-header">
        <div className="header-content">
          <h1>My Trips</h1>
          <p>Manage your upcoming adventures</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate("/app/trips/new")}
          className="btn-new-trip"
        >
          <PlusCircle size={20} />
          Plan New Trip
        </Button>
      </div>

      {/* Trips Grid */}
      {trips.length > 0 ? (
        <div className="trips-grid">
          {trips.map((trip) => (
            <div key={trip._id} className="trip-card">
              {/* Cover Image */}
              <div className="trip-cover">
                {trip.coverImageUrl ? (
                  <img src={trip.coverImageUrl} alt={trip.destination} />
                ) : (
                  <div className="trip-cover-placeholder">
                    <MapPin size={48} />
                  </div>
                )}

                {/* Status Badge */}
                <div className="trip-status">
                  {trip.status === "planning" && (
                    <span className="badge-upcoming">Planning</span>
                  )}
                  {trip.status === "active" && (
                    <span className="badge-active">In Progress</span>
                  )}
                  {trip.status === "completed" && (
                    <span className="badge-completed">Completed</span>
                  )}
                </div>

                {/* Budget Badge */}
                <div className="trip-budget">
                  {trip.budget === "budget" && <span>$ Budget</span>}
                  {trip.budget === "mid-range" && <span>$$ Mid-range</span>}
                  {trip.budget === "luxury" && <span>$$$ Luxury</span>}
                </div>
              </div>

              {/* Trip Info */}
              <div className="trip-info">
                <div className="trip-destination">
                  <h3>{trip.destination}</h3>
                  <p className="country">{trip.country}</p>
                </div>

                <div className="trip-details">
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>
                      {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="duration">
                      {getDaysDuration(trip.startDate, trip.endDate)} days
                    </span>
                  </div>
                  <div className="detail-item">
                    <Users size={16} />
                    <span>
                      Looking for {trip.groupSize - 1} mate
                      {trip.groupSize - 1 !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {trip.tripVibe && (
                  <div className="trip-tags">
                    {Array.isArray(trip.tripVibe) ? (
                      trip.tripVibe.slice(0, 3).map((vibe, idx) => (
                        <span key={idx} className="tag">
                          {vibe}
                        </span>
                      ))
                    ) : (
                      <span className="tag">{trip.tripVibe}</span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="trip-actions">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => navigate(`/app/trips/${trip._id}`)}
                  >
                    <MapPin size={16} />
                    Find Mate
                  </Button>
                  <button
                    className="btn-icon-edit"
                    onClick={() => navigate(`/app/trips/${trip._id}/edit`)}
                    title="Edit trip"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-icon-delete"
                    onClick={() => handleDeleteTrip(trip._id)}
                    title="Delete trip"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="trips-empty">
          <div className="empty-icon">
            <MapPin size={48} />
          </div>
          <h2>No trips yet</h2>
          <p>Start your WanderMate journey by planning your first adventure</p>
          <Button
            variant="primary"
            onClick={() => navigate("/app/trips/new")}
            className="btn-cta"
          >
            <PlusCircle size={20} />
            Create Your First Trip
          </Button>
        </div>
      )}
    </div>
  );
}
