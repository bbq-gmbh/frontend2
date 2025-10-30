# Build stage
FROM node:25-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production


# Production stage
FROM node:25-alpine AS runner

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && \
  adduser -S svelte -u 1001

WORKDIR /app

COPY --from=builder --chown=svelte:nodejs /app/build ./build
COPY --from=builder --chown=svelte:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=svelte:nodejs /app/package.json ./package.json

USER svelte


ENV PORT=3000
ENV HOST=0.0.0.0
ENV ORIGIN=http://localhost:3000

EXPOSE 3000

CMD ["node", "build"]
