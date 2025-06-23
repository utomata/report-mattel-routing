# Multi-stage Dockerfile for React/Vite frontend
# Simplified for Cloud Build

ARG NODE_VERSION=20-alpine

# ================================
# Stage 1: Build Stage
# ================================
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@^9

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy package.json files for all workspaces
COPY apps/web/package.json ./apps/web/
COPY apps/backend/package.json ./apps/backend/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Set build-time environment variable for API base URL
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build the web application
RUN cd apps/web && pnpm run build

# ================================
# Stage 2: Production Server
# ================================
FROM nginx:alpine AS runner

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Create directories for nginx temp files and logs with proper permissions
RUN mkdir -p /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    chown -R nextjs:nodejs /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    touch /tmp/nginx.pid /tmp/nginx_error.log /tmp/nginx_access.log && \
    chown nextjs:nodejs /tmp/nginx.pid /tmp/nginx_error.log /tmp/nginx_access.log

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