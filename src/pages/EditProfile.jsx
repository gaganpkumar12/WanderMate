import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../hooks/index.js";
import { Button, Input } from "../components/ui";
import { ArrowLeft, Save } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  TRAVELER_TYPES,
  DIETARY_OPTIONS,
  INTEREST_TAGS,
} from "../lib/constants.js";
import "../styles/pages/edit-profile.css";

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Mandarin",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Portuguese",
  "Italian",
  "Russian",
];

const TRAVEL_STYLES = [
  "Solo",
  "Couple",
  "Group",
  "Family",
  "Backpacking",
  "Road Trip",
  "Volunteering",
  "Digital Nomad",
];

export default function EditProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const convexUser = useQuery(
    api.users.getCurrentUser,
    user?.id ? { clerkId: user.id } : "skip",
  );

  const updateProfile = useMutation(api.users.updateProfile);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    dob: "",
    gender: "",
    travelerType: "",
    financialNature: "normal",
    dietaryRestrictions: [],
    languages: [],
    travelStyles: [],
    interestTags: [],
  });

  // Pre-fill form when user data loads
  useEffect(() => {
    if (convexUser) {
      setForm({
        firstName: convexUser.firstName || "",
        lastName: convexUser.lastName || "",
        bio: convexUser.bio || "",
        dob: convexUser.dob || "",
        gender: convexUser.gender || "",
        travelerType: convexUser.travelerType || "",
        financialNature: convexUser.financialNature || "normal",
        dietaryRestrictions: convexUser.dietaryRestrictions || [],
        languages: convexUser.languages || [],
        travelStyles: convexUser.travelStyles || [],
        interestTags: convexUser.interestTags || [],
      });
    }
  }, [convexUser]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field, value) => {
    setForm((prev) => {
      const arr = prev[field] || [];
      const updated = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleSave = async () => {
    if (!convexUser?._id) return;
    setSaving(true);
    try {
      await updateProfile({
        userId: convexUser._id,
        firstName: form.firstName,
        lastName: form.lastName,
        bio: form.bio,
        dob: form.dob,
        gender: form.gender,
        travelerType: form.travelerType,
        financialNature: form.financialNature,
        dietaryRestrictions: form.dietaryRestrictions,
        languages: form.languages,
        travelStyles: form.travelStyles,
        interestTags: form.interestTags,
      });
      toast.success("Profile updated!");
      navigate("/app/profile");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!convexUser) {
    return (
      <div className="page-edit-profile">
        <div className="edit-loading">
          <div className="loading-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-edit-profile">
      {/* Header */}
      <div className="edit-header">
        <button className="back-btn" onClick={() => navigate("/app/profile")}>
          <ArrowLeft size={20} />
        </button>
        <h1>Edit Profile</h1>
        <div className="header-spacer" />
      </div>

      {/* Form */}
      <motion.div
        className="edit-form"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Basic Info */}
        <section className="form-section">
          <h3 className="form-section-title">Basic Info</h3>
          <div className="form-row">
            <div className="form-field">
              <label>First Name</label>
              <Input
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="form-field">
              <label>Last Name</label>
              <Input
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="form-field">
            <label>Bio</label>
            <textarea
              className="edit-textarea"
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Tell fellow travelers about yourself..."
              maxLength={200}
              rows={3}
            />
            <span className="char-count">{form.bio.length}/200</span>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Date of Birth</label>
              <Input
                type="date"
                value={form.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Gender</label>
              <select
                className="edit-select"
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </section>

        {/* Traveler Type */}
        <section className="form-section">
          <h3 className="form-section-title">Traveler Type</h3>
          <div className="chip-grid">
            {TRAVELER_TYPES.map((type) => (
              <button
                key={type.id}
                className={`chip ${form.travelerType === type.id ? "selected" : ""}`}
                onClick={() => handleChange("travelerType", type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </section>

        {/* Financial Nature */}
        <section className="form-section">
          <h3 className="form-section-title">Financial Nature</h3>
          <div className="chip-grid">
            {["thrifty", "normal", "generous"].map((val) => (
              <button
                key={val}
                className={`chip ${form.financialNature === val ? "selected" : ""}`}
                onClick={() => handleChange("financialNature", val)}
              >
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Travel Styles */}
        <section className="form-section">
          <h3 className="form-section-title">Travel Styles</h3>
          <div className="chip-grid">
            {TRAVEL_STYLES.map((style) => (
              <button
                key={style}
                className={`chip ${form.travelStyles.includes(style) ? "selected" : ""}`}
                onClick={() => handleToggle("travelStyles", style)}
              >
                {style}
              </button>
            ))}
          </div>
        </section>

        {/* Dietary Restrictions */}
        <section className="form-section">
          <h3 className="form-section-title">Dietary Restrictions</h3>
          <div className="chip-grid">
            {DIETARY_OPTIONS.map((opt) => (
              <button
                key={opt}
                className={`chip ${form.dietaryRestrictions.includes(opt) ? "selected" : ""}`}
                onClick={() => handleToggle("dietaryRestrictions", opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section className="form-section">
          <h3 className="form-section-title">Languages</h3>
          <div className="chip-grid">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                className={`chip ${form.languages.includes(lang) ? "selected" : ""}`}
                onClick={() => handleToggle("languages", lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </section>

        {/* Interests */}
        <section className="form-section">
          <h3 className="form-section-title">Interests</h3>
          <div className="chip-grid">
            {INTEREST_TAGS.map((tag) => (
              <button
                key={tag.id}
                className={`chip ${form.interestTags.includes(tag.id) ? "selected" : ""}`}
                onClick={() => handleToggle("interestTags", tag.id)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </section>
      </motion.div>

      {/* Sticky Save Footer */}
      <div className="edit-footer">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving || !form.firstName || !form.lastName}
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
