# Deployment Guide

## Building for Production

### Local Build

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Build Output

- `build/index.js` - Server entry point
- `build/client/` - Client-side assets
- `build/server/` - Server-side chunks

## Docker Deployment

### Building Docker Image

```bash
docker build -t frontend:latest .
```

The `Dockerfile` uses a multi-stage build:
1. Build stage: Installs dependencies and builds the app
2. Runtime stage: Only includes necessary files for production

### Running Docker Container

#### Development Backend (localhost)

```bash
docker run -p 3000:3000 \
  -e BACKEND_URL="http://localhost:3001" \
  -e ORIGIN="http://localhost:3000" \
  frontend:latest
```

#### Docker Host Backend

```bash
docker run -p 3000:3000 \
  -e BACKEND_URL="http://host.docker.internal:3001" \
  frontend:latest
```

#### Docker Network Backend

```bash
docker network create mynetwork

docker run -p 3000:3000 \
  --network mynetwork \
  -e BACKEND_URL="http://backend:3001" \
  --name frontend \
  frontend:latest
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_URL` | `http://localhost:3001` | Backend API URL |
| `ORIGIN` | `http://localhost:3000` | Allowed origin for CSRF protection |
| `NODE_ENV` | `production` | Node environment |

### Container Ports

- `3000` - Application port (default)

## Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: .
    container_name: frontend
    ports:
      - "3000:3000"
    environment:
      BACKEND_URL: http://backend:3001
      ORIGIN: http://localhost:3000
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    image: backend:latest
    container_name: backend
    ports:
      - "3001:3001"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

Run with:

```bash
docker-compose up
```

## Production Checklist

- [ ] Build succeeds without errors: `npm run build`
- [ ] Type checking passes: `npm run check`
- [ ] Linting passes: `npm run lint`
- [ ] Environment variables set correctly
- [ ] Backend URL configured for production
- [ ] ORIGIN matches deployment domain
- [ ] No console errors in production build
- [ ] Image builds successfully
- [ ] Container starts without errors
- [ ] Application is accessible on the correct port

## Performance Optimization

### Build Analysis

Check bundle size:

```bash
npm run build
du -sh build/
```

### Caching Strategy

- Static assets: Set long cache headers
- API responses: Configure as needed
- CSS/JS: Hashed for cache busting

### Runtime Environment

For better performance:

```bash
docker run -p 3000:3000 \
  -e NODE_ENV="production" \
  -e BACKEND_URL="..." \
  --memory="512m" \
  --cpus="1" \
  frontend:latest
```

## Troubleshooting

### Application won't start

Check logs:
```bash
docker logs <container-id>
```

### Connection refused to backend

Verify:
- Backend is running and accessible
- `BACKEND_URL` is correct
- Network connectivity between containers

### Port already in use

Use a different port:
```bash
docker run -p 3001:3000 frontend:latest
```

### Out of memory

Increase container memory:
```bash
docker run --memory="1g" frontend:latest
```

## Scaling

### Load Balancing with nginx

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend1
      - frontend2

  frontend1:
    build: .
    environment:
      BACKEND_URL: http://backend:3001
    networks:
      - app-network

  frontend2:
    build: .
    environment:
      BACKEND_URL: http://backend:3001
    networks:
      - app-network

networks:
  app-network:
```

## Monitoring

### Health Check

Add to `docker-compose.yml`:

```yaml
services:
  frontend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Logging

View logs:
```bash
docker logs -f <container-id>
```

## Database Migrations

If using a database:

1. Run migrations before deployment
2. Use versioning for schema changes
3. Test migrations in development first

## Rollback Procedure

```bash
# Tag images with version
docker build -t frontend:v1.0.0 .

# Keep previous version running
docker run -p 3001:3000 frontend:v0.9.9

# Switch traffic after testing
docker run -p 3000:3000 frontend:v1.0.0
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Docker image
        run: docker build -t frontend:latest .
      
      - name: Push to registry
        run: docker push frontend:latest
      
      - name: Deploy
        run: docker run -d frontend:latest
```
