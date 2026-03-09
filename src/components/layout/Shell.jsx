import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Map,
  Compass,
  MessageCircle,
  User,
  Menu,
  X,
  Bell,
  Globe,
  PartyPopper,
  Heart,
} from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../hooks/index.js";
import clsx from "clsx";
import ExpandableTabs from "../ui/ExpandableTabs";
import "./Shell.css";

const navItems = [
  { label: "Home", href: "/app/home", icon: Home },
  { label: "Discover", href: "/app/discover", icon: Compass },
  { label: "Trips", href: "/app/trips", icon: Map },
  { label: "Matches", href: "/app/matches", icon: MessageCircle },
  { label: "Profile", href: "/app/profile", icon: User },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Get convex user for notification queries
  const convexUser = useQuery(
    api.users.getCurrentUser,
    user?.id ? { clerkId: user.id } : "skip",
  );

  const unreadCount = useQuery(
    api.notifications.getUnreadCount,
    convexUser?._id ? { userId: convexUser._id } : "skip",
  );

  const notifications = useQuery(
    api.notifications.getMyNotifications,
    convexUser?._id ? { userId: convexUser._id } : "skip",
  );

  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead({ notificationId: notification._id });
    }

    // Navigate based on notification type
    if (notification.type === "new_match" && notification.data?.matchId) {
      navigate("/app/matches");
    } else if (
      notification.type === "new_message" &&
      notification.data?.matchId
    ) {
      navigate(`/app/chat/${notification.data.matchId}`);
    } else if (notification.type === "trip_like") {
      navigate("/app/discover");
    }

    setShowNotifications(false);
  };

  const getNotificationIcon = (type) => {
    if (type === "new_match") return <PartyPopper size={16} />;
    if (type === "new_message") return <MessageCircle size={16} />;
    if (type === "trip_like") return <Heart size={16} />;
    return <Bell size={16} />;
  };

  const getRelativeTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <img src="/logo.svg" alt="WanderMate" width={36} height={36} />
            </div>
            <span className="logo-text">WanderMate</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={clsx(
                "nav-link",
                location.pathname === href && "active",
              )}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {(unreadCount || 0) > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          <button
            className="profile-button"
            onClick={() => navigate("/app/profile")}
          >
            <img
              src="https://i.pravatar.cc/40?u=user"
              alt="Profile"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </button>
        </div>
      </aside>

      {/* Notification Drawer */}
      {showNotifications && (
        <>
          <div
            className="notification-overlay"
            onClick={() => setShowNotifications(false)}
          />
          <aside className="notification-drawer">
            <div className="notification-drawer-header">
              <h3>Notifications</h3>
              {(unreadCount || 0) > 0 && convexUser?._id && (
                <button
                  className="mark-all-read"
                  onClick={() => markAllAsRead({ userId: convexUser._id })}
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="notification-list">
              {!notifications || notifications.length === 0 ? (
                <div className="notification-empty">
                  <Bell size={32} />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 50).map((n) => (
                  <button
                    key={n._id}
                    className={clsx("notification-item", !n.isRead && "unread")}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <span className="notification-icon">
                      {getNotificationIcon(n.type)}
                    </span>
                    <div className="notification-content">
                      <p className="notification-text">
                        {n.type === "new_message" && n.data?.senderName
                          ? `${n.data.senderName}: ${n.data.preview || "sent a message"}`
                          : n.type === "new_match"
                            ? `You matched${n.data?.destination ? ` for ${n.data.destination}` : ""}!`
                            : "New notification"}
                      </p>
                      <span className="notification-time">
                        {getRelativeTime(n.createdAt)}
                      </span>
                    </div>
                    {!n.isRead && <span className="notification-dot" />}
                  </button>
                ))
              )}
            </div>
          </aside>
        </>
      )}

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Sidebar */}
      {isOpen && (
        <aside className="sidebar-mobile">
          <nav className="sidebar-nav">
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className={clsx(
                  "nav-link",
                  location.pathname === href && "active",
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </aside>
      )}
    </>
  );
}

const expandableTabs = navItems.map(({ label, href, icon }) => ({
  title: label,
  href,
  icon,
}));

export function Shell({ children }) {
  return (
    <div className="shell">
      <Sidebar />
      <main className="shell-main">{children}</main>
      <ExpandableTabs tabs={expandableTabs} />
    </div>
  );
}
