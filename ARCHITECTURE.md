# 🏗️ Architecture

## Overview

The Real Estate Price Prediction System is a full-stack machine learning application designed with a modular architecture.

It consists of:

- React + Vite Frontend
- FastAPI Backend
- Machine Learning Prediction Engine
- SQLite/PostgreSQL Database
- Monitoring Stack (Prometheus + Grafana)
- MLflow for Experiment Tracking

---

## High Level Architecture

```text
                ┌─────────────────────┐
                │     React Frontend   │
                │      (Vite App)      │
                └──────────┬──────────┘
                           │ REST API
                           ▼
                ┌─────────────────────┐
                │     FastAPI API      │
                │ Authentication       │
                │ Prediction Service   │
                │ Retraining Service   │
                └──────────┬──────────┘
                           │
        ┌──────────────────┼─────────────────┐
        ▼                  ▼                 ▼

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ ML Model    │    │ Database    │    │ Monitoring  │
│ Joblib      │    │ SQLite/PG   │    │ Prometheus  │
│ ScikitLearn │    │ SQLAlchemy  │    │ Grafana     │
└─────────────┘    └─────────────┘    └─────────────┘

                           │
                           ▼

                ┌─────────────────────┐
                │       MLflow         │
                │ Experiment Tracking  │
                └─────────────────────┘
```

---

## Frontend

Technology:

- React
- Vite
- Axios
- React Router

Responsibilities:

- User Authentication
- Prediction Form
- Display Results
- Dashboard
- Error Handling

---

## Backend

Technology:

- FastAPI
- SQLAlchemy
- JWT Authentication
- Pydantic

Responsibilities:

- Authentication
- User Management
- Prediction API
- Model Retraining
- Metrics Endpoint

---

## Machine Learning Layer

Technology:

- Scikit-Learn
- Joblib

Responsibilities:

- Model Loading
- Feature Processing
- Prediction
- Retraining

---

## Monitoring

Technology:

- Prometheus
- Grafana

Responsibilities:

- API Metrics
- Request Monitoring
- Performance Analysis
