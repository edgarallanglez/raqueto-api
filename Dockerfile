# Use Node 20 (stable for Medusa)
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Force clean install
RUN yarn install --frozen-lockfile
# Copy full code
COPY . .
RUN yarn build
# Install server dependencies separately (ensures wrap-ansi consistency)
WORKDIR /app/.medusa/server
RUN yarn install --frozen-lockfile

# Expose Medusa port
EXPOSE 9000

# Start Medusa
CMD ["yarn", "start", "--port", "9000"]
