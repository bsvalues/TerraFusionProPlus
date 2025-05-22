# Multi-stage build for TerraFusion Professional

# Build stage for Node.js application
FROM node:20-alpine AS node-builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files for production
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=node-builder /app/dist ./dist
COPY --from=node-builder /app/shared ./shared
COPY --from=node-builder /app/server ./server

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["node", "server/index.js"]