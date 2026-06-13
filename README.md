# Real Estate Price Prediction System

A full-stack real estate price prediction platform with:

- a FastAPI backend for authentication, predictions, health, metrics, and model management
- a React frontend for dashboards, predictions, analytics, monitoring, and administration
- an ML pipeline for training regression models and saving the best artifact
- Docker, Kubernetes, Terraform, and observability assets for deployment and monitoring

This repository currently represents the **Phase 1** implementation of the project, focused on the machine-learning foundation and the supporting application stack.

## Highlights

- Train and compare multiple regression models for house price prediction
- Serve predictions through a FastAPI endpoint
- Track metrics with Prometheus-compatible instrumentation
- Run the app locally with Python and Node.js, or with Docker Compose
- Includes dashboards and alerting configuration for monitoring

## Repository layout

```text
backend/         FastAPI application, services, models, schemas, and tests
frontend/        React application built with Vite
ml-pipeline/     Training pipeline, feature engineering, and notebooks
infrastructure/  Kubernetes and Terraform manifests
monitoring/      Prometheus, Grafana, and Alertmanager configuration
scripts/         PowerShell helpers for local setup and stack startup
docs/            Sample datasets and supporting files
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- Docker Desktop, if you want to run the full stack with Compose
- PostgreSQL and Redis are provided by Docker Compose for local development

## Environment configuration

The backend reads configuration from the repository root `.env` file.

Required values:

- `SECRET_KEY`
- `DATABASE_URL`

Optional values:

- `MLFLOW_TRACKING_URI`

Example values are already provided in `.env` for local development.

## How to run

Choose the option that matches what you want to do:

### 1) Run the full stack with Docker Compose

From the project root, run:

- `scripts/start_stack.ps1`

This starts the backend, frontend, PostgreSQL, Redis, Prometheus, Grafana, and Alertmanager.

### 2) Run the backend locally

From the project root, run:

- `scripts/start_backend.ps1`

This creates `backend/.venv` if needed, installs dependencies, and starts FastAPI on port `8000`.

### 3) Run the frontend locally

From the `frontend/` directory, run:

- `npm install`
- `npm run dev`

The frontend runs on Vite and connects to the backend at `http://localhost:8000` by default.

## Local backend setup

The quickest way to start the backend on Windows is:

1. Open PowerShell from the project root.
2. Run `scripts/start_backend.ps1`.

That script will:

- create `backend/.venv` if needed
- install backend dependencies
- launch Uvicorn on port `8000`

If you prefer to run it manually:

1. Create and activate a virtual environment in `backend/`
2. Install `backend/requirements.txt`
3. Start FastAPI with `uvicorn main:app --reload --host 0.0.0.0 --port 8000`

## Local frontend setup

From the `frontend/` directory:

1. Install dependencies with `npm install`
2. Start the dev server with `npm run dev`

The frontend is configured to talk to the backend on `http://localhost:8000` by default.

## Full stack with Docker Compose

Use the provided PowerShell helper from the project root:

1. Run `scripts/start_stack.ps1`

This starts:

- PostgreSQL
- Redis
- backend API
- frontend app
- Prometheus
- Grafana
- Alertmanager

Docker Compose exposes the common ports used by the stack:

- Backend: `8000`
- Frontend: `3000`
- PostgreSQL: `5432`
- Redis: `6379`
- Prometheus: `9090`
- Grafana: `3001`
- Alertmanager: `9093`

## ML pipeline

The model training pipeline lives in `ml-pipeline/pipeline.py` and performs:

- dataset loading
- cleaning and missing-value handling
- outlier removal
- feature preprocessing
- model training and comparison
- artifact export

Run it from the `ml-pipeline/` directory after placing your dataset in `ml-pipeline/data/` or one of the supported fallback locations.

Generated artifacts are stored in `ml-pipeline/tracking/` and include:

- trained models (`.joblib` and `.pkl`)
- `results.json`
- feature-importance plots when available

## API endpoints

The backend exposes routes under `/api/v1`, including:

- `POST /api/v1/predict` — generate a prediction from feature input
- `POST /api/v1/retrain` — trigger model retraining
- `GET /api/v1/health` — service health check
- `GET /api/v1/metrics` — metrics endpoint

## Testing

Backend tests live under `backend/tests/`.

Typical commands:

- run backend tests with `pytest`
- run coverage with `pytest --cov`

## Developer quickstart

1. Copy environment template and set secrets:

```powershell
cp .env.example .env
# edit .env and set SECRET_KEY and DATABASE_URL appropriately OR generate one with the helper
python scripts/generate_env.py
```

2. Create and activate a Python virtualenv for the backend (from repo root):

```powershell
python -m venv .venv
& .venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

3. (Optional) generate an example model for local development so the predict endpoint works without training:

```powershell
python scripts/generate_example_model.py
```

4. Run backend tests:

```powershell
$env:PYTHONPATH = "$pwd;$pwd\backend"
pytest backend -q
```

5. Start backend locally (development):

```powershell
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

6. Start frontend:

```powershell
cd frontend
npm install
npm run dev
```

Notes:
- Use `.env.example` as a template for local `.env`.
- The CI workflow runs backend tests on push/PR (`.github/workflows/ci.yml`).

## Monitoring and dashboards

The repository includes ready-made observability assets:

- `monitoring/prometheus/prometheus.yml`
- `monitoring/prometheus/rules.yml`
- `monitoring/grafana/dashboards/houseprice-dashboard.json`
- `monitoring/alertmanager/config.yml`

## Notes

- The project is currently focused on the Phase 1 ML and application scaffold.
 - `docker-compose.yml` includes an optional MLflow tracking server (exposed on port 5000) that stores the backend metadata in a lightweight SQLite file and artifacts under a Docker volume. When running the full stack via Compose the backend is configured to talk to MLflow at `http://mlflow:5000`. If you prefer not to run MLflow in Compose, the backend will fall back to using local `ml-pipeline/tracking/` artifacts.
- For Windows PowerShell, the helper scripts in `scripts/` are the easiest way to get started.
