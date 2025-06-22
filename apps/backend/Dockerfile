# FastAPI backend with uv - simplified approach
# Based on uv FastAPI best practices

FROM python:3.11-slim

# Install system dependencies for health check
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv from the official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Create non-root user for security (before copying files)
RUN groupadd --system --gid 1001 fastapi && \
    useradd --system --uid 1001 --gid fastapi --create-home fastapi

# Copy the application into the container and set ownership
COPY --chown=fastapi:fastapi apps/backend/ /app

# Set working directory
WORKDIR /app

# Switch to non-root user before installing dependencies
USER fastapi

# Install the application dependencies as the fastapi user
RUN uv sync --frozen --no-cache --no-dev

# Expose port 8000 (internal API port)
EXPOSE 8000

# Health check (run as fastapi user)
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start the FastAPI application using uv
CMD ["/app/.venv/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"] 