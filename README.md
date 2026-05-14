# ShopEase AI E-Commerce Frontend

A modern Next.js storefront for the ShopEase AI e-commerce platform. This frontend connects to the backend API and provides customer-facing shopping, search, checkout, and AI assistant experiences.

## Features

- Responsive shopping storefront with product browsing
- Smart search powered by AI intent parsing
- Wishlist, cart, and checkout flow
- Customer chat assistant for product support
- Admin dashboard components with AI market insights
- Interactive maps, charts, and analytics for dashboard users

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- Zustand
- React Query
- Recharts
- Leaflet

## Setup

### Install dependencies

```bash
cd client
npm install
```

### Environment

Create a `client/.env` file with:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api
```

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Build

```bash
npm run build
```

## Notes

- The frontend uses `NEXT_PUBLIC_API_URL` to connect with the backend API.
- If you deploy the backend separately, update `NEXT_PUBLIC_API_URL` to the deployed backend base URL.
- Frontend authentication is handled via stored bearer tokens in local storage.
- The AI assistant and search features depend on backend AI endpoints under `/api/ai`.
 
