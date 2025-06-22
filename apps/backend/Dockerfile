# FastAPI backend with uv - simplified approach
# Based on uv FastAPI best practices

FROM python:3.11-slim

# Install system dependencies for health check
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv from the official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy the application into the container
COPY apps/backend/ /app

# Install the application dependencies
WORKDIR /app
RUN uv sync --frozen --no-cache --no-dev

# Create non-root user for security
RUN groupadd --system --gid 1001 fastapi && \
    useradd --system --uid 1001 --gid fastapi --create-home fastapi

# Change ownership of the app directory
RUN chown -R fastapi:fastapi /app

# Switch to non-root user
USER fastapi

# Expose port 8000 (internal API port)
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start the FastAPI application using uv
CMD ["/app/.venv/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"] 