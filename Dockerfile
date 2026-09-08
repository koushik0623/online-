# ========================================================
# Dockerfile - Sparkle @ KKV Live Store Production Container
# ========================================================

# Stage 1: Build Frontend static assets
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy full application source code
COPY . .

# Build production bundle using Vite
RUN npm run build

# Stage 2: Production Server Environment
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Copy package manifests and install production-only dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built frontend assets and backend server code
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/index.html ./index.html
COPY --from=builder /app/server ./server
COPY --from=builder /app/src/data ./src/data
COPY --from=builder /app/scripts ./scripts

# Expose HTTP ports (5000 for API/App, 3000 for Web)
EXPOSE 5000 3000

# Healthcheck to ensure container is healthy
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Command to start Sparkle Backend & Frontend server
CMD ["node", "server/index.js"]
