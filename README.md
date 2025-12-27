# Billing Monorepo

A full-stack billing system built with NestJS (backend) and React (frontend) using a monorepo structure with pnpm workspaces.

## Project Structure

```
billing-monorepo/
├─ backend/      # NestJS API service
├─ frontend/     # React web application
├─ docs/         # Documentation
└─ .github/      # CI/CD workflows
```

## Features

- **Admin Configuration**: Set billing parameters (base rate, tax rate, discount)
- **Bill Calculator**: Users can calculate bills based on usage
- **REST API**: Fully documented with Swagger
- **Admin Guard**: Protected routes with admin key authentication
- **PDF Export**: Generate PDF invoices
- **React Query**: Data fetching and caching
- **TypeScript**: Full type safety

## Tech Stack

### Backend
- NestJS 10.x
- Prisma ORM
- PostgreSQL
- Swagger/OpenAPI
- Jest

### Frontend
- React 18
- TypeScript
- Vite
- React Hook Form
- React Query
- Axios
- jsPDF

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8.15.0+
- PostgreSQL (for backend)

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd billing-monorepo
```

2. Install dependencies:
```bash
pnpm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database and API configuration.

4. Setup database (backend):
```bash
cd backend
pnpm prisma:generate
pnpm prisma:migrate
```

### Running Locally

Start both services in parallel:
```bash
pnpm dev
```

Or run individually:
```bash
pnpm --filter backend dev
pnpm --filter frontend dev
```

### Building

```bash
pnpm build
```

### Testing

```bash
pnpm test
```

### Linting & Formatting

```bash
pnpm lint
pnpm format
```

## API Documentation

When the backend is running, visit: `http://localhost:3000/api`

### Endpoints

- `GET /api/config` - Get active billing configuration
- `POST /api/config` - Create new configuration (admin only)
- `POST /api/calculate` - Calculate bill amount

## Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `ADMIN_KEY` - Secret key for admin endpoints
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend
- `VITE_API_BASE_URL` - Backend API base URL

## Deployment

- Frontend: https://billing-fo-rge-frontend.vercel.app
- Backend API: https://billingforge.onrender.com

Make sure the following environment variables are set in your hosting providers:

- On Render (backend service):
	- `FRONTEND_URL=https://billing-fo-rge-frontend.vercel.app`  (used for CORS)
	- SMTP variables for sending OTPs (example using Gmail SMTP):
		- `SMTP_HOST=smtp.gmail.com`
		- `SMTP_PORT=587`
		- `SMTP_USER=you@example.com`
		- `SMTP_PASS=<16-character app password>`
		- `SMTP_FROM="Billing App <you@example.com>"`

- On Vercel (frontend project):
	- `VITE_API_BASE_URL=https://billingforge.onrender.com`

The frontend deployment includes a SPA fallback configuration in **both** `vercel.json` (repo root) and `frontend/vercel.json`. Keep whichever file matches your Vercel root directory so every client-side route such as `/admin` resolves to `index.html`. Each file now uses the schema-compliant pattern `source: "/((?!api/).*)", destination: "/index.html"` so Vercel accepts the rewrite during deployment. Without it, Vercel returns `NOT_FOUND` whenever someone refreshes or deep-links into a nested route.

### Connecting Frontend <-> Backend Locally

1. Start the backend (`pnpm --filter backend dev`). Confirm `http://localhost:3000/api/config` returns JSON.
2. Start the frontend (`pnpm --filter frontend dev`). The Vite dev server proxies fetches through the base URL set in `frontend/.env`.
3. Ensure both `.env` files contain matching origins:
   - Backend `FRONTEND_URL=http://localhost:5173`
   - Frontend `VITE_API_BASE_URL=http://localhost:3000`
4. When `VITE_API_BASE_URL` is missing, the frontend falls back to `window.location.origin` locally and to `https://billingforge.onrender.com` automatically when it detects it is running on a Vercel-hosted domain. You should still set the explicit variable in every environment, but the guard prevents "Content unavailable. Resource was not cached" errors when someone forgets to configure it.
5. OTP/auth flow:
   - Call `POST /api/auth/request-otp` with your email; check SMTP logs/mailbox.
   - Use the received code with `POST /api/auth/verify-otp` to obtain `sessionToken`. The frontend stores this token in `localStorage` and automatically injects it in the `x-admin-session` header for privileged requests (`/api/config`, delete/reset).

### Testing with Swagger

- Swagger UI is hosted at `http://localhost:3000/api` locally (or `https://billingforge.onrender.com/api` in production).
- Use it to exercise every endpoint, including the OTP flow:
  1. `POST /api/auth/request-otp`
  2. `POST /api/auth/verify-otp` (copy the code from email/SMS/logs)
  3. Click the "Authorize" button and provide the `sessionToken` as the value for the `x-admin-session` header.
- Once authorized, you can test `POST /api/config`, `DELETE /api/config`, and `POST /api/calculate` directly from Swagger to ensure the backend is healthy before pointing the frontend at it.

After updating env vars, redeploy both services so the frontend build and backend runtime pick up the new values.

If OTP emails fail in production, double-check SMTP credentials (Gmail app password or Mailtrap credentials), redeploy the backend, and review the backend logs for SMTP authentication errors.

## License

MIT
