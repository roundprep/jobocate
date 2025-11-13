FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json yarn.lock ./
RUN yarn install 

# Copy application files
COPY . .

# Create uploads directory
RUN mkdir -p uploads/resumes

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
