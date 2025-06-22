# Multi-stage Dockerfile for FastAPI backend
# Optimized for production deployment

ARG PYTHON_VERSION=3.11-slim

# ================================
# Stage 1: Base Python Image
# ================================
FROM python:${PYTHON_VERSION} AS base

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    POETRY_NO_INTERACTION=1 \
    POETRY_VENV_IN_PROJECT=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# ================================
# Stage 2: Dependencies Installation
# ================================
FROM base AS deps

# Install uv for faster Python package management
RUN pip install uv

# Set working directory
WORKDIR /app

# Copy dependency files
COPY pyproject.toml uv.lock* ./

# Install dependencies
RUN uv sync --frozen --no-dev

# ================================
# Stage 3: Production Image
# ================================
FROM base AS runner

# Create non-root user for security
RUN groupadd --system --gid 1001 fastapi && \
    useradd --system --uid 1001 --gid fastapi --create-home fastapi

# Set working directory
WORKDIR /app

# Copy virtual environment from deps stage
COPY --from=deps --chown=fastapi:fastapi /app/.venv /app/.venv

# Add virtual environment to PATH
ENV PATH="/app/.venv/bin:$PATH"

# Copy application code
COPY --chown=fastapi:fastapi . .

# Switch to non-root user
USER fastapi

# Expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Start the FastAPI application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "1"] 