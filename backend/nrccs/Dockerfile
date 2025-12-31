# ============================================
# NRCCS Backend Docker Image
# Multi-stage build: Node.js + Python Runtime
# Includes NestJS backend + Python AI/ML
# ============================================

# Stage 1: Build NestJS application
FROM node:18-bullseye-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files first (for layer caching)
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy TypeScript source code
COPY . .

# Build the NestJS application (TypeScript → JavaScript)
RUN npm run build

# Remove devDependencies after build
RUN npm prune --production

# ============================================
# Stage 2: Production Runtime with Python
# ============================================
FROM node:18-bullseye-slim AS production

# Install Python and required system packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create symlink for python command
RUN ln -sf /usr/bin/python3 /usr/bin/python

# Set working directory
WORKDIR /app

# Create a non-root user for security
RUN addgroup --system --gid 1001 nrccs && \
    adduser --system --uid 1001 --gid 1001 nrccs

# Copy package.json for reference
COPY package.json ./

# Copy production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy compiled NestJS code
COPY --from=builder /app/dist ./dist

# ============================================
# Setup Python AI/ML Environment
# ============================================

# Create AI directory
RUN mkdir -p /app/ai

# Copy Python requirements file
COPY requirements.txt ./requirements.txt

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy Python AI code and model from Artiint folder
# Note: These will be copied from the parent directory context
COPY ai/ ./ai/

# Set correct permissions
RUN chown -R nrccs:nrccs /app

# Switch to non-root user
USER nrccs

# ============================================
# Environment Configuration
# ============================================

# Default environment variables (override at runtime)
ENV NODE_ENV=production
ENV PORT=3000
ENV PYTHON_PATH=/usr/bin/python3
ENV AI_MODEL_PATH=/app/ai/model.pkl
ENV AI_SCRIPT_PATH=/app/ai/predict_flood.py

# Expose ports (3000 for development, 8080 for production)
EXPOSE 3000 8080

# Health check (checks whatever port is set in PORT env var)
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/api', (r) => process.exit(r.statusCode === 200 || r.statusCode === 404 ? 0 : 1))" || exit 1

# Start the NestJS application
CMD ["node", "dist/main.js"]
