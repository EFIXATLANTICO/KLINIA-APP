# Klinia - Guia de despliegue a produccion

Esta guia deja Klinia preparada para que un cliente entre desde internet sin depender de tu ordenador.

## 1. Rutas del proyecto

Carpeta valida del proyecto:

```text
C:\Users\Usuario\OneDrive\Documentos\New project\te-explico-un-proyecto-que-quiero\te-explico-un-proyecto-que-quiero
```

Frontend PWA:

```text
app/
```

Backend FastAPI:

```text
platform/backend/
```

## 2. Arrancar frontend PWA en local

Desde PowerShell:

```powershell
cd "C:\Users\Usuario\OneDrive\Documentos\New project\te-explico-un-proyecto-que-quiero\te-explico-un-proyecto-que-quiero"
py -3.14 -m http.server 8001 -d app
```

Abrir:

```text
http://localhost:8001
```

Mantener esa consola abierta mientras revisas la PWA.

## 3. Arrancar backend FastAPI en local

Desde otra ventana de PowerShell:

```powershell
cd "C:\Users\Usuario\OneDrive\Documentos\New project\te-explico-un-proyecto-que-quiero\te-explico-un-proyecto-que-quiero\platform\backend"
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8080
```

Abrir API:

```text
http://localhost:8080/health
```

Documentacion API:

```text
http://localhost:8080/docs
```

Si el entorno virtual no existe o falla, crear uno:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8080
```

## 4. Produccion recomendada

Arquitectura inicial:

- Frontend PWA: Vercel.
- Backend FastAPI: Render o Railway.
- Base de datos: PostgreSQL gestionado en Render, Railway, Supabase o Neon.
- Dominio: `app.klinia.es` para frontend y `api.klinia.es` para backend.

## 5. Variables de entorno backend

En Render/Railway configurar:

```text
APP_NAME=Klinia
APP_ENV=production
DATABASE_URL=postgresql+psycopg://...
JWT_SECRET=valor-largo-seguro
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
CORS_ORIGINS=https://app.klinia.es
FRONTEND_URL=https://app.klinia.es
```

Cuando se activen integraciones reales:

```text
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_KLINIAPLAN_MONTHLY=
STRIPE_PRICE_KLINIAPLAN_ANNUAL=
STRIPE_PRICE_KLINIAPLAN=
WHATSAPP_PROVIDER=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=Klinia <no-reply@klinia.es>
```

## 5.1 Stripe y suscripciones SaaS

El backend ya expone la base para comercializar Klinia como SaaS:

```text
GET /billing/plans
GET /billing/status
PATCH /billing/profile
POST /billing/checkout-session
POST /billing/portal-session
POST /stripe/webhook
```

En Stripe hay que crear el producto Klinia Profesional con precio mensual y, si se vendera anual, precio anual. Copia los `price_...` a:

```text
STRIPE_PRICE_KLINIAPLAN_MONTHLY
STRIPE_PRICE_KLINIAPLAN_ANNUAL
```

`STRIPE_PRICE_KLINIAPLAN` se mantiene como compatibilidad con despliegues anteriores y se usa como precio mensual si `STRIPE_PRICE_KLINIAPLAN_MONTHLY` no esta definido.

Webhook recomendado en Stripe:

```text
https://www.kliniasolutions.com/stripe/webhook
```

Eventos mínimos:

```text
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.paid
invoice.payment_failed
```

Sin claves Stripe, la app queda en modo demo local y no intenta cobrar.

## 6. Subir frontend a Vercel

1. Subir el proyecto a GitHub.
2. Entrar en Vercel.
3. New Project.
4. Importar el repositorio.
5. Seleccionar como Root Directory:

```text
app
```

6. Framework Preset: Other.
7. Build Command: dejar vacio.
8. Output Directory: dejar vacio o `.`.
9. Deploy.
10. Comprobar la URL temporal de Vercel.
11. Anadir dominio:

```text
www.kliniasolutions.com
```

## 7. Subir backend a Render

Opcion Render con `render.yaml`:

1. Subir el proyecto a GitHub.
2. Entrar en Render.
3. New Blueprint.
4. Seleccionar el repositorio.
5. Render detectara `render.yaml`.
6. Crear el servicio `klinia-api` y la base `klinia-postgres`.
7. En variables, revisar:

```text
CORS_ORIGINS=https://www.kliniasolutions.com,https://app.klinia.es
FRONTEND_URL=https://www.kliniasolutions.com
```

8. Deploy.
9. Probar:

```text
https://TU-BACKEND.onrender.com/health
```

## 8. Subir backend a Railway

1. Crear nuevo proyecto en Railway.
2. Anadir PostgreSQL.
3. Anadir servicio desde GitHub.
4. Root Directory:

```text
platform/backend
```

5. Start Command:

```text
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

6. Variables:

```text
DATABASE_URL=<la de Railway PostgreSQL>
APP_ENV=production
JWT_SECRET=<valor largo seguro>
CORS_ORIGINS=https://www.kliniasolutions.com,https://app.klinia.es
FRONTEND_URL=https://www.kliniasolutions.com
```

## 9. Base de datos PostgreSQL

En produccion no usar `localStorage` ni SQLite para datos reales. Usar PostgreSQL gestionado con:

- backups automaticos diarios,
- restauracion punto en el tiempo si el proveedor lo permite,
- exportacion manual antes de cambios grandes,
- entorno staging separado de produccion.

Antes de producción real, ejecutar migraciones Alembic en el backend:

```powershell
cd platform/backend
alembic upgrade head
```

La migracion `20260506_1805_saas_billing.py` anade datos fiscales, plan, estado de suscripcion e identificadores Stripe por clinica.

## 10. Dominio final

DNS recomendado:

```text
www.kliniasolutions.com -> Vercel
api.kliniasolutions.com -> Render/Railway
```

Despues actualizar en backend:

```text
CORS_ORIGINS=https://www.kliniasolutions.com,https://app.klinia.es
FRONTEND_URL=https://www.kliniasolutions.com
```

## 11. Entregar URL al cliente

URL para cliente:

```text
https://www.kliniasolutions.com
```

El cliente debe poder:

1. Entrar con usuario y clave.
2. Ver solo su clinica.
3. Crear pacientes, trabajadores, salas, servicios y citas.
4. Usar la PWA instalable.
5. No depender de tu ordenador ni de localhost.

## 12. Seguridad de datos desde ya

Mientras el prototipo siga usando almacenamiento del navegador, usar en Configuracion:

- Exportar copia.
- Importar copia.

Antes de probar cambios importantes, exportar una copia JSON de la clinica.

En produccion, la proteccion real sera PostgreSQL + backups automaticos del proveedor.
