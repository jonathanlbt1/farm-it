FROM node:20-alpine AS deps

WORKDIR /app

# Install production dependencies only.
COPY package*.json ./
RUN npm ci --omit=dev


FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy dependency tree from deps stage.
COPY --from=deps /app/node_modules ./node_modules

# Copy application source.
COPY . .

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
