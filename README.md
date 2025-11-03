# Frontend (2)

```bash
docker build -t frontend .
```

```bash
docker run -p 3000:3000 \
  -e BACKEND_URL="http://localhost:3001" \
  -e ORIGIN="http://localhost:3000" \
  frontend
```

```bash
docker run -p 3000:3000 \
  -e BACKEND_URL="http://host.docker.internal:3001" \
  frontend
```
