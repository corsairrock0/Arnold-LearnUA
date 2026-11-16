FROM node:22-alpine

WORKDIR /app

# Copy package manifests first for layer caching
COPY package.json ./

# Install dependencies
RUN npm install --no-audit --no-fund

# Copy project source and static assets
COPY . .

# Build optimized frontend bundle into /app/dist
RUN npm run build

# Run on port 4000 inside the container
ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# Start the Express + WebSocket + static bundle server on 0.0.0.0:4000
CMD ["node", "--experimental-strip-types", "server.ts"]
