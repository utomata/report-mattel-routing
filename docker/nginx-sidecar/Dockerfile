# Multi-stage Dockerfile for Nginx Sidecar
# Builds React frontend and configures Nginx as reverse proxy

ARG NODE_VERSION=20-alpine

# ================================
# Stage 1: Build React Frontend
# ================================
FROM node:${NODE_VERSION} AS frontend-builder

WORKDIR /app

# Install pnpm and turbo
RUN npm install -g pnpm@^9 turbo@^2

# Copy monorepo files
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY package.json ./
COPY turbo.json ./

# Copy workspace packages
COPY apps/web ./apps/web
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build frontend
RUN pnpm turbo build --filter=web

# ================================
# Stage 2: Nginx Sidecar
# ================================
FROM nginx:alpine AS sidecar

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built React app from builder stage
COPY --from=frontend-builder --chown=nextjs:nodejs /app/apps/web/dist /usr/share/nginx/html

# Copy nginx configuration template
COPY docker/nginx-sidecar/nginx.conf.template /etc/nginx/templates/default.conf.template

# Create directories for nginx
RUN mkdir -p /var/cache/nginx /var/run/nginx && \
    chown -R nextjs:nodejs /var/cache/nginx /var/run/nginx /etc/nginx

# Switch to non-root user
USER nextjs

# Expose port 8080
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Start nginx with environment variable substitution
CMD ["nginx", "-g", "daemon off;"] 