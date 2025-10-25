# Build stage
FROM node:25-alpine AS builder

ENV NODE_ENV=production 

WORKDIR /app

COPY package*.json ./

RUN npm install --include=dev

COPY . .

RUN npm run build

# Production stage
FROM node:25-alpine AS runner

WORKDIR /app

COPY package*.json ./

RUN npm install --include=dev

COPY --from=builder /app .

ENV PORT=3000
ENV HOST=0.0.0.0
ENV ORIGIN=*

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--port", "3000", "--host", "0.0.0.0"]
