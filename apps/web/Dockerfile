# Multi-stage Dockerfile for React/Vite frontend
# Optimized for Turborepo with pnpm

ARG NODE_VERSION=20-alpine

# ================================
# Stage 1: Base Alpine with Node.js
# ================================
FROM node:${NODE_VERSION} AS base
RUN apk update && apk add --no-cache libc6-compat

# ================================
# Stage 2: Turborepo Pruning
# ================================
FROM base AS pruner
WORKDIR /app

# Install Turborepo and pnpm globally
RUN npm install -g turbo@^2 pnpm@^9

# Copy entire monorepo
COPY . .

# Prune the workspace for web app
RUN turbo prune web --docker

# ================================
# Stage 3: Install Dependencies
# ================================
FROM base AS installer
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@^9

# Copy package files from pruned workspace
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# Install dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store \
    pnpm install --frozen-lockfile

# ================================
# Stage 4: Build Application
# ================================
FROM base AS builder
WORKDIR /app

# Install pnpm and turbo
RUN npm install -g pnpm@^9 turbo@^2

# Copy dependencies from installer
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=installer /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy source code from pruned workspace
COPY --from=pruner /app/out/full/ .

# Build the web application
RUN turbo build --filter=web

# ================================
# Stage 5: Production Server
# ================================
FROM nginx:alpine AS runner

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy nginx configuration
COPY apps/web/nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/dist /usr/share/nginx/html

# Expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Switch to non-root user
USER nextjs

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 