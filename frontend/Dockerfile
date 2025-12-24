# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.15.0

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY frontend ./frontend

RUN pnpm install --frozen-lockfile
RUN cd frontend && pnpm build

# Production stage
FROM node:18-alpine
WORKDIR /app

RUN npm install -g pnpm@8.15.0

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY frontend ./frontend
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 5173

CMD ["pnpm", "preview", "--filter", "frontend"]
