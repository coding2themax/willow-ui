# Willow

A horse-selling microsite built with React, TypeScript, and Vite. Features a public-facing listing page and a lightweight admin dashboard.

## Pages

**Listing** (`/`) — the buyer-facing page:
- Parallax hero with layered scroll effect and optional SOLD banner
- Key horse stats bar
- About / description section
- Photo gallery with lightbox (photos served from API with static fallback)
- Video section
- Inquiry / contact form (posts to API)
- Fade-up scroll animations via IntersectionObserver

**Admin** (`/admin`) — internal dashboard (token-gated):
- Inquiries tab — view and manage form submissions via API
- Appointments tab — view and action scheduled viewings via API
- Gallery tab — upload, feature, and delete listing photos via API
- Analytics tab — inquiry volume and status breakdown via API

## Tech Stack

| Tool | Version |
|---|---|
| React | 18 |
| TypeScript | 6 |
| React Router | 6 |
| Vite | 5 |
| MSW | 2 (dev mocking) |
| ESLint | 9 |
| Package manager | npm |

## Getting Started

```bash
npm install
npm run dev        # starts dev server at http://localhost:8080 with MSW mocking enabled
```

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build locally
npm run typecheck  # TypeScript type-check (no emit)
npm run lint       # ESLint
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API (leave empty to use same origin) |
| `VITE_ADMIN_TOKEN` | Admin token for the `/admin` login gate |
| `VITE_SOLD` | Set to `"true"` to show the SOLD banner and disable the inquiry form |

### Local development without a real backend

In development mode (`npm run dev`), [Mock Service Worker](https://mswjs.io/) automatically intercepts all `/api/*` requests and returns realistic in-memory data. No backend is required.

The admin login gate accepts **any non-empty token** when `VITE_ADMIN_TOKEN` is not set. To test token validation locally, add `VITE_ADMIN_TOKEN=dev-token` to `.env.local`.

### Connecting to a real backend

Set `VITE_API_BASE_URL` to your API base URL in `.env.local`. All requests will be sent to `${VITE_API_BASE_URL}/api/...` with an `Authorization: Bearer <token>` header using the token stored in `sessionStorage` after login.

Expected API contract:

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/inquiries` | List all inquiries |
| `POST` | `/api/inquiries` | Create inquiry |
| `PATCH` | `/api/inquiries/:id/status` | Update inquiry status |
| `DELETE` | `/api/inquiries/:id` | Delete inquiry |
| `GET` | `/api/appointments` | List appointments |
| `POST` | `/api/appointments/:id/approve` | Approve appointment |
| `POST` | `/api/appointments/:id/decline` | Decline appointment |
| `GET` | `/api/gallery` | List photos |
| `POST` | `/api/gallery` | Upload photo (`multipart/form-data`) |
| `DELETE` | `/api/gallery/:id` | Delete photo |
| `POST` | `/api/gallery/:id/feature` | Feature photo |
| `GET` | `/api/analytics` | Analytics data |

## CI/CD

### CI (`.github/workflows/ci.yml`)

Runs on every push and pull request:
1. TypeScript type-check (`npm run typecheck`)
2. ESLint (`npm run lint`)
3. Production build (`npm run build`)
4. Dependency audit (`npm audit --audit-level=moderate`)
5. CodeQL security scan

### Deployment (`.github/workflows/deploy.yml`)

Runs on merge to `main`. Configure the following **GitHub repository secrets**:

| Secret | Description |
|---|---|
| `VITE_API_BASE_URL` | Production API base URL |
| `VITE_ADMIN_TOKEN` | Production admin token |

And the following **GitHub repository variable** (can be changed without a new deployment):

| Variable | Description |
|---|---|
| `VITE_SOLD` | Set to `true` to activate the SOLD banner |

The workflow supports three deployment targets — uncomment the one you want in `deploy.yml`:
- **GitHub Pages** (default, pre-configured)
- **Vercel** (requires `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets)
- **Netlify** (requires `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID` secrets)

## Project Structure

```
src/
  api/
    client.ts         # base fetch wrapper (auth headers, error handling)
    inquiries.ts      # inquiry API calls
    appointments.ts   # appointment API calls
    gallery.ts        # gallery API calls
    analytics.ts      # analytics API calls
  mocks/
    handlers.ts       # MSW request handlers (dev only)
    browser.ts        # MSW browser worker setup
  pages/
    Listing.tsx       # public listing page
    Admin.tsx         # admin dashboard shell (LoginGate wrapped)
  components/
    Hero.tsx          # parallax hero (SOLD banner support)
    GallerySection.tsx# photo gallery (API-driven with fallback)
    InquirySection.tsx# inquiry form (API-driven, SOLD-aware)
    ui/
      Spinner.tsx     # loading spinner
      ErrorBanner.tsx # inline error display
    admin/
      LoginGate.tsx   # token-based auth gate
      InquiriesTab.tsx
      AppointmentsTab.tsx
      GalleryTab.tsx
      AnalyticsTab.tsx
      types.ts
  index.css
public/
  mockServiceWorker.js  # MSW service worker (auto-generated)
  parallax/             # layered parallax images
  uploads/              # listing photos
.env.example            # environment variable documentation
.github/workflows/
  ci.yml                # CI pipeline
  deploy.yml            # deployment pipeline
```
