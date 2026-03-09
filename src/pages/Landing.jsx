import { Link } from "react-router-dom";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Button } from "../components/ui";
import {
  ArrowRight,
  Users,
  Heart,
  MessageCircle,
  Globe,
  FileEdit,
  Map,
  Star,
  User,
  Palmtree,
  Building2,
  Landmark,
  Mountain,
  Umbrella,
  ChevronRight,
  Check,
} from "lucide-react";
import "../styles/landing.css";

export default function Landing() {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="gradient-mesh-bg"></div>

        <nav className="landing-nav">
          <div className="logo">
            <div className="logo-icon">
              <img src="/logo.svg" alt="WanderMate" width={36} height={36} />
            </div>
            <span className="logo-text">WanderMate</span>
          </div>
          <SignInButton mode="modal" forceRedirectUrl="/app/home">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </SignInButton>
        </nav>

        <div className="hero-content">
          <h1 className="hero-title">
            Find Your Perfect{" "}
            <span className="text-gradient">Travel Partner</span>
          </h1>
          <p className="hero-subtitle">
            Discover amazing travel companions with compatible vibes, interests,
            and budgets. Never travel alone again.
          </p>

          <div className="hero-cta">
            <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
              <Button variant="primary" size="lg">
                Get Started Free
              </Button>
            </SignUpButton>
            <a href="#how-it-works">
              <Button variant="ghost" size="lg">
                See How It Works <ArrowRight size={18} />
              </Button>
            </a>
          </div>

          <div className="hero-cards">
            <div className="floating-card card-1">
              <div className="avatar-placeholder">
                <User size={28} />
              </div>
              <div className="card-info">
                <h3>Sarah</h3>
                <p>Backpacker</p>
              </div>
            </div>
            <div className="floating-card card-2">
              <div className="match-badge">Match</div>
              <h4>93%</h4>
              <p>Compatibility</p>
            </div>
            <div className="floating-card card-3">
              <div className="avatar-placeholder">
                <User size={28} />
              </div>
              <div className="card-info">
                <h3>Marco</h3>
                <p>Luxury</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <p className="section-subtitle">
            Three simple steps to find your travel companion
          </p>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <FileEdit size={24} />
              </div>
              <h3>Create Your Profile</h3>
              <p>
                Tell us about yourself — your travel style, interests, budget,
                and what you're looking for in a travel companion.
              </p>
            </div>

            <div className="step-connector">
              <ChevronRight size={24} />
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <Map size={24} />
              </div>
              <h3>Post Your Trip</h3>
              <p>
                Share your upcoming adventure — destination, dates, activities,
                and the type of travel buddy you want.
              </p>
            </div>

            <div className="step-connector">
              <ChevronRight size={24} />
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <MessageCircle size={24} />
              </div>
              <h3>Match & Explore</h3>
              <p>
                Get matched with compatible travelers, chat in real-time, and
                start planning your adventure together!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="featured-destinations">
        <div className="container">
          <h2>Trending Destinations</h2>
          <p className="section-subtitle">
            Popular trips with active travelers
          </p>

          <div className="destinations-carousel">
            {[
              { name: "Bali", country: "Indonesia", trips: 24, icon: Umbrella },
              { name: "Tokyo", country: "Japan", trips: 18, icon: Building2 },
              {
                name: "Barcelona",
                country: "Spain",
                trips: 31,
                icon: Landmark,
              },
              {
                name: "Thailand",
                country: "Thailand",
                trips: 27,
                icon: Palmtree,
              },
              { name: "Peru", country: "Peru", trips: 15, icon: Mountain },
            ].map((dest) => (
              <div key={dest.name} className="dest-card glass-card">
                <div className="dest-emoji">
                  <dest.icon size={24} />
                </div>
                <h3>{dest.name}</h3>
                <p>{dest.country}</p>
                <div className="dest-trips">{dest.trips} active trips</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatibility Feature */}
      <section className="compatibility-section">
        <div className="container">
          <h2>Smart Matching Algorithm</h2>
          <p className="section-subtitle">
            We match you based on compatibility, not just location
          </p>

          <div className="compatibility-demo">
            <div className="user-card">
              <div className="avatar lg">
                <User size={24} />
              </div>
              <h3>You</h3>
            </div>

            <div className="match-meter">
              <svg viewBox="0 0 200 200" className="compatibility-gauge">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="var(--border-card)"
                  strokeWidth="8"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="var(--color-teal)"
                  strokeWidth="8"
                  strokeDasharray="425 565"
                  className="gauge-fill"
                />
                <text
                  x="100"
                  y="110"
                  textAnchor="middle"
                  fontSize="32"
                  fontWeight="700"
                  fill="var(--color-teal)"
                >
                  89%
                </text>
              </svg>
              <div className="match-reasons">
                <div className="reason">
                  <Check size={14} /> Same destination
                </div>
                <div className="reason">
                  <Check size={14} /> Overlapping dates
                </div>
                <div className="reason">
                  <Check size={14} /> Similar interests
                </div>
              </div>
            </div>

            <div className="user-card">
              <div className="avatar lg">
                <User size={24} />
              </div>
              <h3>Match</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2>What Travelers Say</h2>

          <div className="testimonials-grid">
            {[
              {
                name: "Alex",
                trip: "Southeast Asia",
                quote:
                  "Found the perfect travel buddy on WanderMate! Had the best trip ever.",
              },
              {
                name: "Maya",
                trip: "Europe Tour",
                quote:
                  "The matching algorithm is insanely accurate. Met someone with exactly my vibe.",
              },
              {
                name: "Jordan",
                trip: "Bali Adventure",
                quote:
                  "Great platform, made travel friends I'll explore the world with forever!",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="testimonial-card glass-card"
              >
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} />
                  ))}
                </div>
                <p className="quote">"{testimonial.quote}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <User size={16} />
                  </div>
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.trip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <h2>Ready to Find Your Travel Mate?</h2>
          <p>Join thousands of adventurers already planning trips together</p>

          <div className="cta-buttons">
            <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
              <Button variant="primary" size="lg">
                Create Free Account
              </Button>
            </SignUpButton>
            <SignInButton mode="modal" forceRedirectUrl="/app/home">
              <Button variant="ghost" size="lg">
                Already have an account?
              </Button>
            </SignInButton>
          </div>

          <div className="social-proof">
            <div className="stat">
              <span className="stat-number">5,000+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat">
              <span className="stat-number">1,200+</span>
              <span className="stat-label">Active Trips</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.8</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>WanderMate</h4>
              <p>Find your perfect travel companion.</p>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li>
                  <a href="#how-it-works">How It Works</a>
                </li>
                <li>
                  <a href="#safety">Safety</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#blog">Blog</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 WanderMate. The world is better with a mate.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
