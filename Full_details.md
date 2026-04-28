# ChainGuard — Full Application Details

> **Smart Supply Chain Disruption Detection & Dynamic Route Optimization Platform**
> Built for the Google Solution Challenge

---

## 1. Project Overview

ChainGuard is a real-time supply chain management platform that monitors global shipments, detects disruptions (weather, port congestion, carrier delays, geopolitical events), calculates risk scores, and recommends optimized alternative routes. It serves as a **Control Tower** for logistics operations managers.

### Core Problem Solved
Global supply chains face unpredictable disruptions causing delays, financial losses, and SLA breaches. ChainGuard provides:
- **Real-time visibility** into all active shipments on a global map
- **Automated risk scoring** using weighted multi-factor analysis
- **Proactive alert generation** when risk levels escalate
- **Dynamic route optimization** with cost/time/reliability trade-offs
- **Cascading impact simulation** to quantify financial exposure

---

## 2. Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.2.4 | React framework (App Router, SSR, API Routes) |
| **React** | 19.2.4 | UI library |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | ^4 | Utility-first styling |
| **shadcn/ui** | ^4.5.0 | Pre-built UI components (Card, Button, Table, Dialog, Badge, etc.) |
| **Lucide React** | ^1.11.0 | Icon library |
| **Recharts** | ^3.8.1 | Data visualization (bar charts) |
| **Leaflet + React-Leaflet** | 1.9.4 / 5.0.0 | Interactive maps |
| **SWR** | ^2.4.1 | Data fetching with auto-revalidation & polling |
| **Zustand** | ^5.0.12 | Lightweight client-side state management |
| **Sonner** | ^2.0.7 | Toast notifications |
| **tw-animate-css** | ^1.4.0 | Tailwind animation utilities |

### Backend
| Technology | Purpose |
|---|---|
| **Next.js API Routes** | RESTful API endpoints (server-side) |
| **Prisma ORM** | ^5.22.0 — Database ORM with type-safe queries |
| **SQLite** | Lightweight file-based database |
| **NextAuth.js** | ^4.24.14 — Authentication (Credentials provider, JWT sessions) |
| **bcryptjs** | ^3.0.3 — Password hashing (available, demo uses plain check) |

### Dev Tools
| Tool | Purpose |
|---|---|
| **ESLint** | Code linting |
| **tsx** | TypeScript execution for seed scripts |
| **PostCSS** | CSS processing pipeline |

---

## 3. Architecture

```
chainguard/
├── app/                        # Next.js App Router
│   ├── (auth)/login/           # Login page (public)
│   ├── dashboard/              # Control Tower dashboard
│   │   └── _components/
│   │       ├── ShipmentMap.tsx  # Interactive Leaflet world map
│   │       ├── LiveFeed.tsx    # Real-time alert stream sidebar
│   │       ├── DisruptionBanner.tsx # Critical alert top banner
│   │       └── KpiBar.tsx      # ★ KPI summary cards (4 metrics above map)
│   ├── shipments/              # Shipment list + detail pages
│   │   ├── [id]/               # Dynamic shipment detail
│   │   │   └── _components/    # RiskScoreCard, RouteOptions, ImpactSimulator
│   │   └── page.tsx            # Shipment table with search + ★ filter chips + ★ progress column
│   ├── alerts/                 # Alert queue management
│   │   └── _components/        # AlertQueue (resolve/dismiss)
│   ├── analytics/              # Analytics dashboard
│   ├── api/                    # REST API endpoints (Serverless Safe)
│   │   ├── auth/[...nextauth]/ # Authentication
│   │   ├── shipments/          # CRUD shipments (via Mock DB)
│   │   ├── alerts/             # CRUD alerts (via Mock DB)
│   │   ├── analytics/          # Carrier stats & disruptions (via Mock DB)
│   │   ├── routes/recommend/   # Route generation & acceptance (via Mock DB)
│   │   └── simulate/tick/      # Simulation engine trigger
│   ├── layout.tsx              # Root layout (Navbar + Sidebar + Providers)
│   └── globals.css             # Design tokens & theme
├── components/                 # Shared components
│   ├── Navbar.tsx              # Top navigation bar with alerts & profile
│   ├── Sidebar.tsx             # Left sidebar navigation (includes Profile link)
│   ├── RiskBadge.tsx           # Color-coded risk level badge
│   ├── ShipmentCard.tsx        # Shipment summary card (★ with progress bar)
│   ├── ShipmentProgress.tsx    # ★ Reusable journey progress bar (full & compact modes)
│   ├── Providers.tsx           # NextAuth SessionProvider wrapper
│   └── ui/                     # 14 shadcn/ui primitives
├── hooks/                      # Custom React hooks
│   ├── useShipments.ts         # SWR hook for shipments (8s polling)
│   └── useAlerts.ts            # SWR hook for alerts (5s polling)
├── lib/                        # Core business logic
│   ├── prisma.ts               # ★ Mock In-Memory Database (Vercel Ready)
│   ├── risk-engine.ts          # Multi-factor risk scoring algorithm
│   ├── route-optimizer.ts      # Alternative route generation
│   ├── simulation.ts           # Live simulation tick engine
│   └── utils.ts                # Helpers (cn, formatCurrency, formatRelativeTime)
├── store/                      # Zustand state stores
│   └── shipments.ts            # Selected shipment & filter state
└── middleware.ts               # Auth middleware (protects all routes)
```

> ★ marks files added or significantly updated in the latest iteration.

---

## 4. Data Management (Mock DB)

To ensure **Zero-Config Deployment** and compatibility with Vercel's serverless architecture, ChainGuard uses a custom in-memory data store implemented in `lib/prisma.ts`.

### Architecture
- **In-Memory Store**: Data is stored in a global singleton object that persists across serverless function "warm starts".
- **Deterministic Seeding**: The store automatically seeds itself with 25 shipments, users, and alerts upon the first request.
- **Prisma-Compatible API**: The mock DB implements `findMany`, `findUnique`, `update`, `create`, and `count` methods, allowing the application logic to remain unchanged while eliminating the need for a separate database server.

---

## 5. Features (Page by Page)

### 5.1 Login Page (`/login`)
- Credential-based authentication via NextAuth.js
- Demo credentials pre-filled: `ops@chainguard.demo` / `demo1234`
- JWT session strategy
- Protected routes via middleware (dashboard, shipments, alerts, analytics)
- 3 demo users: Alex Ops (ops_manager), Sarah Chief (csco), Mike Logistics (logistics_coordinator)

### 5.2 Dashboard — Control Tower (`/dashboard`)
- **★ KPI Summary Bar** (4 metric cards above the map)
  - **Total Shipments** — count of non-delivered shipments (blue accent)
  - **Critical Shipments** — count with riskScore=critical (red accent, pulse animation when > 0)
  - **Open Alerts** — count of open alerts (amber accent)
  - **On-Time Rate** — average onTimeRate across all carriers for last 30 days (green accent)
  - Skeleton loading placeholders while data loads; "—" on fetch failure
  - Auto-refreshes every 8 seconds via SWR polling
  - Responsive: 4-col desktop → 2×2 tablet → 1-col mobile
- **Interactive World Map** (Leaflet + CARTO dark tiles)
  - Color-coded shipment markers: 🔴 Critical, 🟡 Medium, 🟢 Low
  - Click any marker → navigates to shipment detail
  - Popup shows tracking number, route, carrier, risk badge
- **Live Feed Sidebar** (right panel)
  - Real-time alert stream with type-specific icons (weather, carrier delay, port congestion, geopolitical)
  - Each alert links to its shipment
  - Relative timestamps ("2 minutes ago")
- **Disruption Banner** (top)
  - Appears when critical alerts exist
  - Pulsing ⚠️ icon with count of affected shipments
  - Links to filtered alert view
- **Simulation Engine** (background)
  - Ticks every 10 seconds via `POST /api/simulate/tick`
  - Moves shipments toward destination (5% per tick)
  - Recalculates risk scores
  - Auto-generates alerts when risk escalates
  - Creates disruption signals randomly
  - Alert cap at 30 open alerts to prevent accumulation

### 5.3 Shipments List (`/shipments`)
- **★ Filter Chips Bar** (between header and table)
  - 7 chips: `All` | `🔴 Critical` | `🟡 Medium` | `🟢 Low` | `In Transit` | `Delayed` | `At Risk`
  - Single-select toggle: clicking active chip deselects it (returns to All)
  - Risk chips have colored dots; active chip gets semantic background color
  - Status chips get indigo background when active
  - Client-side filtering — no extra API calls
  - Works together with text search (search within filtered set)
  - Dynamic result label: e.g. "Showing 4 critical shipments" in filter color
- **Searchable data table** with columns: Tracking #, Route, **★ Progress**, Carrier, Status, Risk Score, ETA
- **★ Progress column** — compact progress bar per shipment with tooltip showing exact percentage
- Search filters by tracking number, origin, or destination
- Click any row → navigates to shipment detail
- Risk badges with color coding and pulse animation for critical
- Status badges (in transit, delayed, at risk)
- Auto-refreshes every 8 seconds via SWR polling

### 5.4 Shipment Detail (`/shipments/[id]`)
- **Header**: Tracking number, risk badge, status badge, route, carrier, ETA, cargo value
- **★ Journey Progress Bar** (in header, below tracking number)
  - Full-width progress bar showing origin → current → destination
  - Euclidean distance calculation, clamped 0–100%
  - Color-coded fill: green (<35%) → amber (<70%) → blue (≥70%)
  - White dot position indicator with smooth 0.6s CSS transition
  - City name labels on left/right with bold center percentage
  - Forces 100% when status is "delivered"
- **Dynamic Route Optimization Panel**:
  - Displays 3 alternative routes: Fastest, Balanced, Cheapest
  - Each shows: carrier, estimated days, cost delta, reliability score (%)
  - Accept or dismiss each route option
  - "Generate Routes" button if none exist
  - Accepted route shown with green confirmation
- **Risk Analysis Card**:
  - 4-factor breakdown: Weather Risk, Carrier History, Port Congestion, Deadline Risk
  - Each shown as percentage
  - Overall risk badge
- **Cascading Impact Simulator** (for critical/medium shipments):
  - Orders at risk count
  - Estimated delay (days)
  - Customers affected (listed)
  - Financial exposure calculation (0.5% penalty/day × cargo value × delay days)

### 5.5 Alert Queue (`/alerts`)
- Lists all alerts with severity indicators (critical = red, medium = amber)
- Each alert shows: title, severity badge, description, timestamp, link to shipment
- **Action buttons** per alert:
  - ✅ **Resolve** — marks as resolved with timestamp
  - ❌ **Dismiss** — marks as dismissed
- Resolved/dismissed alerts shown with reduced opacity
- Toast notifications on actions

### 5.6 Analytics Dashboard (`/analytics`)
- **Carrier Reliability Scorecard**:
  - Bar chart (Recharts) showing reliability scores for 6 carriers
  - Color-coded bars: green (>85%), amber (75-85%), red (<75%)
  - Period filter: 7d / 30d / 90d
  - Tooltip with exact percentage
- **Global Disruption Heatmap**:
  - Leaflet map with circle markers for disruption signals
  - Size indicates severity (high = larger radius)
  - Color indicates severity: red (high), amber (medium), blue (low)
  - Popup shows source, description, severity

### 5.7 Profile Page (`/profile`)
- **Admin profile card**: Avatar (gradient), name (Alex Ops), role (Ops Manager), online status
- **4 Clickable stat cards**:
  - Active Shipments → expandable list of all shipments with tracking #, route, carrier, status, risk, ETA
  - Critical Alerts → filtered list of critical alerts with severity dots, descriptions
  - Open Alerts → all open alerts
  - Resolved Today → resolved alerts with green badges
  - Each item in the list is clickable → navigates to shipment detail
  - Toggle open/close by clicking cards
- **Account Details**: Name, email, role, organization, region
- **Activity & Preferences**: Last login, notifications, theme, timezone, alert digest
- **Recent Activity**: Timeline of recent actions

---

## 6. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/shipments` | List shipments (filters: status, riskScore, carrier) |
| GET | `/api/shipments/[id]` | Single shipment with orders, alerts, routeOptions |
| GET | `/api/alerts` | List alerts (filters: status, severity, shipmentId) |
| PATCH | `/api/alerts/[id]` | Update alert status (resolved/dismissed) |
| GET | `/api/analytics/carriers` | Carrier stats (filter: period) |
| GET | `/api/analytics/disruptions` | Active disruption signals |
| POST | `/api/routes/recommend` | Generate 3 route alternatives for a shipment |
| PATCH | `/api/routes/recommend` | Accept/dismiss a route option |
| POST | `/api/simulate/tick` | Run one simulation tick |
| POST/GET | `/api/auth/[...nextauth]` | NextAuth authentication |

---

## 7. Core Business Logic

### 7.1 Risk Scoring Engine (`lib/risk-engine.ts`)
Weighted multi-factor risk calculation:
| Factor | Weight |
|---|---|
| Weather Severity | 30% |
| Carrier Delay History | 25% |
| Port Congestion | 20% |
| Deadline Proximity | 25% |

**Thresholds**: rawScore ≥ 0.65 → `critical`, ≥ 0.35 → `medium`, else → `low`

### 7.2 Route Optimizer (`lib/route-optimizer.ts`)
Generates 3 alternative routes per shipment:
- **Route A (Fastest)**: 2-4 days, +$1000-2000, 92-99% reliability
- **Route B (Balanced)**: 4-7 days, +$200-800, 85-95% reliability
- **Route C (Cheapest)**: 8-12 days, -$500-1000, 70-85% reliability

### 7.3 Simulation Engine (`lib/simulation.ts`)
Each tick performs:
1. **Move shipments** — nudges 3-5 random shipments 5% toward destination
2. **Recalculate risk** — runs risk engine on all active shipments
3. **Generate alerts** — creates alerts when risk crosses thresholds (cap: 30 open)
4. **Generate routes** — auto-generates route options for newly critical shipments
5. **Create disruptions** — randomly spawns disruption signals (cap: 20 active)
6. **Expire disruptions** — deactivates signals older than 1 hour

---

## 8. Authentication & Authorization

- **Provider**: NextAuth.js with Credentials provider
- **Session**: JWT strategy (no database sessions)
- **Middleware**: Protects `/dashboard/*`, `/shipments/*`, `/alerts/*`, `/analytics/*`
- **Login**: Email + password (`demo1234` for all demo users)
- **Roles**: `ops_manager`, `logistics_coordinator`, `csco` (stored in JWT token)
- **Session callbacks**: Role injected into JWT token and session object

### Demo Users
| Name | Email | Role |
|---|---|---|
| Alex Ops | ops@chainguard.demo | ops_manager |
| Sarah Chief | csco@chainguard.demo | csco |
| Mike Logistics | logistics@chainguard.demo | logistics_coordinator |

---

## 9. Deployment (Vercel Ready)

The project is optimized for a **single-click deployment** on Vercel.

### Key Optimizations
1. **No External DB Required**: Uses an in-memory mock DB for instant accessibility.
2. **Deterministic Builds**: Resolved all TypeScript and dependency conflicts.
3. **Serverless Safe**: API routes are stateless and optimized for fast cold starts.

### Deployment Guide
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Optimize for Vercel deployment"
   git push origin main
   ```
2. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new).
   - Import your GitHub repository.
   - Set `NEXTAUTH_SECRET` in Environment Variables (any random string).
   - Click **Deploy**.

---

## 10. How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
# App runs at http://localhost:3000

---

## 15. Changelog

### v0.3.0 — Vercel Deployment Optimization (April 27, 2026)

**Optimizations**
- **Refactored Data Layer**: Replaced Prisma/SQLite with a custom in-memory `MockDB` in `lib/prisma.ts`.
- **Zero-Config Build**: Removed database migration steps from the build process.
- **Dependency Cleanup**: Removed `prisma` and `@prisma/client` to reduce bundle size and build time.
- **Deployment Stability**: Added null checks in API routes and resolved TypeScript errors for a guaranteed successful `npm run build`.

### v0.2.0 — UI Feature Update (April 27, 2026)

**Feature 1 — KPI Summary Bar on Dashboard**
- New file: `app/dashboard/_components/KpiBar.tsx`
- Modified: `app/dashboard/page.tsx` (added KpiBar import + placement above map)
- 4 cards fetching from existing APIs with `refreshInterval: 8000`
- Skeleton loading states, "—" on error, pulse animation on critical count

**Feature 2 — Shipment Journey Progress Bar**
- New file: `components/ShipmentProgress.tsx` (reusable, full + compact modes)
- Modified: `components/ShipmentCard.tsx` (added progress bar + expanded interface for coordinates)
- Modified: `app/shipments/[id]/page.tsx` (progress bar in detail header)
- Modified: `app/shipments/page.tsx` (compact progress bar column in table with tooltip)
- Euclidean distance calculation, color-coded fill, animated dot indicator

**Feature 3 — Filter Chips on Shipments List**
- Modified: `app/shipments/page.tsx`
- 7 filter chips: All, Critical, Medium, Low, In Transit, Delayed, At Risk
- Single-select toggle, semantic colors, client-side filtering
- Combined search + chip filtering, dynamic colored result count label

**Bug Fixes & Tweaks**
- Fixed `asChild` prop warning on Tooltip (Base UI does not use Radix's `asChild`)
- Fixed Navbar profile section always visible with fallback user data
- Added Profile link to Sidebar navigation
- Disabled Next.js development overlay ("N" symbol) via `next.config.ts` and `globals.css` for a cleaner demo experience

---

*Last updated: April 27, 2026 — v0.2.0*
