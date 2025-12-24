# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.15.0

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY backend ./backend

RUN pnpm install --frozen-lockfile
RUN cd backend && pnpm build

# Production stage
FROM node:18-alpine
WORKDIR /app

RUN npm install -g pnpm@8.15.0

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY backend ./backend
COPY --from=builder /app/backend/dist ./backend/dist

RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["node", "backend/dist/main.js"]
