Test Docker image locally to ensure compatiblity:

```
docker build -t shopping-service .
docker run -p 8006:8006 shopping-service
```
