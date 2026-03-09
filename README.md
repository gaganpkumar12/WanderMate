# 🌍 WanderMate

**Travel Companion Matching** — Find your perfect travel partner. Think _Tinder meets Airbnb_ for co-travelers.

Users create profiles with personal preferences (budget style, diet, languages, travel vibe), post upcoming trips, and get matched with compatible travelers through a real-time compatibility scoring algorithm. Matched users can chat in real-time and plan their adventure together.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Convex](https://img.shields.io/badge/Convex-Realtime_Backend-FF6F61)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white)

---

## Features

- **Smart Matching** — Compatibility scoring algorithm based on travel style, budget, diet, languages, and interests
- **Swipe Discovery** — Browse potential travel mates via swipe cards or list view
- **Real-time Chat** — Convex-powered messaging with read receipts, search, and PDF export
- **Trip Management** — Create, edit, and manage trips with a multi-step wizard
- **Notifications** — Real-time alerts for new matches, messages, and trip likes
- **Animated UI** — Framer Motion page transitions, swipe cards, and micro-interactions
- **Responsive Design** — Mobile-first layout with sidebar (desktop) and bottom nav (mobile)
- **Dark Mode** — Deep navy glass-morphism design system

---

## Tech Stack

| Layer            | Technology          | Purpose                                |
| ---------------- | ------------------- | -------------------------------------- |
| **Frontend**     | React 19 + Vite     | UI framework & build tool              |
| **Routing**      | React Router DOM v7 | Client-side navigation                 |
| **Auth**         | Clerk               | Sign up, sign in, session management   |
| **Backend / DB** | Convex              | Serverless backend, real-time database |
| **Animations**   | Framer Motion       | Page transitions, swipe cards          |
| **Icons**        | Lucide React        | Icon set                               |
| **Toasts**       | Sonner              | Notification toasts                    |
| **PDF Export**   | jsPDF               | Export chat history                    |
| **Dates**        | date-fns            | Date formatting & calculations         |
| **Utilities**    | clsx                | Conditional class merging              |

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- A **Clerk** account — [dashboard.clerk.com](https://dashboard.clerk.com)
- A **Convex** account — [dashboard.convex.dev](https://dashboard.convex.dev)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the project root:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
VITE_CONVEX_URL=your_convex_url_here
```

### 3. Initialize Convex

Run the Convex dev server (in a separate terminal):

```bash
npx convex dev
```

This will prompt you to log in, create a project, generate the `convex/_generated/` files, and watch for changes.

### 4. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`.

---

## Project Structure

```
src/
├── components/
│   ├── ui/            # Reusable UI (Button, Card, Input, Badge, Avatar, ExpandableTabs)
│   ├── layout/        # Shell layout (Sidebar + BottomNav)
│   └── shared/        # Shared components (TripCard, UserCard, etc.)
├── pages/             # Route-level page components
│   ├── Landing.jsx    # Public landing page with animated sections
│   ├── Onboarding.jsx # Multi-step profile setup wizard
│   ├── Home.jsx       # Dashboard with stats & upcoming trips
│   ├── Trips.jsx      # Trip list with filters
│   ├── NewTrip.jsx    # Multi-step trip creation wizard
│   ├── TripDetail.jsx # Single trip view
│   ├── EditTrip.jsx   # Edit existing trip
│   ├── Discover.jsx   # Swipe cards / list view for finding mates
│   ├── Matches.jsx    # Mutual matches list with last message preview
│   ├── Chat.jsx       # Real-time chat with read receipts & PDF export
│   ├── Profile.jsx    # User profile view
│   └── EditProfile.jsx# Edit profile details
├── hooks/             # Custom React hooks (useAuth, useCurrentUser)
├── lib/               # Utilities, constants, validation
└── styles/            # CSS design system (tokens, globals, components, page styles)

convex/
├── schema.ts          # Database schema (users, trips, likes, matches, messages, notifications)
├── users.ts           # User CRUD & profile functions
├── trips.ts           # Trip management functions
├── likes.ts           # Like/pass system & match detection
├── matches.ts         # Match queries with enriched data
├── messages.ts        # Real-time messaging functions
└── notifications.ts   # Notification system
```

---

## Database Schema

| Table           | Description                                                                    |
| --------------- | ------------------------------------------------------------------------------ |
| `users`         | User profiles with preferences, travel styles, dietary restrictions, languages |
| `trips`         | Trip listings with destination, dates, vibe, budget, group size                |
| `likes`         | Like/pass records between users on specific trips                              |
| `matches`       | Mutual matches with compatibility scores                                       |
| `messages`      | Chat messages with read status per match                                       |
| `notifications` | Push-style notifications (new match, new message, trip like)                   |

---

## Routes

| Route                 | Page               | Access                     |
| --------------------- | ------------------ | -------------------------- |
| `/`                   | Landing            | Public                     |
| `/onboarding`         | Profile Setup      | Authenticated (no profile) |
| `/app`                | Dashboard          | Authenticated              |
| `/app/trips`          | My Trips           | Authenticated              |
| `/app/trips/new`      | Create Trip        | Authenticated              |
| `/app/trips/:id`      | Trip Detail        | Authenticated              |
| `/app/trips/:id/edit` | Edit Trip          | Authenticated              |
| `/app/discover`       | Discover Travelers | Authenticated              |
| `/app/matches`        | My Matches         | Authenticated              |
| `/app/chat/:matchId`  | Chat               | Authenticated              |
| `/app/profile`        | My Profile         | Authenticated              |
| `/app/profile/edit`   | Edit Profile       | Authenticated              |

---

## Available Scripts

| Command           | Description                                 |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Start Vite dev server                       |
| `npm run build`   | Production build                            |
| `npm run preview` | Preview production build                    |
| `npm run lint`    | Run ESLint                                  |
| `npx convex dev`  | Start Convex dev server (separate terminal) |

---

## Development Progress

- ✅ **Phase 1** — Setup & Foundation (Vite, design system, UI components, shell layout, Convex schema)
- ✅ **Phase 2** — Landing Page & Onboarding (animated landing, multi-step onboarding wizard)
- ✅ **Phase 3** — Trip Management (dashboard, trip CRUD, multi-step creation wizard)
- ✅ **Phase 4** — Discovery & Matching Engine (swipe cards, compatibility scoring, mutual match detection)
- ✅ **Phase 5** — Chat & Matches (real-time messaging, read receipts, notifications, PDF export)
- ⏳ **Phase 6** — Polish & Production (performance, accessibility, deployment)
- ⏳ Convex deployment (requires `npx convex dev`)
- ⏳ Protected route guards (using useAuth)

## Next Steps (Phase 2)

- Landing page with hero section & animations
- Onboarding wizard (7-step form)
- User profile completion flow
- Start building features
