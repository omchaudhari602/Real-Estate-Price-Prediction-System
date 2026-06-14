# ⚙️ System Design

## Problem Statement

Build a scalable real estate price prediction system that:

- Predicts property prices in real-time
- Supports secure user authentication
- Allows model retraining
- Tracks model experiments
- Provides monitoring and observability

---

# Functional Requirements

✅ User Registration

✅ User Login

✅ Predict House Price

✅ Retrain Model

✅ View Metrics

---

# Non Functional Requirements

- Low latency (<200ms)
- High Availability
- Secure Authentication
- Scalable Architecture
- Containerized Deployment

---

# Database Design

## User Table

| Column | Type |
|--------|------|
| id | Integer |
| email | String |
| password_hash | String |
| created_at | Timestamp |

---

# Prediction Flow

```text
User

↓

React Frontend

↓

FastAPI API

↓

JWT Authentication

↓

Prediction Service

↓

Load Joblib Model

↓

Generate Prediction

↓

Return JSON Response
```

---

# Authentication Flow

```text
Register

↓

Hash Password

↓

Store User

↓

Login

↓

Verify Password

↓

Generate JWT Token

↓

Authenticated Requests
```

---

# Monitoring Flow

```text
API Request

↓

Prometheus Metrics

↓

Grafana Dashboard

↓

Visual Monitoring
```

---

# Scalability Improvements

Future enhancements:

- Redis Caching
- Kubernetes Deployment
- CI/CD Pipeline
- AWS Deployment
- Feature Store
- Model Versioning
- A/B Testing
- Async Prediction Queue

---

# Tech Stack

### Frontend

- React
- Vite

### Backend

- FastAPI
- SQLAlchemy
- JWT

### Machine Learning

- Scikit-Learn
- Joblib

### Database

- SQLite
- PostgreSQL

### Monitoring

- Prometheus
- Grafana

### Deployment

- Docker
- AWS
- Render
