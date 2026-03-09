import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button, Input } from "../components/ui";
import {
  ChevronLeft,
  MapPin,
  Building2,
  TreePine,
  Umbrella,
  Mountain,
  Landmark,
  Sparkles,
  Save,
} from "lucide-react";
import { useAuth } from "../hooks/index.js";
import "../styles/pages/new-trip.css";

const TRIP_VIBES = [
  { id: "urban", label: "Urban City", value: "Urban City", icon: Building2 },
  {
    id: "wilderness",
    label: "Wilderness",
    value: "Wilderness",
    icon: TreePine,
  },
  { id: "beach", label: "Beach", value: "Beach", icon: Umbrella },
  { id: "mountains", label: "Mountains", value: "Mountains", icon: Mountain },
  { id: "heritage", label: "Heritage", value: "Heritage", icon: Landmark },
  { id: "luxury", label: "Luxury", value: "Luxury", icon: Sparkles },
];

const ACTIVITIES = [
  "Street Food",
  "Clubbing",
  "Museums",
  "Hiking",
  "Photography",
  "Water Sports",
  "Shopping",
  "Wildlife",
];

const BUDGET_OPTIONS = [
  { label: "$ Budget", value: "budget" },
  { label: "$$ Mid-range", value: "mid-range" },
  { label: "$$$ Luxury", value: "luxury" },
];

const STATUS_OPTIONS = [
  { label: "Planning", value: "planning" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export default function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const convexUser = useQuery(
    api.users.getCurrentUser,
    user?.id ? { clerkId: user.id } : "skip",
  );

  const trip = useQuery(api.trips.getTripById, id ? { tripId: id } : "skip");
  const updateTrip = useMutation(api.trips.updateTrip);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(null);

  // Populate form when trip loads
  useEffect(() => {
    if (trip && !formData) {
      setFormData({
        destination: trip.destination || "",
        country: trip.country || "",
        startDate: trip.startDate || "",
        endDate: trip.endDate || "",
        tripVibe: trip.tripVibe || "",
        tripPreferences: trip.tripPreferences || [],
        budget: trip.budget || "mid-range",
        groupSize: trip.groupSize || 2,
        isPublic: trip.isPublic ?? true,
        status: trip.status || "planning",
      });
    }
  }, [trip, formData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting || !formData) return;

    try {
      setIsSubmitting(true);

      await updateTrip({
        tripId: id,
        destination: formData.destination,
        country: formData.country,
        startDate: formData.startDate,
        endDate: formData.endDate,
        tripVibe: formData.tripVibe,
        tripPreferences: formData.tripPreferences,
        budget: formData.budget,
        groupSize: formData.groupSize,
        isPublic: formData.isPublic,
        status: formData.status,
      });

      navigate(`/app/trips/${id}`);
    } catch (error) {
      console.error("Error updating trip:", error);
      alert("Failed to update trip. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading
  if (!trip || !formData) {
    return (
      <div className="page-new-trip">
        <div className="new-trip-container">
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              color: "var(--color-text-secondary)",
            }}
          >
            <div className="loading-spinner" />
            <p>Loading trip...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not the owner
  if (convexUser && trip.userId !== convexUser._id) {
    return (
      <div className="page-new-trip">
        <div className="new-trip-container">
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p>You don't have permission to edit this trip.</p>
            <Button variant="secondary" onClick={() => navigate("/app/trips")}>
              Back to Trips
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-new-trip">
      <div className="new-trip-container">
        {/* Header */}
        <div className="step-content">
          <div
            className="step-header"
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <button
              onClick={() => navigate(`/app/trips/${id}`)}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-text-secondary)",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <h1>Edit Trip</h1>
          </div>

          {/* Destination */}
          <div className="step-form">
            <div className="form-group">
              <label>Destination</label>
              <div className="input-with-icon">
                <MapPin size={20} />
                <Input
                  value={formData.destination}
                  onChange={(e) =>
                    handleInputChange("destination", e.target.value)
                  }
                  placeholder="e.g., Tokyo, Paris, Bali..."
                />
              </div>
            </div>

            <div className="form-group">
              <label>Country</label>
              <Input
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="e.g., Japan, France, Indonesia..."
              />
            </div>
          </div>

          {/* Dates */}
          <div className="step-form">
            <div className="form-group">
              <label>Start Date</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
              />
            </div>

            {formData.startDate && formData.endDate && (
              <div className="duration-info">
                Duration:{" "}
                {Math.ceil(
                  (new Date(formData.endDate) - new Date(formData.startDate)) /
                    (1000 * 60 * 60 * 24),
                )}{" "}
                days
              </div>
            )}
          </div>

          {/* Trip Vibe */}
          <div className="step-form">
            <label>Trip Vibe</label>
            <div className="card-grid">
              {TRIP_VIBES.map((vibe) => (
                <button
                  key={vibe.id}
                  className={`card-option ${formData.tripVibe === vibe.value ? "selected" : ""}`}
                  onClick={() => handleInputChange("tripVibe", vibe.value)}
                >
                  <span className="emoji">
                    <vibe.icon size={28} />
                  </span>
                  <span>{vibe.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div className="step-form">
            <label>Activities & Interests</label>
            <div className="chip-grid">
              {ACTIVITIES.map((activity) => (
                <button
                  key={activity}
                  className={`chip ${formData.tripPreferences.includes(activity) ? "selected" : ""}`}
                  onClick={() => handleMultiSelect("tripPreferences", activity)}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="step-form">
            <label>Budget Level</label>
            <div className="budget-options">
              {BUDGET_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={`budget-option ${formData.budget === option.value ? "selected" : ""}`}
                  onClick={() => handleInputChange("budget", option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Group Size */}
          <div className="step-form">
            <label>Group Size</label>
            <div className="group-size-stepper">
              <button
                onClick={() =>
                  handleInputChange(
                    "groupSize",
                    Math.max(2, formData.groupSize - 1),
                  )
                }
              >
                −
              </button>
              <span className="size-display">{formData.groupSize}</span>
              <button
                onClick={() =>
                  handleInputChange(
                    "groupSize",
                    Math.min(5, formData.groupSize + 1),
                  )
                }
              >
                +
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="step-form">
            <label>Trip Status</label>
            <div className="budget-options">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={`budget-option ${formData.status === option.value ? "selected" : ""}`}
                  onClick={() => handleInputChange("status", option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div className="step-form">
            <div className="visibility-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    handleInputChange("isPublic", e.target.checked)
                  }
                />
                <span>Make this trip public (visible in discovery)</span>
              </label>
              <p className="helper-text">
                {formData.isPublic
                  ? "This trip will be visible to other travelers"
                  : "Only you can see this trip"}
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="step-navigation">
            <Button
              variant="secondary"
              onClick={() => navigate(`/app/trips/${id}`)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <Save size={18} />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
