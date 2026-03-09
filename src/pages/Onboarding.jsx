import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button, Input, Badge } from "../components/ui";
import { ChevronLeft, ChevronRight, Upload, User } from "lucide-react";
import { useAuth } from "../hooks/index.js";
import {
  TRAVELER_TYPES,
  DIETARY_OPTIONS,
  INTEREST_TAGS,
  BUDGET_LEVELS,
} from "../lib/constants";
import "../styles/onboarding.css";

const STEPS = [
  { id: 1, title: "Basic Info", description: "Tell us about yourself" },
  { id: 2, title: "Your Bio", description: "A short intro" },
  { id: 3, title: "Avatar", description: "Upload a photo" },
  { id: 4, title: "Travel Style", description: "Pick your vibe" },
  { id: 5, title: "Preferences", description: "Dietary & languages" },
  { id: 6, title: "Interests", description: "What you love" },
  { id: 7, title: "Preview", description: "How mates see you" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const upsertUser = useMutation(api.users.upsertUser);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    dob: "",
    gender: "",
    bio: "",
    avatarUrl: "",
    travelStyles: [],
    dietaryRestrictions: [],
    languages: [],
    financialNature: "normal",
    interestTags: [],
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
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
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
        console.error("User not authenticated");
        return;
      }

      setIsSubmitting(true);

      // Save user profile to Convex
      await upsertUser({
        clerkId: user.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: user.emailAddresses?.[0]?.emailAddress || "",
        username: formData.username,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl || user.imageUrl || "",
        dob: formData.dob,
        gender: formData.gender,
        travelStyles: formData.travelStyles,
        dietaryRestrictions: formData.dietaryRestrictions,
        languages: formData.languages,
        interests: formData.interestTags,
        financialNature: formData.financialNature,
      });

      navigate("/app/home?welcome=new");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Resize image to avoid exceeding Convex argument size limits
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 256;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height = (height * MAX_SIZE) / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = (width * MAX_SIZE) / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const resized = canvas.toDataURL("image/jpeg", 0.7);
        handleInputChange("avatarUrl", resized);
      };
      img.src = URL.createObjectURL(file);
    }
  };

  return (
    <div className="onboarding">
      <div className="onboarding-container">
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
              className={`step-indicator ${step.id === currentStep ? "active" : ""} ${step.id < currentStep ? "completed" : ""}`}
            >
              {step.id < currentStep ? "✓" : step.id}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="step-content">
          <div className="step-header">
            <h1>{STEPS[currentStep - 1].title}</h1>
            <p>{STEPS[currentStep - 1].description}</p>
          </div>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="step-form">
              <div className="form-group">
                <label>First Name</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="Sarah"
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Smith"
                />
              </div>

              <div className="form-group">
                <label>Username</label>
                <Input
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="sarah_travels"
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="input"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Bio */}
          {currentStep === 2 && (
            <div className="step-form">
              <div className="form-group">
                <label>Your Bio</label>
                <p className="form-hint">
                  Tell other travelers what kind of person you are (max 200
                  chars)
                </p>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    handleInputChange("bio", e.target.value.slice(0, 200))
                  }
                  placeholder="Adventure lover, food enthusiast, always up for new experiences..."
                  maxLength={200}
                  rows={5}
                  className="input"
                ></textarea>
                <div className="char-counter">{formData.bio.length}/200</div>
              </div>
            </div>
          )}

          {/* Step 3: Avatar */}
          {currentStep === 3 && (
            <div className="step-form">
              <div className="form-group">
                <label>Upload Your Photo</label>
                <p className="form-hint">
                  This is how other travelers will recognize you
                </p>

                <div className="avatar-upload">
                  {formData.avatarUrl ? (
                    <div className="avatar-preview">
                      <img src={formData.avatarUrl} alt="Avatar" />
                      <p>Looking good!</p>
                    </div>
                  ) : (
                    <div className="upload-zone">
                      <Upload size={48} />
                      <p>Drag and drop or click to upload</p>
                      <span className="form-hint">JPG, PNG (max 5MB)</span>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="file-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Travel Style */}
          {currentStep === 4 && (
            <div className="step-form">
              <label>
                Which travel styles resonate with you? (select at least 1)
              </label>
              <p className="form-hint">
                These help us match you with compatible travelers
              </p>

              <div className="multi-select-grid">
                {TRAVELER_TYPES.map((style) => (
                  <button
                    key={style.id}
                    className={`select-card ${formData.travelStyles.includes(style.id) ? "selected" : ""}`}
                    onClick={() => handleMultiSelect("travelStyles", style.id)}
                  >
                    <div className="card-content">
                      <span>{style.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Preferences */}
          {currentStep === 5 && (
            <div className="step-form">
              <div className="form-group">
                <label>Dietary Restrictions</label>
                <p className="form-hint">Select all that apply</p>
                <div className="chips-group">
                  {DIETARY_OPTIONS.map((option) => (
                    <button
                      key={option}
                      className={`chip ${formData.dietaryRestrictions.includes(option) ? "active" : ""}`}
                      onClick={() =>
                        handleMultiSelect("dietaryRestrictions", option)
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Languages</label>
                <p className="form-hint">What languages do you speak?</p>
                <Input
                  placeholder="e.g., English, Spanish, Mandarin (comma-separated)"
                  value={formData.languages.join(", ")}
                  onChange={(e) => {
                    const langs = e.target.value
                      .split(",")
                      .map((l) => l.trim());
                    handleInputChange("languages", langs);
                  }}
                />
              </div>

              <div className="form-group">
                <label>Financial Nature</label>
                <p className="form-hint">
                  How do you approach spending on travel?
                </p>
                <div className="slider-group">
                  {BUDGET_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      className={`level-btn ${formData.financialNature === level.id ? "active" : ""}`}
                      onClick={() =>
                        handleInputChange("financialNature", level.id)
                      }
                    >
                      {level.id === "saver" && "$"}
                      {level.id === "normal" && "$$"}
                      {level.id === "spender" && "$$$"}
                      <span>{level.label.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Interests */}
          {currentStep === 6 && (
            <div className="step-form">
              <label>What are your interests? (select 3–10)</label>
              <p className="form-hint">
                This helps us match you with like-minded travelers
              </p>

              <div className="interests-cloud">
                {INTEREST_TAGS.map((tag) => (
                  <button
                    key={tag.id}
                    className={`interest-tag ${formData.interestTags.includes(tag.id) ? "active" : ""}`}
                    onClick={() => {
                      if (
                        formData.interestTags.length === 10 &&
                        !formData.interestTags.includes(tag.id)
                      ) {
                        return;
                      }
                      handleMultiSelect("interestTags", tag.id);
                    }}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>

              {formData.interestTags.length > 0 && (
                <p className="form-hint">
                  Selected: {formData.interestTags.length}/10
                </p>
              )}
            </div>
          )}

          {/* Step 7: Preview */}
          {currentStep === 7 && (
            <div className="step-form">
              <p className="form-hint">
                This is how other travelers will see your profile:
              </p>

              <div className="profile-preview glass-card">
                <div className="preview-header">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt="Avatar"
                      className="preview-avatar"
                    />
                  ) : (
                    <div className="preview-avatar-placeholder">
                      <User size={48} />
                    </div>
                  )}
                </div>

                <div className="preview-content">
                  <h2>
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="preview-bio">
                    {formData.bio || "No bio added"}
                  </p>

                  <div className="preview-section">
                    <h4>Travel Styles</h4>
                    <div className="tags-group">
                      {formData.travelStyles.length > 0 ? (
                        formData.travelStyles.map((style) => (
                          <Badge key={style}>{style}</Badge>
                        ))
                      ) : (
                        <span className="muted">Not selected</span>
                      )}
                    </div>
                  </div>

                  <div className="preview-section">
                    <h4>Interests</h4>
                    <div className="tags-group">
                      {formData.interestTags.length > 0 ? (
                        formData.interestTags.map((tag) => (
                          <Badge key={tag} variant="orange">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="muted">Not selected</span>
                      )}
                    </div>
                  </div>

                  <div className="preview-footer">
                    <p>Ready to find your travel mate!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="step-navigation">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            <ChevronLeft size={18} /> Back
          </Button>

          <div className="step-counter">
            {currentStep} of {STEPS.length}
          </div>

          <Button
            variant="primary"
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : currentStep === STEPS.length
                ? "Complete"
                : "Next"}
            {!isSubmitting && <ChevronRight size={18} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
