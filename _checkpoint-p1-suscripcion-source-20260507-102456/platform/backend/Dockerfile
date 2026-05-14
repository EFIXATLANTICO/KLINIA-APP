FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY platform/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY platform/backend/app ./app
COPY platform/backend/alembic.ini .
COPY platform/backend/migrations ./migrations
COPY app ./frontend

ENV FRONTEND_DIR=/app/frontend
EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
