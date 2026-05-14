# ShopEase AI E-Commerce

> A modern e-commerce platform built with Next.js frontend, Express + Prisma backend, and AI-powered shopping features.

## 1. Live Project

- Frontend Live URL: `https://your-frontend-url.vercel.app`
- Backend Live URL: `https://your-backend-url.up.railway.app`
- GitHub Repository: `https://github.com/<your-username>/<your-repo>`

> Replace the placeholder URLs above with your actual deployment links after you publish the app.

## 2. Demo Credentials

### Customer / Buyer
- Email: `demo.user@shopease.com`
- Password: `Demo@1234`

### Admin / Manager
- Email: `admin@shopease.com`
- Password: `Admin@1234`

> If the demo accounts are not available in your database, create them through the registration endpoint or database seed script.

## 3. Project Overview

ShopEase AI is a full-stack e-commerce application that combines an interactive customer shopping experience with AI-driven product discovery, styling support, and administration insights.

The platform supports:
- product browsing and search
- customer cart and order flow
- vendor/admin product management
- blog and FAQ content
- wishlist, notification, and review systems
- AI-powered features for search, styling, support, and content generation

## 4. Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- React Query
- Zustand
- Recharts
- Leaflet

### Backend
- Node.js + Express 5
- TypeScript
- Prisma ORM
- PostgreSQL
- OpenRouter AI integration
- JWT authentication
- Zod validation
- Winston logging

### AI Layer
- OpenRouter / OpenAI-compatible LLM integration
- AI search intent parsing
- AI stylist recommendation engine
- AI review summarization
- AI-powered product description generation
- Context-aware chat support

## 5. AI Features Explanation

### Smart Search
The frontend sends natural language queries to `/api/ai/search`, where the server uses AI to extract structured search filters such as category, price range, color, and style.

### Personal Stylist
Users can get tailored style suggestions for products using `/api/ai/stylist`. The AI evaluates product metadata and returns complementary recommendations.

### Review Summary
The backend summarizes product reviews through `/api/ai/reviews/:productId/summary`, creating a short sentiment summary and buying guidance.

### Chat Support
A chatbot endpoint at `/api/ai/chat` can respond to customer queries with context-aware answers based on shop info and conversation history.

### AI Product Descriptions
Admin or vendor users can generate SEO-friendly product descriptions with `/api/ai/generate-description`.

## 6. Setup Instructions

### Prerequisites
- Node.js 20+ installed
- PostgreSQL database
- OpenRouter API key or another compatible LLM provider key
- Git client

### Clone repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd E-commerse
```

### Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### Configure environment variables

Create `.env` files in both `client` and `server` directories.

#### `client/.env` example

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api
```

#### `server/.env` example

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/shopease
OPENROUTER_API_KEY=your_openrouter_api_key
FRONTEND_URL=http://localhost:3000
PORT=5000
```

### Run backend

```bash
cd server
npm run dev
```

### Run frontend

```bash
cd client
npm run dev
```

### Database setup

If you are using Prisma with PostgreSQL:

```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
```

## 7. Useful Commands

### Frontend
- `npm run dev` — start Next.js development server
- `npm run build` — build production frontend
- `npm run start` — start production frontend
- `npm run lint` — run ESLint

### Backend
- `npm run dev` — start Express backend in TypeScript mode
- `npm run build` — compile backend
- `npm run start` — start compiled backend
- `npm run postinstall` — run Prisma generate after install

## 8. Folder Structure

- `client/` — frontend Next.js application
- `server/` — backend Express + Prisma API
- `server/src/controllers` — API endpoint controllers
- `server/src/services` — business logic and AI integration
- `server/src/repositories` — Prisma data access layer
- `server/src/routes` — Express routes
- `server/prisma` — database schema and migrations

## 9. Notes

- AI functions require a valid `OPENROUTER_API_KEY` in the backend.
- For production deployments, update the frontend and backend URLs in `.env` files and CORS settings.
- Use secure passwords and rotate secrets before sharing the live project.
