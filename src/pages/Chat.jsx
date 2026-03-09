import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../hooks/index.js";
import { Button } from "../components/ui";
import {
  ArrowLeft,
  Send,
  MapPin,
  Calendar,
  Sparkles,
  Search,
  Download,
  ChevronDown,
  Check,
  CheckCheck,
  X,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import "../styles/pages/chat.css";

export default function Chat() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messageText, setMessageText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tripExpanded, setTripExpanded] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Get convex user
  const convexUser = useQuery(
    api.users.getCurrentUser,
    user?.id ? { clerkId: user.id } : "skip",
  );

  // Get match details
  const match = useQuery(
    api.matches.getMatchById,
    matchId ? { matchId } : "skip",
  );

  // Get messages (real-time subscription)
  const messages = useQuery(
    api.messages.getMessages,
    matchId ? { matchId } : "skip",
  );

  // Mutations
  const sendMessage = useMutation(api.messages.sendMessage);
  const markAsRead = useMutation(api.messages.markAsRead);

  // Determine the other user
  const otherUser =
    match && convexUser
      ? match.userAId === convexUser._id
        ? match.userB
        : match.userA
      : null;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Mark messages as read when viewing
  useEffect(() => {
    if (matchId && convexUser?._id) {
      markAsRead({ matchId, userId: convexUser._id });
    }
  }, [matchId, convexUser?._id, messages?.length]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, [matchId]);

  const handleSend = async () => {
    const text = messageText.trim();
    if (!text || !convexUser?._id || !matchId) return;

    setMessageText("");
    try {
      await sendMessage({
        matchId,
        senderId: convexUser._id,
        text,
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessageText(text); // Restore on failure
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExportPDF = async () => {
    if (!messages || messages.length === 0) return;

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    const title = `Chat with ${otherUser?.firstName || "Match"}`;
    const destination = match?.trip?.destination || "";

    doc.setFontSize(16);
    doc.text(title, 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      destination ? `Trip to ${destination}` : "WanderMate Chat",
      14,
      28,
    );
    doc.line(14, 32, 196, 32);

    let y = 40;
    doc.setFontSize(10);

    for (const msg of messages) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      const isMine = msg.senderId === convexUser?._id;
      const senderName = isMine ? "You" : otherUser?.firstName || "Them";
      const time = format(new Date(msg.createdAt), "MMM d, h:mm a");

      doc.setTextColor(
        isMine ? 0 : 100,
        isMine ? 150 : 100,
        isMine ? 130 : 100,
      );
      doc.setFont(undefined, "bold");
      doc.text(`${senderName}  •  ${time}`, 14, y);
      y += 6;

      doc.setTextColor(40, 40, 40);
      doc.setFont(undefined, "normal");
      const lines = doc.splitTextToSize(msg.text, 170);
      doc.text(lines, 14, y);
      y += lines.length * 5 + 6;
    }

    doc.save(`wandermate-chat-${matchId.slice(0, 8)}.pdf`);
  };

  // Format day separator
  const getDaySeparator = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  // Filter messages by search
  const filteredMessages = searchQuery
    ? messages?.filter((m) =>
        m.text.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : messages;

  // Loading
  if (!convexUser || match === undefined) {
    return (
      <div className="page-chat">
        <div className="chat-loading">
          <div className="loading-spinner" />
          <p>Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="page-chat">
        <div className="chat-not-found">
          <h2>Match not found</h2>
          <p>This conversation doesn't exist or you don't have access.</p>
          <Button variant="primary" onClick={() => navigate("/app/matches")}>
            Back to Matches
          </Button>
        </div>
      </div>
    );
  }

  const messageList = filteredMessages || [];

  return (
    <div className="page-chat">
      {/* Chat Header */}
      <div className="chat-header">
        <button
          className="chat-back-btn"
          onClick={() => navigate("/app/matches")}
        >
          <ArrowLeft size={20} />
        </button>

        <div className="chat-header-user">
          <div className="chat-header-avatar">
            {otherUser?.avatarUrl ? (
              <img src={otherUser.avatarUrl} alt={otherUser.firstName} />
            ) : (
              <div className="chat-avatar-placeholder">
                {otherUser?.firstName?.[0] || "?"}
              </div>
            )}
          </div>
          <div className="chat-header-info">
            <h3>
              {otherUser?.firstName} {otherUser?.lastName}
            </h3>
            {match.compatibilityScore > 0 && (
              <span className="chat-header-compat">
                <Sparkles size={12} />
                {match.compatibilityScore}% match
              </span>
            )}
          </div>
        </div>

        <div className="chat-header-actions">
          <button
            className="chat-action-btn"
            onClick={() => {
              setShowSearch(!showSearch);
              setSearchQuery("");
            }}
            title="Search messages"
          >
            <Search size={18} />
          </button>
          <button
            className="chat-action-btn"
            onClick={handleExportPDF}
            title="Export chat"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            className="chat-search-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <span className="search-count">
                {messageList.length} result{messageList.length !== 1 ? "s" : ""}
              </span>
            )}
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchQuery("");
              }}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trip Pin Card */}
      {match.trip && (
        <div className={`chat-trip-pin ${tripExpanded ? "expanded" : ""}`}>
          <button
            className="trip-pin-toggle"
            onClick={() => setTripExpanded(!tripExpanded)}
          >
            <div className="trip-pin-summary">
              <MapPin size={16} />
              <span>
                Traveling to {match.trip.destination}, {match.trip.country}
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`trip-pin-chevron ${tripExpanded ? "rotated" : ""}`}
            />
          </button>
          <AnimatePresence>
            {tripExpanded && (
              <motion.div
                className="trip-pin-details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="trip-pin-row">
                  <Calendar size={14} />
                  <span>
                    {format(new Date(match.trip.startDate), "MMM d")} →{" "}
                    {format(new Date(match.trip.endDate), "MMM d, yyyy")}
                  </span>
                </div>
                {match.trip.tripVibe && (
                  <div className="trip-pin-row">
                    <Sparkles size={14} />
                    <span>{match.trip.tripVibe}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Messages Area */}
      <div className="chat-messages" ref={messagesContainerRef}>
        {messageList.length === 0 ? (
          <div className="chat-empty">
            <div className="chat-empty-icon">
              <MessageCircle size={40} />
            </div>
            <h3>Start the conversation!</h3>
            <p>
              Say hello to {otherUser?.firstName || "your match"} and start
              planning your trip together.
            </p>
          </div>
        ) : (
          messageList.map((msg, idx) => {
            const isMine = msg.senderId === convexUser?._id;
            const showDaySep =
              idx === 0 ||
              !isSameDay(
                new Date(messageList[idx - 1].createdAt),
                new Date(msg.createdAt),
              );

            return (
              <div key={msg._id}>
                {/* Day Separator */}
                {showDaySep && (
                  <div className="chat-day-separator">
                    <span>{getDaySeparator(msg.createdAt)}</span>
                  </div>
                )}

                {/* Message Bubble */}
                <motion.div
                  className={`chat-bubble-row ${isMine ? "sent" : "received"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {!isMine && (
                    <div className="bubble-avatar">
                      {otherUser?.avatarUrl ? (
                        <img src={otherUser.avatarUrl} alt="" />
                      ) : (
                        <span>{otherUser?.firstName?.[0] || "?"}</span>
                      )}
                    </div>
                  )}

                  <div className={`chat-bubble ${isMine ? "mine" : "theirs"}`}>
                    <p className="bubble-text">{msg.text}</p>
                    <div className="bubble-meta">
                      <span className="bubble-time">
                        {format(new Date(msg.createdAt), "h:mm a")}
                      </span>
                      {isMine && (
                        <span
                          className={`bubble-status ${msg.isRead ? "read" : ""}`}
                        >
                          {msg.isRead ? (
                            <CheckCheck size={14} />
                          ) : (
                            <Check size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="chat-input-bar">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder={`Message ${otherUser?.firstName || ""}...`}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          className={`chat-send-btn ${messageText.trim() ? "active" : ""}`}
          onClick={handleSend}
          disabled={!messageText.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
