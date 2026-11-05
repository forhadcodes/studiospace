# StudioSpace

**Live Site:** https://your-studiospace-live-url.vercel.app
**Client Repo:** https://github.com/your-username/studiospace-client
**Server Repo:** https://github.com/your-username/studiospace-server

StudioSpace is a peer-to-peer marketplace for creators, filmmakers, photographers, podcasters, and musicians. Studio owners list their creative spaces, from photography cyc walls and sound stages to podcast lounges and recording suites, and creators discover, filter, and book them with transparent pricing and real-time booking management.

---

## Key Features

- **Dynamic Home Page:** a Swiper hero slider with three slides, six featured studios fetched from MongoDB, category cards that open `/studios` with the category pre-selected, a "How Booking Works" section, and a Host Guarantee section.
- **Explore and Filter Studios:** a grid of all studios with category, price range, and sort filters, plus friendly empty states when no results match.
- **Full Studio CRUD:** add, view, update, and delete studio listings through private routes, with image upload, amenity tags, and confirmation modals before deletion.
- **Booking System:** reserve studio slots with a status flow of Pending, Confirmed, Completed, and Cancelled, and cancel pending bookings from My Bookings.
- **Double-Booking Prevention:** the server checks time overlap against existing Confirmed bookings and rejects collisions with a clear error message.
- **Secure Authentication:** BetterAuth with email/password and Google login, JWT stored in HTTPOnly cookies, and protected server mutations that return `401 Unauthorized` when unauthenticated.
- **Light and Dark Theme:** a toggle that switches the whole interface between themes.
- **Modern Feedback UI:** toast notifications for all auth, CRUD, and booking actions, custom modal dialogs, and branded skeleton loaders.
- **Responsive Design:** works across mobile, tablet, and desktop, with a custom 404 page.
- **Optional extras:** PDF booking invoice for confirmed bookings and a saved-studios wishlist.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js (App Router), React, Tailwind CSS v4, shadcn/base-nova UI (Base UI), TypeScript |
| Authentication | BetterAuth + MongoDB Adapter, JWT (HTTPOnly cookie) |
| Backend | Next.js API Routes (Node.js runtime) |
| Database | MongoDB (Atlas) |
| Other | Swiper.js (hero slider), embla-carousel-react (studio gallery), Sonner (toasts) |
| Deployment | Vercel (single full-stack deployment) |

---

## Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Home page |
| `/studio-explore` | Public→ | Explore all studios (with category/price filters) |
| `/studio-explore/[id]` | Public→ | Studio details: gallery carousel, amenities, host, booking modal |
| `/studio-explore/edit/[id]` | Private | Update a studio (owner only) |
| `/signup`, `/login` | Public | Authentication |
| `/add-studio` | Private | Add a new studio |
| `/my-listings` | Private | Manage your own listings |
| `/my-booking` | Private | View and cancel bookings |
| `/profile` | Private | Your dashboard |

> This project is a single full-stack Next.js app: the client and the API
> (`/api/*`) live in one repository, deployed together.

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/studiospace.git
cd studiospace
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in the values (never commit the real
`.env`):

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000
DEMO_HOST_EMAIL=you@example.com
```

### 4. Start the app

```bash
# dev server (client + API routes)
npm run dev

# production
npm run build && npm start
```

Optionally seed demo studios:

```bash
npm run seed
```

Open http://localhost:3000 in your browser.

---

## Examiner Test Credentials

> The heading above the seeded demo listings is `examiner@studiospace.dev`
> — log in with any account you register to test booking and hosting flows,
> or create an examiner account on the live site with that mindset.

---

## Project Structure

```
src/app/            Next.js App Router (pages + /api routes)
src/components/     UI components (shadcn/base-nova + app components)
src/lib/            Auth, bookings, studios helpers and constants
scripts/seed.ts     Demo data seeder (npm run seed)
```

---

## Author

Assignment B14-A8-Cat_Harry, StudioSpace.
