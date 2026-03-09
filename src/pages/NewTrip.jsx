import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button, Input } from "../components/ui";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building2,
  TreePine,
  Umbrella,
  Mountain,
  Landmark,
  Sparkles,
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

const STEPS = [
  { id: 1, title: "Destination" },
  { id: 2, title: "Dates" },
  { id: 3, title: "Trip Vibe" },
  { id: 4, title: "Activities" },
  { id: 5, title: "Budget" },
  { id: 6, title: "Group Size" },
  { id: 7, title: "Details" },
];

export default function NewTrip() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const convexUser = useQuery(
    api.users.getCurrentUser,
    user?.id ? { clerkId: user.id } : "skip",
  );
  const createTrip = useMutation(api.trips.createTrip);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    country: "",
    startDate: "",
    endDate: "",
    tripVibe: "",
    tripPreferences: [],
    budget: "mid-range",
    groupSize: 2,
    coverImageUrl: "",
    isPublic: true,
    description: "",
  });

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

  const handleNext = () => {
    // Validate current step before moving to next
    if (currentStep === 1 && !formData.destination) {
      alert("Please enter a destination");
      return;
    }
    if (currentStep === 2 && (!formData.startDate || !formData.endDate)) {
      alert("Please select start and end dates");
      return;
    }
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      if (!user) {
        alert("You must be logged in to create a trip");
        return;
      }

      if (!convexUser) {
        alert("Please complete your profile first");
        navigate("/onboarding");
        return;
      }

      setIsSubmitting(true);

      await createTrip({
        userId: convexUser._id,
        destination: formData.destination,
        country: formData.country,
        startDate: formData.startDate,
        endDate: formData.endDate,
        tripVibe: formData.tripVibe,
        tripPreferences: formData.tripPreferences,
        budget: formData.budget,
        groupSize: formData.groupSize,
        coverImageUrl: formData.coverImageUrl,
        isPublic: formData.isPublic,
      });

      navigate("/app/trips");
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Failed to create trip. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-new-trip">
      <div className="new-trip-container">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          ></div>
        </div>

        {/* Step Indicators */}
        <div className="steps-indicator">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`step-indicator ${
                step.id === currentStep ? "active" : ""
              } ${step.id < currentStep ? "completed" : ""}`}
              title={step.title}
            >
              {step.id < currentStep ? "✓" : step.id}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="step-content">
          <div className="step-header">
            <h1>{STEPS[currentStep - 1].title}</h1>
          </div>

          {/* Step 1: Destination */}
          {currentStep === 1 && (
            <div className="step-form">
              <div className="form-group">
                <label>Where are you going?</label>
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
          )}

          {/* Step 2: Dates */}
          {currentStep === 2 && (
            <div className="step-form">
              <div className="form-group">
                <label>Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
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
                    (new Date(formData.endDate) -
                      new Date(formData.startDate)) /
                      (1000 * 60 * 60 * 24),
                  )}{" "}
                  days
                </div>
              )}
            </div>
          )}

          {/* Step 3: Trip Vibe */}
          {currentStep === 3 && (
            <div className="step-form">
              <label>What's your trip vibe?</label>
              <div className="card-grid">
                {TRIP_VIBES.map((vibe) => (
                  <button
                    key={vibe.id}
                    className={`card-option ${
                      formData.tripVibe === vibe.value ? "selected" : ""
                    }`}
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
          )}

          {/* Step 4: Activities */}
          {currentStep === 4 && (
            <div className="step-form">
              <label>What activities interest you?</label>
              <div className="chip-grid">
                {ACTIVITIES.map((activity) => (
                  <button
                    key={activity}
                    className={`chip ${
                      formData.tripPreferences.includes(activity)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleMultiSelect("tripPreferences", activity)
                    }
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Budget */}
          {currentStep === 5 && (
            <div className="step-form">
              <label>What's your budget level?</label>
              <div className="budget-options">
                {BUDGET_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={`budget-option ${
                      formData.budget === option.value ? "selected" : ""
                    }`}
                    onClick={() => handleInputChange("budget", option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Group Size */}
          {currentStep === 6 && (
            <div className="step-form">
              <label>How many travel companions are you looking for?</label>
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
              <p className="helper-text">
                You'll match with up to {formData.groupSize - 1} travel mate
                {formData.groupSize - 1 !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* Step 7: Details & Visibility */}
          {currentStep === 7 && (
            <div className="step-form">
              <div className="form-group">
                <label>Tell others about your trip (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Share your trip goals, interests, or anything you'd like potential mates to know..."
                  rows={4}
                  maxLength={500}
                />
                <p className="char-count">{formData.description.length}/500</p>
              </div>

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
          )}

          {/* Navigation Buttons */}
          <div className="step-navigation">
            <Button
              variant="secondary"
              onClick={handlePrev}
              disabled={currentStep === 1}
            >
              <ChevronLeft size={20} />
              Previous
            </Button>

            {currentStep === STEPS.length ? (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Trip"}
              </Button>
            ) : (
              <Button variant="primary" onClick={handleNext}>
                Next
                <ChevronRight size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
