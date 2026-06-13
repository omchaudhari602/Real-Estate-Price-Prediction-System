FROM python:3.11-slim AS base
WORKDIR /app

FROM base AS builder
RUN apt-get update && apt-get install -y build-essential gcc libpq-dev && rm -rf /var/lib/apt/lists/*
COPY requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /wheels -r /app/requirements.txt

FROM base AS runtime
COPY --from=builder /wheels /wheels
# Ensure requirements file is present in runtime image
COPY requirements.txt /app/requirements.txt
# Install requirements including dependencies (do not suppress errors)
RUN pip install --no-cache-dir --find-links /wheels -r /app/requirements.txt
COPY . /app
ENV PYTHONUNBUFFERED=1
EXPOSE 8000
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
