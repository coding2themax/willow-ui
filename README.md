# Willow

A real estate listing microsite built with React, TypeScript, and Vite. Features a public-facing property page and a lightweight admin dashboard.

## Pages

**Listing** (`/`) — the buyer-facing page:
- Parallax hero with layered scroll effect
- Key property stats bar
- About / description section
- Photo gallery with lightbox
- Video section
- Inquiry / contact form
- Fade-up scroll animations via IntersectionObserver

**Admin** (`/admin`) — internal dashboard:
- Inquiries tab — view and manage form submissions (persisted in localStorage)
- Appointments tab — view scheduled showings derived from inquiries
- Gallery tab — manage listing photos
- Analytics tab — inquiry volume and status breakdown

## Tech Stack

| Tool | Version |
|---|---|
| React | 18 |
| TypeScript | 6 |
| React Router | 6 |
| Vite | 5 |
| Package manager | pnpm |

## Getting Started

```bash
pnpm install
pnpm dev        # starts dev server at http://localhost:5173
```

```bash
pnpm build      # production build → dist/
pnpm preview    # preview the production build locally
```

## Project Structure

```
src/
  pages/
    Listing.tsx       # public listing page
    Admin.tsx         # admin dashboard shell
  components/
    Hero.tsx          # parallax hero section
    GallerySection.tsx
    Lightbox.tsx
    InquirySection.tsx
    admin/            # admin tab components
  index.css
public/
  parallax/           # layered parallax images
  uploads/            # listing photos
```
