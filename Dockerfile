# Stage 1: Build frontend
FROM node:18-alpine AS client-build

WORKDIR /app/client

# Copy package files
COPY client/package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY client/ ./

# Build frontend
RUN npm run build

# Stage 2: Backend
FROM node:18-alpine AS backend

WORKDIR /app

# Install dumb-init for signal handling
RUN apk add --no-cache dumb-init

# Copy backend dependencies
COPY server/package*.json ./server/

# Install backend dependencies
WORKDIR /app/server
RUN npm ci --only=production

# Copy backend source code
COPY server/ ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Use dumb-init to start app
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]

# Stage 3: Frontend nginx
FROM nginx:alpine AS frontend

# Copy built frontend from build stage
COPY --from=client-build /app/client/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx/frontend.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
