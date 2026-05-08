# 🎬 TeluguVerse

> The ultimate Telugu entertainment database platform — movies, anime, web series, K-dramas, Hollywood, OTT content and more, with full Telugu language support.

![TeluguVerse](https://img.shields.io/badge/TeluguVerse-v2.0.0-FFD700?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)

---

## ✨ Features

- 🎬 **50,000+ Titles** — Movies, Anime, Series, K-Dramas, Cartoons, Hollywood, Documentaries
- ⚡ **Real-time Search** — Debounced search with suggestions, filters, and trending queries
- 🌐 **Telugu Language** — Full Telugu titles, descriptions, and UI toggle
- 📺 **OTT Integration** — Netflix, Prime, Hotstar, ZEE5, Crunchyroll, Viki and 300+ more
- 🎌 **Telugu Dub Tracking** — Know exactly what's available dubbed
- ⭐ **Ratings & Reviews** — Community ratings and Telugu reviews
- 📋 **Watchlist & Favorites** — Personal content management
- 🌌 **Universe Explorer** — MCU, DCEU, Rajamouli Universe timelines
- 📅 **Upcoming Countdown** — Live countdown to releases
- ⚙️ **Admin Dashboard** — Full content management panel
- 🔐 **JWT Authentication** — Secure login/register
- 📱 **PWA Support** — Installable on mobile devices
- 🌟 **Cinematic Dark UI** — Netflix-inspired glassmorphism design

---

## 🛠 Tech Stack

| Layer        | Technology                         |
|-------------|-------------------------------------|
| Frontend    | Next.js 14, React 18, TypeScript 5  |
| Styling     | Tailwind CSS, Framer Motion         |
| Backend     | Next.js API Routes (Node.js)        |
| Database    | PostgreSQL + Prisma ORM             |
| Auth        | JWT + bcryptjs                      |
| State       | Zustand (persisted)                 |
| Fonts       | Cinzel, Rajdhani, Noto Sans Telugu  |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone and install
```bash
git clone https://github.com/yourorg/teluguverse.git
cd teluguverse
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and set your `DATABASE_URL` and `JWT_SECRET`.

### 3. Database setup
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Start development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗂 Project Structure

```
teluguverse/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout with Navbar + Footer
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles + CSS variables
│   ├── admin/                  # Admin dashboard
│   ├── auth/                   # Login & Register
│   ├── content/[slug]/         # Content detail pages
│   ├── search/                 # Advanced search page
│   ├── upcoming/               # Upcoming releases
│   ├── watchlist/              # User watchlist
│   ├── user/[username]/        # User profiles
│   └── api/                    # API routes
│       ├── auth/               # login, register, logout, me
│       ├── content/            # CRUD + trending + featured
│       ├── search/             # search + suggestions + trending
│       ├── user/               # watchlist, favorites, rate, profile
│       ├── reviews/            # review CRUD
│       ├── genres/             # genres list
│       └── admin/              # admin stats, content, users
│
├── components/
│   ├── admin/                  # AdminDashboard
│   ├── content/                # ContentDetailPage (tabs, cast, episodes…)
│   ├── home/                   # HeroSection, TrendingSection, AnimeSection…
│   ├── layout/                 # Navbar, Footer
│   ├── search/                 # SearchModal
│   └── ui/                     # ContentCard, Badge, OttBadge, RatingStars…
│
├── lib/
│   ├── auth.ts                 # JWT sign/verify, middleware helpers
│   ├── constants.ts            # App-wide constants
│   ├── errors.ts               # Error handling utilities
│   ├── prisma.ts               # Prisma client singleton
│   └── utils.ts                # Utility functions
│
├── services/
│   ├── content.service.ts      # Content CRUD, search, trending
│   ├── search.service.ts       # Search with logging
│   └── user.service.ts         # User management
│
├── hooks/
│   └── useSearch.ts            # Debounced search hook
│
├── store/
│   └── useStore.ts             # Zustand global state
│
├── types/
│   └── index.ts                # TypeScript types
│
├── prisma/
│   ├── schema.prisma           # Complete DB schema
│   └── seed.ts                 # Database seeder
│
├── public/
│   └── manifest.json           # PWA manifest
│
├── middleware.ts               # Auth route protection
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

---

## 🌱 Default Admin Account
After seeding:
- **Email:** admin@teluguverse.com
- **Password:** admin123456

⚠️ Change these immediately in production!

---

## 📡 API Reference

| Method | Endpoint                        | Description              | Auth     |
|--------|--------------------------------|--------------------------|----------|
| GET    | /api/content                   | Search/list content      | Public   |
| GET    | /api/content/:slug             | Get content by slug      | Public   |
| GET    | /api/content/:slug/similar     | Similar content          | Public   |
| GET    | /api/content/:slug/reviews     | Get reviews              | Public   |
| POST   | /api/content/:slug/reviews     | Post a review            | Required |
| GET    | /api/content/trending          | Trending content         | Public   |
| GET    | /api/content/featured          | Featured content         | Public   |
| GET    | /api/content/upcoming          | Upcoming releases        | Public   |
| GET    | /api/search                    | Advanced search          | Public   |
| GET    | /api/search/suggestions        | Live search suggestions  | Public   |
| GET    | /api/search/trending           | Trending searches        | Public   |
| POST   | /api/auth/register             | Register user            | Public   |
| POST   | /api/auth/login                | Login user               | Public   |
| POST   | /api/auth/logout               | Logout                   | Required |
| GET    | /api/auth/me                   | Get current user         | Required |
| GET    | /api/user/profile              | Get user profile         | Required |
| PATCH  | /api/user/profile              | Update profile           | Required |
| GET    | /api/user/watchlist            | Get watchlist            | Required |
| POST   | /api/user/watchlist            | Add to watchlist         | Required |
| DELETE | /api/user/watchlist            | Remove from watchlist    | Required |
| POST   | /api/user/favorites            | Toggle favorite          | Required |
| POST   | /api/user/rate                 | Rate content             | Required |
| GET    | /api/genres                    | All genres               | Public   |
| GET    | /api/admin/stats               | Admin stats              | Admin    |
| GET    | /api/admin/content             | Admin content list       | Admin    |
| POST   | /api/admin/content             | Create content           | Admin    |
| GET    | /api/admin/users               | Admin users list         | Admin    |

---

## 🎨 UI Design System

- **Primary Font:** Cinzel (headings, titles)
- **Body Font:** Rajdhani (UI elements)
- **Telugu Font:** Noto Sans Telugu
- **Dark Theme:** `#070810` base
- **Gold Accent:** `#FFD700` / `#FFA500`
- **Crimson:** `#E50914`

---

## 📝 License

MIT © 2024 TeluguVerse
