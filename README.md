# WanderMate Client

React 19 + Vite frontend for WanderMate — Travel Companion Matching.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` in the client directory:

```
VITE_CLERK_PUBLISHABLE_KEY=your_key_here
VITE_CONVEX_URL=your_convex_url_here
```

Get these from:

- **Clerk**: https://dashboard.clerk.com
- **Convex**: https://dashboard.convex.dev

### 3. Initialize Convex

Run the Convex dev server (in a separate terminal):

```bash
npx convex dev
```

This will:

- Prompt you to log in to Convex
- Create a new Convex project if needed
- Generate `convex/_generated/` files
- Watch for changes and auto-deploy functions

### 4. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Project Structure

```
src/
├── components/       # React components
│   ├── ui/          # Reusable UI components (Button, Card, Input, etc.)
│   ├── layout/      # Shell layout (Sidebar, BottomNav)
│   └── shared/      # Shared components (TripCard, UserCard, etc.)
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and constants
├── styles/          # CSS (tokens, globals, components)
└── App.jsx          # Root component with routing & providers

convex/
├── schema.ts        # Database schema definitions
├── users.ts         # User-related functions
└── [other].ts       # More Convex functions
```

## Tech Stack

- **React 19** — UI framework
- **Vite** — Build tool
- **React Router v7** — Routing
- **Clerk** — Authentication
- **Convex** — Backend & database
- **Framer Motion** — Animations
- **Lucide React** — Icons
- **Sonner** — Toast notifications
- **date-fns** — Date utilities
- **clsx** — Class merging

## Available Scripts

- `npm run dev` — Start dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

## Phase 1 Checklist

- ✅ Vite + React 19 setup
- ✅ Folder structure created
- ✅ Design system (tokens.css + globals.css)
- ✅ UI component library (Button, Card, Input, Badge, Avatar)
- ✅ Shell layout (Sidebar + BottomNav)
- ✅ Basic routing with React Router
- ✅ Clerk provider wired up (needs config)
- ✅ Convex schema & initial functions
- ⏳ Clerk configuration (requires credentials)
- ⏳ Convex deployment (requires `npx convex dev`)
- ⏳ Protected route guards (using useAuth)

## Next Steps (Phase 2)

- Landing page with hero section & animations
- Onboarding wizard (7-step form)
- User profile completion flow
- Start building features
