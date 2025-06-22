# FastAPI Dockerfile optimized for Cloud Run Sidecar
ARG PYTHON_VERSION=3.11-slim

# ================================
# Stage 1: Base Python Image
# ================================
FROM python:${PYTHON_VERSION} AS base

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ================================
# Stage 2: Dependencies Installation
# ================================
FROM base AS deps

# Install uv for faster Python package installation
RUN pip install uv

# Copy dependency files
WORKDIR /app
COPY apps/backend/pyproject.toml apps/backend/uv.lock ./

# Install dependencies
RUN uv sync --frozen --no-dev

# ================================
# Stage 3: Production Image
# ================================
FROM base AS production

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Set working directory
WORKDIR /app

# Copy virtual environment from deps stage
COPY --from=deps --chown=appuser:appuser /app/.venv /app/.venv

# Copy application code
COPY --chown=appuser:appuser apps/backend/ .

# Create data directory
RUN mkdir -p /app/data && chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Add venv to PATH
ENV PATH="/app/.venv/bin:$PATH"

# Expose port 8000 (internal communication with nginx sidecar)
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start FastAPI with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"] 