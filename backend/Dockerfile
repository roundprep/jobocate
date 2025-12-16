FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy shared workspace packages that local file dependencies rely on
COPY packages /packages

# Install backend dependencies first for better layer caching
COPY backend/package*.json backend/yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy application files
COPY backend .

# Create uploads directory
RUN mkdir -p uploads/resumes

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
