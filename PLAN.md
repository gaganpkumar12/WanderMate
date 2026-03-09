# 🧭 WanderMate — Master Project Plan
> **Stack**: React 19 (Vite) + Convex Backend + Clerk Auth + Framer Motion
> **Last Updated**: February 27, 2026

---

## 📌 Table of Contents

1. [What is WanderMate?](#1-what-is-wandermate)
2. [Current Project Audit](#2-current-project-audit)
3. [Tech Stack (Planned)](#3-tech-stack-planned)
4. [Design Vision](#4-design-vision)
5. [Convex Database Schema](#5-convex-database-schema)
6. [Route Map](#6-route-map)
7. [Phase 1 — Setup & Foundation](#phase-1--setup--foundation-week-1)
8. [Phase 2 — Landing Page & Onboarding](#phase-2--landing-page--onboarding-weeks-23)
9. [Phase 3 — Trip Management](#phase-3--trip-management-week-4)
10. [Phase 4 — Discovery & Matching Engine](#phase-4--discovery--matching-engine-weeks-56)
11. [Phase 5 — Chat & Matches](#phase-5--chat--matches-weeks-78)
12. [Phase 6 — Polish & Production](#phase-6--polish--production-weeks-910)
13. [Suggested Feature Improvements](#13-suggested-feature-improvements)
14. [Timeline Summary](#14-timeline-summary)
15. [Final Dependency List](#15-final-dependency-list)

---

## 1. What is WanderMate?

**WanderMate** is a travel companion matching web application — think *"Tinder for travel partners"*.

- Users register with personal preferences (budget style, diet, language, travel vibe, interests)
- They post upcoming trips with destination, dates, and activity preferences
- The app uses a **compatibility scoring algorithm** to surface well-matched co-travelers
- Matched users can chat in real-time and plan their trip together

---

## 2. Current Project Audit

### 2.1 — Current Folder Structure
```
WanderMate/
├── client/                    ✅ React (Create React App)
│   └── src/
│       ├── App.js             ← Root router (8 routes)
│       ├── api.js             ← Fetch-based API layer → localhost:5000
│       ├── index.js           ← Entry point
│       ├── index.css          ← Minimal base styles
│       ├── App.css            ← CRA default styles
│       └── components/
│           ├── Login.jsx      ← Username/password login
│           ├── Register.jsx   ← Rich registration form
│           ├── Home.jsx       ← Dashboard (Bootstrap navbar)
│           ├── NewTrip.jsx    ← Create a trip form
│           ├── FindMate.jsx   ← Browse potential companions
│           ├── Matches.jsx    ← Mutual matches + TalkJS chat
│           ├── Profile.jsx    ← User info + trip history
│           ├── FullScreenChat.jsx  ← Local chat with PDF export
│           └── ErrorPage.jsx  ← Generic error display
└── server/                    🔴 EMPTY — no backend built yet
```

### 2.2 — Existing API Functions (`api.js`)

| Function | Method | Endpoint | Status |
|---|---|---|---|
| `loginUser(credentials)` | POST | `/auth/login` | Defined, not backed |
| `registerUser(data)` | POST | `/auth/register` | Defined, not backed |
| `getMyTrips()` | GET | `/trips/my` | Defined, never called |
| `addTrip(data)` | POST | `/trips/new` | Defined, not backed |
| `getMatches()` | GET | `/matches` | Defined, never called |
| `likeUser(palId)` | POST | `/matches/like` | Defined, never called |

### 2.3 — Existing Pages Summary

| Page | Route | Purpose | Issues |
|---|---|---|---|
| `Login.jsx` | `/login` | Auth form | API not backed |
| `Register.jsx` | `/register` | Profile creation | `onRegister` prop never passed |
| `Home.jsx` | `/` | Dashboard + trip selector | Props never passed from App.js |
| `NewTrip.jsx` | `/new_trip` | Create a trip | `onSubmit` prop never passed |
| `FindMate.jsx` | `/find_mate` | Browse matches | Data never fetched |
| `Matches.jsx` | `/matches` | Mutual matches | TalkJS App ID is placeholder |
| `Profile.jsx` | `/profile` | User info | Props never passed |
| `FullScreenChat.jsx` | `/chat` | Local-only chat | Not connected to any server |
| `ErrorPage.jsx` | *(unused)* | Error display | Not used as a route |

### 2.4 — Critical Issues Found

| # | Issue | Severity |
|---|---|---|
| 1 | `server/` directory is completely empty — no backend | 🔴 Critical |
| 2 | No global state — `App.js` passes zero props to any component | 🔴 Critical |
| 3 | `onRegister` and `onSubmit` callbacks never wired in `App.js` | 🔴 Critical |
| 4 | TalkJS App ID is `YOUR_TALKJS_APP_ID` placeholder | 🟠 High |
| 5 | No authentication route guards — all pages are publicly accessible | 🟠 High |
| 6 | `getMatches`, `getMyTrips`, `likeUser` defined but never called | 🟡 Medium |
| 7 | Inconsistent branding — "EXPLORE HUB" vs "WanderMate", two logo paths | 🟡 Medium |
| 8 | `FullScreenChat` uses `sessionStorage` only — no real chat | 🟡 Medium |
| 9 | Minimal CSS — no design system, relies entirely on Bootstrap classes | 🟢 Low |

### 2.5 — What Will Be Reused
- `jsPDF` dependency (chat export)
- The core component ideas (Login, Register, NewTrip, FindMate, Matches, Profile, Chat)
- The route concept (`/login`, `/register`, `/`, `/new_trip`, etc.)

### 2.6 — What Will Be Replaced / Rebuilt
- **Backend**: Entire Express backend → replaced by **Convex** (serverless, real-time)
- **Auth**: Custom username/password → replaced by **Clerk** (OAuth, email, social login)
- **Chat**: TalkJS + local sessionStorage chat → **Convex real-time subscriptions** (custom built)
- **State**: No state → **React Context + Convex `useQuery`/`useMutation` hooks**
- **Bundler**: Create React App → **Vite** (faster, modern)
- **Styling**: Bootstrap class spam → **Vanilla CSS design system** + Framer Motion

---

## 3. Tech Stack (Planned)

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + Vite | UI framework |
| **Routing** | React Router DOM v7 | Client-side navigation |
| **Auth** | Clerk | Sign up, sign in, session management |
| **Backend / DB** | Convex | Serverless backend, real-time DB, file storage |
| **Animations** | Framer Motion | Page transitions, swipe cards, micro-interactions |
| **Icons** | Lucide React | Clean icon set |
| **Toasts** | Sonner | Notification toasts |
| **PDF Export** | jsPDF | Export chat history |
| **Dates** | date-fns | Date formatting and calculations |
| **Utilities** | clsx | Conditional class name merging |

---

## 4. Design Vision

> WanderMate should feel like a **premium travel lifestyle app** — think Airbnb meets Tinder, with the visual sophistication of Linear.app.

### 4.1 — Color Palette
```
Background Primary:  #0A0F1E  (deep navy)
Background Card:     rgba(255,255,255,0.04)  (glass effect)
Card Border:         rgba(255,255,255,0.08)
Primary Accent:      #00D4AA  (electric teal)
Secondary Accent:    #FF6B35  (sunset orange)
Tertiary Accent:     #7B68EE  (soft lavender)
Highlight:           #FFD700  (gold — for match/achievement moments)
Text Primary:        #F0F4FF
Text Secondary:      #8892A4
```

### 4.2 — Typography
- **Headings**: `Syne` (bold, geometric — from Google Fonts)
- **Body**: `Inter` (clean, readable — from Google Fonts)

### 4.3 — Design Style
- **Glassmorphism** cards: `backdrop-filter: blur(20px)` + semi-transparent backgrounds
- **Gradient mesh** animated SVG backgrounds on key pages
- **Parallax scroll** effects on the landing page
- **Spring physics** animations on card interactions (Framer Motion)
- **Staggered list reveals** — items animate in one-by-one on load
- **Hover microanimations** — every interactive element responds

### 4.4 — CSS Design Tokens
```css
:root {
  --bg-primary:    #0A0F1E;
  --bg-secondary:  #0F1629;
  --bg-card:       rgba(255,255,255,0.04);
  --border-card:   rgba(255,255,255,0.08);
  --color-teal:    #00D4AA;
  --color-orange:  #FF6B35;
  --color-lavender:#7B68EE;
  --color-gold:    #FFD700;
  --text-primary:  #F0F4FF;
  --text-secondary:#8892A4;
  --radius-card:   20px;
  --blur-glass:    blur(20px);
  --shadow-glow:   0 0 40px rgba(0, 212, 170, 0.15);
}
```

---

## 5. Convex Database Schema

```ts
// convex/schema.ts

users: {
  clerkId: string,                          // Clerk user ID
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  dob: string,
  gender: string,
  bio: string,                              // Short intro paragraph
  avatarUrl: string,                        // Convex file storage URL
  financialNature: "spender"|"normal"|"saver",
  dietaryRestrictions: string[],            // Multi-select
  languages: string[],                      // Multi-select
  travelStyles: string[],                   // Backpacker/Luxury/Adventure/Cultural...
  interestTags: string[],                   // Photography/Hiking/Foodie/Nightlife...
  travelerType: string,                     // Vibe check result: Adventurer/Foodie/etc.
  isVerified: boolean,
  createdAt: number,
}

trips: {
  userId: Id<"users">,
  destination: string,
  country: string,
  startDate: string,
  endDate: string,
  natureTrip: string,
  tripPreferences: string[],                // Multi-select activities
  budget: "budget"|"mid-range"|"luxury",
  groupSize: number,                        // How many more spots available
  coverImageUrl: string,                    // Trip cover photo
  status: "planning"|"active"|"completed",
  isPublic: boolean,
  createdAt: number,
}

likes: {
  fromUserId: Id<"users">,
  toUserId: Id<"users">,
  tripId: Id<"trips">,
  createdAt: number,
}

matches: {
  userAId: Id<"users">,
  userBId: Id<"users">,
  tripId: Id<"trips">,
  compatibilityScore: number,
  createdAt: number,
}

messages: {
  matchId: Id<"matches">,
  senderId: Id<"users">,
  text: string,
  imageUrl?: string,                        // Optional image attachment
  isRead: boolean,
  createdAt: number,
}

notifications: {
  userId: Id<"users">,
  type: "new_match"|"new_message"|"trip_like",
  data: any,
  isRead: boolean,
  createdAt: number,
}
```

---

## 6. Route Map

```
/                        → Landing page (public)
/sign-in                 → Clerk sign-in
/sign-up                 → Clerk sign-up
/onboarding              → Post-signup onboarding wizard

/app                     → Protected shell layout (sidebar + tab bar)
/app/home                → Dashboard
/app/discover            → Swipe / Browse potential mates
/app/trips               → My trips list
/app/trips/new           → Create new trip form
/app/trips/:id           → Trip detail page
/app/matches             → Matches list + chat sidebar
/app/chat/:matchId       → Full chat view
/app/profile             → My profile
/app/profile/edit        → Edit profile
/app/notifications       → Notification center
```

---

## Phase 1 — Setup & Foundation (Week 1)

**Goal**: Skeleton app with auth, routing, and design system wired up.

### Step 1.1 — Initialize with Vite
```bash
cd WanderMate
npm create vite@latest client-v2 -- --template react
cd client-v2
npm install
```

### Step 1.2 — Install All Dependencies
```bash
npm install convex @clerk/clerk-react react-router-dom framer-motion
npm install lucide-react sonner jspdf date-fns clsx
```

### Step 1.3 — Initialize Convex
```bash
npx convex dev
# Follow prompts: create project, generates convex/ folder
```

### Step 1.4 — Clerk Setup
- Create project at [clerk.dev](https://clerk.dev)
- Add `VITE_CLERK_PUBLISHABLE_KEY` to `.env.local`
- Wrap `main.jsx` with `<ClerkProvider>` + `<ConvexProviderWithClerk>`

### Step 1.5 — Folder Structure (New)
```
client-v2/src/
├── main.jsx
├── App.jsx               ← Router + providers
├── styles/
│   ├── tokens.css        ← Design system variables
│   ├── globals.css       ← Base reset + utility classes
│   └── components.css    ← Shared component styles
├── components/
│   ├── ui/               ← Reusable atoms: Button, Input, Card, Badge, Avatar
│   ├── layout/           ← Sidebar, BottomNav, Shell, Header
│   └── shared/           ← TripCard, UserCard, MatchCard, etc.
├── pages/
│   ├── Landing.jsx
│   ├── Onboarding.jsx
│   ├── Home.jsx
│   ├── Discover.jsx
│   ├── Trips.jsx
│   ├── NewTrip.jsx
│   ├── TripDetail.jsx
│   ├── Matches.jsx
│   ├── Chat.jsx
│   ├── Profile.jsx
│   └── EditProfile.jsx
├── hooks/                ← Custom hooks: useCurrentUser, useMatches, useTrips
├── lib/                  ← Utilities: scoring.js, dates.js, constants.js
└── convex/               ← Auto-generated + custom functions
    ├── schema.ts
    ├── users.ts
    ├── trips.ts
    ├── likes.ts
    ├── matches.ts
    ├── messages.ts
    └── notifications.ts
```

### Step 1.6 — Shell Layout
- Left sidebar (desktop): Logo, nav links, user avatar, notification bell
- Bottom tab bar (mobile): 5 tabs with icons + labels
- Animated active indicator (sliding underline / pill)
- Protected route wrapper: redirect to `/sign-in` if not authenticated

**✅ Phase 1 Done When**: App loads, sign up / sign in works via Clerk, shell layout renders, design tokens applied.

---

## Phase 2 — Landing Page & Onboarding (Weeks 2–3)

**Goal**: Jaw-dropping first impression + seamless onboarding that creates a full user profile.

### Step 2.1 — Landing Page Sections

1. **Hero Section**
   - Full-screen animated gradient mesh background (CSS `@keyframes` radial gradient shift)
   - Large headline with typewriter cycling: *"Find your perfect travel partner"* / *"Explore the world, together"* / *"Never travel alone again"*
   - Sub-headline + two CTAs: **Get Started** (teal, filled) + **See How It Works** (ghost)
   - Floating 3D-style profile cards on the right (CSS `perspective` + `rotateY` on hover)

2. **How It Works** — 3 animated steps with icons + connector line
   - ① Register your preferences
   - ② Post your upcoming trip
   - ③ Match, chat & go!

3. **Featured Destinations** — Horizontal scrollable carousel
   - Cards: destination photo, city name, country flag, "X active trips" count
   - Hover: card lifts + image zooms slightly

4. **Compatibility Preview** — Animated demo showing two profile cards with a % meter filling up

5. **Testimonials** — Glassmorphism quote cards, auto-rotating carousel

6. **CTA Banner** — Full-width gradient section, large CTA

7. **Footer** — Links, socials, tagline *"The world is better with a mate."*

### Step 2.2 — Onboarding Wizard (7 Steps)

Progress bar fills with teal gradient. Each step slides in from the right.

```
Step 1: Basic Info
  → First name, Last name, Username, Date of birth, Gender

Step 2: Your Bio
  → Textarea (max 200 chars) with live character counter
  → Placeholder: "Tell future mates what kind of traveler you are..."

Step 3: Avatar Upload
  → Drag & drop zone or click to browse
  → Circular preview with teal ring
  → Upload to Convex file storage

Step 4: Travel Style (multi-select cards)
  → Backpacker 🎒 / Budget Explorer 💸 / Comfort Seeker 🛏️
  → Adventure Seeker 🧗 / Luxury Traveler ✈️ / Cultural Immersionist 🎭

Step 5: Preferences (chips)
  → Dietary: Omnivore / Vegetarian / Vegan / Halal / Kosher / Gluten-free
  → Languages: Searchable tag input
  → Financial nature: 3-stop visual slider (Saver ← → Spender)

Step 6: Interest Tags (tag cloud)
  → Photography 📷 / Hiking 🥾 / Street Food 🍜 / Nightlife 🎉
  → Museums 🏛️ / Water Sports 🤿 / Road Trips 🚗 / Wildlife 🦁
  → Yoga & Wellness 🧘 / Shopping 🛍️ / Music 🎵 / History 📚
  → Select at least 3, max 10

Step 7: Your WanderMate Card (Preview)
  → Animated reveal of how your profile card looks to others
  → Shows avatar, name, age, traveler type badge, interest tags
  → "This is how mates will see you!"
  → Finish button → saves user to Convex, navigates to /app/home
```

**✅ Phase 2 Done When**: Landing page is live, new sign-ups complete full onboarding, user document saved in Convex `users` table.

---

## Phase 3 — Trip Management (Week 4)

**Goal**: Users can create, view, and manage their trips.

### Step 3.1 — My Trips Page (`/app/trips`)

**Layout**: Card grid — 3 cols (desktop), 2 cols (tablet), 1 col (mobile)

**Trip Card UI**:
- Cover image (destination photo — pull from Unsplash API by keyword or user-uploaded)
- Destination + country flag emoji (top-left overlay badge)
- "X days away" or "🟢 In Progress" status pill (top-right)
- Budget tier icon chip: 💸 Budget / 💰 Mid-range / ✈️ Luxury
- Trip nature tags: nature_trip + trip_preferences as colored chips
- Date range: `Mar 5 → Mar 15` with a mini duration badge `10 days`
- Bottom action bar: **Edit** | **Delete** | **Find Mate** (glows teal on hover)

**Empty state**: Animated SVG suitcase with bouncing character + "Plan your first adventure" CTA

### Step 3.2 — Create New Trip (`/app/trips/new`)

Animated multi-section form (sections expand as you fill):

```
Section 1: Destination
  → Type-ahead autocomplete input with country flag
  → Autofills country field

Section 2: Dates
  → Custom dual inline calendar (start → end)
  → Highlights trip range in teal
  → Shows "X days trip" counter

Section 3: Trip Vibe (illustrated card grid)
  → 🏙️ Urban City   🏕️ Wilderness   🏖️ Beach
  → 🏔️ Mountains    🎭 Heritage     🍷 Luxury

Section 4: Activities (multi-select chip list)
  → Street Food / Clubbing / Museums / Hiking
  → Photography / Water Sports / Shopping / Wildlife

Section 5: Budget
  → 3-stop visual slider: Budget → Mid-range → Luxury
  → Shows estimated daily spend range per level

Section 6: Group Size
  → "How many travel companions are you looking for?"
  → +/- stepper (1–5)

Section 7: Cover Photo
  → Auto-suggest based on destination (Unsplash API)
  → Or drag & drop custom upload

Section 8: Visibility
  → Toggle: Public (discoverable) / Private (visible only to you)
```

**Submit flow**: Loading spinner → success page with confetti burst → redirect to `/app/trips`

**Convex mutation**: `createTrip` — writes to `trips` table, linked to current user.

### Step 3.3 — Trip Detail Page (`/app/trips/:id`)

Full view with cover image hero, all details, and **"Find Mates for This Trip"** button.

**✅ Phase 3 Done When**: Trip CRUD works end-to-end, all data persisted in Convex.

---

## Phase 4 — Discovery & Matching Engine (Weeks 5–6)

**Goal**: The core product loop — find compatible travel companions with a beautiful swipe/browse UI.

### Step 4.1 — Compatibility Scoring (Convex Query)

```ts
// convex/matching.ts
export const findCandidates = query(async ({ db, auth }, { tripId }) => {
  const myUser = await getCurrentUser(auth, db);
  const myTrip = await db.get(tripId);

  const allTrips = await db.query("trips")
    .filter(t =>
      t.userId !== myUser._id &&
      t.status !== "completed" &&
      t.isPublic === true
    ).collect();

  // Filter out already-liked users
  const myLikes = await db.query("likes")
    .withIndex("by_from", q => q.eq("fromUserId", myUser._id))
    .collect();
  const likedIds = new Set(myLikes.map(l => l.toUserId));

  return allTrips
    .filter(trip => !likedIds.has(trip.userId))
    .map(trip => {
      let score = 0;

      // 1. Date overlap (0–25 pts)
      const overlapDays = getDateOverlap(myTrip.startDate, myTrip.endDate, trip.startDate, trip.endDate);
      score += Math.min(overlapDays * 2.5, 25);

      // 2. Same destination (0–25 pts)
      if (trip.destination === myTrip.destination) score += 25;
      else if (trip.country === myTrip.country) score += 10;

      // 3. Shared travel styles (0–20 pts)
      const sharedStyles = intersect(myUser.travelStyles, otherUser.travelStyles);
      score += Math.min(sharedStyles.length * 5, 20);

      // 4. Language match (0–15 pts)
      const sharedLangs = intersect(myUser.languages, otherUser.languages);
      score += Math.min(sharedLangs.length * 7, 15);

      // 5. Budget compatibility (0–10 pts)
      if (trip.budget === myTrip.budget) score += 10;
      else if (budgetDiff(trip.budget, myTrip.budget) === 1) score += 5;

      // 6. Shared interest tags (0–5 pts)
      const sharedInterests = intersect(myUser.interestTags, otherUser.interestTags);
      score += Math.min(sharedInterests.length, 5);

      return { trip, user: otherUser, compatibilityScore: Math.round(score) };
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
});
```

### Step 4.2 — Discover Page (`/app/discover`)

**Toggle between two modes** (top-right toggle button):

#### 🃏 Card Swipe Mode (Default)

- Stack of 3 cards visible — top card is interactive, others peek behind with scale transform
- **Drag mechanics** (Framer Motion):
  - Drag left → red tint overlay + ✕ icon → PASS
  - Drag right → green tint overlay + ♥ icon → LIKE
  - Velocity threshold: throw card off screen if fast enough
  - Keyboard: `←` / `→` arrow keys also work
- **Card content**:
  - Full-height avatar photo
  - Bottom gradient overlay with name, age, city
  - Expandable detail panel: trip info, compatibility %, shared interests chips
  - **Animated arc gauge** showing compatibility % (SVG circle stroke animation)
- **Like action** → Convex mutation `likeUser` → check for mutual like
- **Match detection**: If both users liked each other → trigger Match Overlay

#### Match Overlay (Full-Screen Modal)
- Both avatar photos slide in from left/right and "click" together with a particle burst
- Background: dark with golden sparkle particles
- Text: *"It's a Match! 🎉"* (gold gradient text, bounce-in animation)
- Subtext: *"You and [Name] both want to explore [Destination]!"*
- Buttons: **Start Chatting** (teal) + **Keep Exploring** (ghost)
- Convex mutation: `createMatch` → writes to `matches` table

#### 📋 List Browse Mode

- Vertical feed of condensed profile cards
- **Filter sidebar** (collapsible on mobile):
  - Destination text search
  - Date range filter
  - Budget filter (checkboxes)
  - Language filter (multi-select)
  - Travel style filter
- **Sort**: Best Match / Newest / Soonest Trip
- Each card: avatar, name, destination, dates, compatibility %, Like button

### Step 4.3 — Real-time Match Notifications

- `useQuery(api.matches.getMyMatches)` — Convex subscription auto-updates
- New match → toast notification + bell badge increment + notification stored in DB

**✅ Phase 4 Done When**: Swipe UI works, scoring algorithm runs, matches are created in Convex on mutual like, match overlay fires.

---

## Phase 5 — Chat & Matches (Weeks 7–8)

**Goal**: Real-time chat built entirely on Convex subscriptions — no third-party chat SDK needed.

### Step 5.1 — Matches Page (`/app/matches`)

**Two-column layout** (desktop: sidebar + chat panel; mobile: full-screen each)

**Left sidebar — Match List**:
- Avatar pair (both users' photos overlapping, like iMessage group icon)
- Match name + shared destination + flag
- Last message preview (truncated to 1 line)
- Timestamp (relative: "just now", "2h ago", "Yesterday")
- Unread message count badge (teal pill)
- Online indicator dot (green)
- Sorted by: most recent message first

**Active match** → teal left border + subtle background glow

### Step 5.2 — Chat Panel (`/app/chat/:matchId`)

**Built on Convex real-time**:

```ts
// convex/messages.ts

export const sendMessage = mutation(async ({ db, auth }, { matchId, text, imageUrl? }) => {
  const user = await getCurrentUser(auth, db);
  await db.insert("messages", {
    matchId, senderId: user._id,
    text, imageUrl,
    isRead: false, createdAt: Date.now()
  });
  // Mark other person's messages as read
  await markAsRead(db, matchId, user._id);
});

export const getMessages = query(async ({ db }, { matchId }) => {
  return db.query("messages")
    .withIndex("by_match", q => q.eq("matchId", matchId))
    .order("asc")
    .collect();
});
```

**Chat UI Features**:
- Message bubbles: **Sent** (teal gradient, right-aligned) / **Received** (glass card, left-aligned)
- Day separator labels: *"Today"*, *"Yesterday"*, *"Feb 25"*
- Timestamps on each message (shown on hover)
- Read receipts: single tick (sent) → double tick (delivered) → teal double tick (read)
- **Typing indicator**: animated 3-dot bounce when other user is typing
- **Emoji reactions**: long-press message → emoji picker appears, reaction shows below bubble
- **Image sharing**: click attachment icon → upload to Convex file storage → renders inline
- **Trip Pin card** at top of chat: *"📍 Traveling to Bali, March 5–15"* — expandable
- **Export to PDF** (jsPDF): download full chat history
- **Message search**: magnify icon opens search bar, highlights matches
- Input: text field + emoji button + attachment button + send button (teal, arrow icon)
- Press Enter to send, Shift+Enter for new line

### Step 5.3 — Notifications System

**Convex subscription** on `notifications` table for current user:

| Event | Toast Message |
|---|---|
| New match | *"🎉 You matched with Aria for Tokyo!"* |
| New chat message | *"💬 Aria: Can't wait for Bali!"* |
| Someone liked your trip | *"❤️ Marco liked your trip to Rome"* |

- Bell icon in sidebar shows unread count badge
- Notification drawer (slide-out from right): list of all notifications, click to navigate
- Clicking a notification → marks as read + navigates to relevant page

**✅ Phase 5 Done When**: Real-time chat works between two users, notifications fire, matches sidebar shows live data.

---

## Phase 6 — Polish & Production (Weeks 9–10)

### Step 6.1 — Profile Page (`/app/profile`)

**Layout**:
- **Cover banner**: gradient mesh background or user-uploaded cover photo
- **Floating avatar card**: avatar, name, age, traveler type badge, joined date
- **Edit Profile** button (top right)

**Sections**:
1. **WanderMate Card** — Animated card preview (how others see you); shareable
2. **Personal Details** — Inline editable fields (click field → becomes input → save)
3. **Travel Stats** — Animated count-up numbers: Trips posted / Matches made / Countries
4. **My Interests** — Colourful pill badges
5. **My Trips Timeline** — Horizontal scrollable row of trip cards (Planning / Active / Completed tabs)
6. **Settings** (gear icon drawer):
   - Notification preferences toggles
   - Profile visibility (Public / Matches Only / Private)
   - Account deletion (red, confirmation modal)

### Step 6.2 — Edit Profile (`/app/profile/edit`)

Same fields as onboarding wizard but in a single long-scroll form, pre-filled with existing data. Save button sticks to bottom (sticky footer).

### Step 6.3 — Performance Optimizations
- Lazy load all page components with `React.lazy` + `Suspense`
- Image optimization: serve from Convex file storage with size parameters
- Debounce all search/filter inputs
- Virtualize long message lists (react-window or similar)

### Step 6.4 — SEO & Meta Tags
- Add `react-helmet-async`
- Unique title + description per page
- Open Graph tags for profile/trip sharing

### Step 6.5 — Deployment
- **Frontend**: Deploy to [Vercel](https://vercel.com) — connect GitHub, auto-deploys on push
- **Backend**: Convex auto-deploys when you push; run `npx convex deploy` for production
- Set environment variables in Vercel dashboard: `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_CONVEX_URL`

---

## 13. Suggested Feature Improvements

| Feature | Description | Priority |
|---|---|---|
| **Vibe Check Quiz** | 5 quick personality questions after onboarding → assigns a traveler archetype shown on profile: *The Adventurer 🧗*, *The Foodie 🍜*, *The Photographer 📷*, *The Socialite 🎉*, *The Historian 📚* | 🔴 High |
| **Trip Board** | A public feed of all open trips — browse like a bulletin board without swiping. Filter by destination, date, budget. Great for users who aren't in "swipe mode". | 🔴 High |
| **Compatibility Breakdown** | On each profile/swipe card, show WHY they're a good match: "You both speak French", "Same travel style", "Overlapping dates" — with coloured tags for each reason | 🔴 High |
| **Group Trips** | Allow 3–5 people to all join the same trip group — multi-person matching | 🟠 Medium |
| **AI Trip Suggestions** | After posting a trip, use an AI endpoint to suggest: best time to visit, packing list essentials, must-see places, hidden gems | 🟠 Medium |
| **Verified Badge** | Email/phone verification → shows ✅ badge on profile for trust/safety | 🟠 Medium |
| **Wishlist / Dream Destinations** | Save destinations without a fixed date → used for future matching and notification when others post trips there | 🟠 Medium |
| **Safety Features** | Report user, block user, profile visibility controls, "Safe word" trip cancellation with no-questions-asked anonymous exit | 🟠 Medium |
| **Shareable WanderMate Card** | Generate a beautiful shareable image card of your profile (canvas API or html2canvas) — share on Instagram/Twitter to attract travel mates | 🟡 Low |
| **Destination Reviews** | After a trip is marked "Completed", prompt user to leave a short review of the destination | 🟡 Low |
| **Travel Buddy Rating** | After a matched trip completes, users can rate each other as travel companions (1–5 stars, private — used to improve match quality) | 🟡 Low |
| **In-App Map** | Interactive world map on the profile page showing all visited destinations + wishlist pins | 🟡 Low |

---

## 14. Timeline Summary

| Week | Phase | Milestone |
|---|---|---|
| Week 1 | Phase 1 | Vite + Convex + Clerk wired, design system, shell layout |
| Week 2 | Phase 2 | Landing page complete |
| Week 3 | Phase 2 | Onboarding wizard complete, user created in Convex |
| Week 4 | Phase 3 | Trip CRUD complete, forms + cards polished |
| Week 5 | Phase 4 | Matching algorithm in Convex, Discover page (list mode) |
| Week 6 | Phase 4 | Swipe card UI, Match overlay, mutual like detection |
| Week 7 | Phase 5 | Real-time chat built on Convex |
| Week 8 | Phase 5 | Matches sidebar, notifications, read receipts |
| Week 9 | Phase 6 | Profile page, edit profile, stats |
| Week 10 | Phase 6 | Polish, performance, extra features, production deploy |

---

## 15. Final Dependency List

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "convex": "latest",
    "@clerk/clerk-react": "latest",
    "framer-motion": "^11.0.0",
    "lucide-react": "latest",
    "sonner": "latest",
    "jspdf": "^3.0.0",
    "date-fns": "latest",
    "clsx": "latest"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "@vitejs/plugin-react": "latest",
    "eslint": "latest"
  }
}
```

---

*"The world is better with a mate."* 🌍

> **Next Step**: Start with Phase 1 — run `npm create vite@latest`, install dependencies, set up Clerk + Convex, and build the shell layout with the design token system.
