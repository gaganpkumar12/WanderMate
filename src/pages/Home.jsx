import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui";
import {
  MapPin,
  Users,
  PlusCircle,
  Map,
  Heart,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../hooks/index.js";
import "../styles/pages/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const isNewUser = searchParams.get("welcome") === "new";

  return (
    <div className="page-home">
      {/* Welcome Header */}
      <div className="home-header">
        <div className="header-content">
          <h1>{isNewUser ? "Welcome" : "Welcome back"}, {user?.firstName || "Traveler"}</h1>
          <p>Let's find your next adventure</p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate("/app/trips/new")}
          className="btn-new-trip"
        >
          <PlusCircle size={20} />
          Plan a Trip
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Map size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Your Trips</p>
            <p className="stat-value">View & manage</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Heart size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Matches</p>
            <p className="stat-value">Find companions</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <MessageCircle size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Messages</p>
            <p className="stat-value">Stay connected</p>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="home-actions">
        <div className="action-card" onClick={() => navigate("/app/trips")}>
          <div className="action-icon">
            <MapPin size={28} />
          </div>
          <h3>My Trips</h3>
          <p>View all your planned adventures</p>
          <span className="action-arrow">
            <ArrowRight size={20} />
          </span>
        </div>

        <div className="action-card" onClick={() => navigate("/app/discover")}>
          <div className="action-icon">
            <Users size={28} />
          </div>
          <h3>Discover Mates</h3>
          <p>Browse compatible travel companions</p>
          <span className="action-arrow">
            <ArrowRight size={20} />
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="home-info">
        <div className="info-box">
          <h3>How WanderMate Works</h3>
          <ol>
            <li>
              <strong>Create a trip</strong> with your destination, dates, and
              style
            </li>
            <li>
              <strong>Discover mates</strong> who match your travel preferences
            </li>
            <li>
              <strong>Connect & chat</strong> to plan your adventure together
            </li>
            <li>
              <strong>Travel together</strong> and make unforgettable memories
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
