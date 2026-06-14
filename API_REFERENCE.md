# 📚 API Reference

Base URL

```text
http://localhost:8000
```

---

# Authentication

## Register User

### Endpoint

```http
POST /api/v1/auth/register
```

### Request

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

### Response

```json
{
  "message": "User registered successfully"
}
```

---

## Login

### Endpoint

```http
POST /api/v1/auth/login
```

### Request

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

### Response

```json
{
  "access_token": "JWT_TOKEN",
  "token_type": "bearer"
}
```

---

# Prediction

## Predict House Price

### Endpoint

```http
POST /api/v1/predict
```

### Request

```json
{
  "features": {
    "area": 1200,
    "bedrooms": 3,
    "bathrooms": 2,
    "floors": 2,
    "parking": 1
  }
}
```

### Response

```json
{
  "prediction": 7500000
}
```

---

# Health Check

### Endpoint

```http
GET /api/v1/health
```

### Response

```json
{
  "status":"ok",
  "app":"HousePrice API"
}
```

---

# Metrics

### Endpoint

```http
GET /api/v1/metrics
```

Returns Prometheus metrics.

---

# Retrain Model

### Endpoint

```http
POST /api/v1/retrain
```

Retrains the ML model using updated dataset.
