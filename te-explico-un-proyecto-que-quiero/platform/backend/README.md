# Klinia backend

API base para pasar Klinia de prototipo local a producto multi-clinica.

## Local rapido

Por defecto usa SQLite local para poder arrancar sin Docker:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8080
```

Con el runtime incluido en Codex se puede probar asi:

```powershell
python -m uvicorn app.main:app --reload --port 8080
```

## PostgreSQL local

1. Arrancar PostgreSQL:

```powershell
docker compose up -d postgres
```

2. Cambiar `.env`:

```env
DATABASE_URL=postgresql+psycopg://klinia:klinia_dev_password@localhost:5432/klinia
```

3. Arrancar API:

```powershell
python -m uvicorn app.main:app --reload --port 8080
```

## Primeros endpoints

- `POST /auth/register-clinic`
- `POST /auth/login`
- `GET /me`
- `GET /billing/plans`
- `GET /billing/status`
- `PATCH /billing/profile`
- `POST /billing/checkout-session`
- `POST /billing/portal-session`
- `POST /stripe/webhook`
- `GET /patients`
- `POST /patients`
- `GET /practitioners`
- `POST /practitioners`
- `GET /services`
- `POST /services`
- `GET /appointments`
- `POST /appointments`

Todos los endpoints internos filtran por `clinic_id` del usuario autenticado.

## SaaS, Stripe y multiempresa

El registro de clinica acepta `plan`, datos fiscales y responsable. Si el plan no es `trial`, el backend crea una sesion Checkout cuando `STRIPE_SECRET_KEY` y el precio `STRIPE_PRICE_KLINIAPLAN_MONTHLY` o `STRIPE_PRICE_KLINIAPLAN_ANNUAL` existen. `STRIPE_PRICE_KLINIAPLAN` queda como fallback mensual para despliegues anteriores. Si faltan claves, devuelve una URL demo y deja la clinica con estado `pending_stripe`.

El portal de pagos usa el Customer Portal de Stripe cuando la clinica tiene `stripe_customer_id`. Los webhooks actualizan `subscription_status`, `stripe_customer_id`, `stripe_subscription_id`, precio y periodo actual.

El login acepta `clinic_id` o `clinic_email` para evitar ambiguedades si un mismo email existe en varias clinicas.

## Docker para despliegue

Construir desde la raiz del proyecto:

```powershell
docker build -f platform/backend/Dockerfile -t klinia-api .
```

Arrancar:

```powershell
docker run --env-file platform/backend/.env -p 8080:8080 klinia-api
```

En produccion hay que usar PostgreSQL real en `DATABASE_URL`, cambiar `JWT_SECRET` y configurar `CORS_ORIGINS` con el dominio final.

## Migraciones

La estructura de Alembic ya esta preparada:

```powershell
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```

El siguiente paso tecnico antes de subir a produccion es generar la primera migracion real desde los modelos actuales.

## Verificacion hecha

- Registro de clinica.
- Login con JWT.
- Creacion de paciente, trabajador, sala, servicio y cita.
- Comision decimal: `30.5`.
- Dos franjas horarias por trabajador: `08:00-14:00` y `15:00-20:00`.
- Separacion de datos por clinica: una clinica no ve pacientes ni citas de otra.
