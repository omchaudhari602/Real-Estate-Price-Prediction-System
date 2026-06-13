# Quickstart — Run the project (shortcut)

This file gives the minimal, step-by-step commands to get the project running locally on Windows (PowerShell). It assumes you have Docker Desktop, Python 3.11+, and Node.js 18+ installed.

1) Prepare environment

```powershell
# copy example .env and generate a secure SECRET_KEY
cp .env.example .env
python scripts/generate_env.py
```

2) (Optional) create Python virtualenv and install backend deps

```powershell
python -m venv .venv
& .venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

3) (Optional) generate an example ML model for local predict (used by backend)

```powershell
python scripts/generate_example_model.py
```

4) Run the backend locally (development)

```powershell
& .venv\Scripts\Activate.ps1
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: http://localhost:8000

5) Run the frontend locally

```powershell
cd frontend
npm install
npm run dev
```

The frontend dev server (Vite) will run on port 3000 by default.

6) Run the full stack with Docker Compose (includes optional MLflow)

```powershell
scripts/start_stack.ps1
# or directly:
docker compose up --build
```

Services exposed by Docker Compose (default ports)

- Backend: 8000
- Frontend: 3000
- PostgreSQL: 5432
- Redis: 6379
- Prometheus: 9090
- Grafana: 3001
- Alertmanager: 9093
- MLflow UI: 5000

7) Run backend tests

```powershell
& .venv\Scripts\Activate.ps1
$env:PYTHONPATH = "$pwd;$pwd\backend"
pytest backend -q
```

8) Quick: start both backend & frontend together (opens two PowerShell windows)

```powershell
(Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned) ; .\scripts\start_dev.ps1
```

Notes
- Use `.env.example` as a template; do NOT commit `.env` (it's ignored by `.gitignore`).
- If you run Compose, the backend will be configured to use the bundled MLflow server at `http://mlflow:5000`.
- For quick debugging of predict endpoints without training, `ml-pipeline/tracking/ExampleModel.joblib` is provided.

That's it — this file is the shortest path to get the app running locally.

