# Frontend (2)

```
docker build -t frontend .
```


```bash
docker run -p 3000:3000 \
  -e BACKEND_URL="http://localhost:3001" \
  -e ORIGIN="http://localhost:3000" \
  frontend
```