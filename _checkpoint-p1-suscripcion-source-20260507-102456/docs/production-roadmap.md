# Klinia - hoja de ruta a produccion

Estado a 2026-05-05: la app demo funciona en local y ya existe una primera base de backend FastAPI en `platform/backend` con autenticacion JWT, entidades por clinica y endpoints protegidos por `clinic_id`.

## 1. Limpieza del proyecto

- Mantener `app/` como frontend actual hasta que se conecte a API.
- Mantener `platform/backend/` como backend productivo.
- No subir carpetas generadas: `.deps*`, `.venv`, bases SQLite de prueba, `__pycache__`.
- Pendiente recomendado: anadir `.gitignore` y scripts de arranque unificados.

## 2. Backend y base de datos real

Ya iniciado:
- FastAPI.
- SQLAlchemy.
- Configuracion por `.env`.
- Docker Compose para PostgreSQL.
- Modelos con `clinic_id`.
- Registro de clinica.
- Login con JWT.
- Pacientes, trabajadores, salas, servicios y citas.
- Comision decimal en trabajadores.
- Dos franjas horarias de disponibilidad por trabajador.

Pendiente para produccion:
- Migraciones con Alembic.
- CRUD completo de edicion/eliminacion en todos los recursos.
- Tabla de permisos granulares por rol.
- Usuarios de recepcion/trabajadores creados desde Direccion.
- Recuperacion de contrasena por email.
- Auditoria de cambios importantes.

## 3. Seguridad y permisos

Ya iniciado:
- Token JWT con `user_id`, `clinic_id` y rol.
- Endpoints filtrados por clinica.
- Acciones sensibles limitadas por rol.

Pendiente:
- Matriz de permisos editable desde Direccion.
- Proteccion de todos los endpoints futuros.
- Rate limiting en login.
- Politica de contrasenas.
- Logs de acceso.

## 4. Frontend conectado al backend

Pendiente:
- Sustituir `localStorage` demo por llamadas API.
- Mantener modo demo separado del modo real.
- Guardar token de sesion y renovar/cerrar sesion correctamente.
- Mapear pacientes, trabajadores, salas, servicios, citas, facturacion y automatizaciones.
- Mostrar errores de API de forma clara.

## 5. Automatizaciones y WhatsApp

Pendiente:
- Elegir proveedor: WhatsApp Business Cloud API o Twilio.
- Guardar consentimiento del paciente.
- Plantillas aprobadas por WhatsApp.
- Cola de envios programados.
- Reintentos y registro de entregas.
- Panel para ver enviados, fallidos y pendientes.

## 6. Google login

Pendiente:
- Crear proyecto en Google Cloud.
- Configurar OAuth consent screen.
- Crear OAuth Client ID.
- Implementar login con Google en backend.
- Vincular usuario Google a clinica y rol.

## 7. Pagos con Stripe

Pendiente:
- Definir planes: mensual por clinica, por profesional o por volumen.
- Crear productos/precios en Stripe.
- Checkout o Customer Portal.
- Webhooks para altas, bajas, impagos y renovaciones.
- Bloqueo o aviso si la suscripcion no esta activa.

## 8. PWA

Pendiente:
- Manifest.
- Service worker.
- Iconos.
- Pantalla instalable en movil/tablet.
- Estrategia de cache sin romper datos en tiempo real.

## 9. Despliegue

Opcion simple recomendada para piloto:
- Backend + PostgreSQL: Render, Railway, Fly.io o similar.
- Frontend: Vercel, Netlify o el mismo proveedor del backend.
- Dominio: comprar dominio y apuntar DNS.
- HTTPS: activarlo con el proveedor.

Antes de subir:
- Cambiar `JWT_SECRET`.
- Usar `DATABASE_URL` de PostgreSQL.
- Configurar `CORS_ORIGINS` con el dominio real.
- Desactivar credenciales demo.

## 10. Legal

Pendiente con asesoria:
- Aviso legal.
- Politica de privacidad.
- Politica de cookies si aplica.
- Contrato de encargado de tratamiento.
- Terminos de uso.
- Consentimiento para WhatsApp/SMS/email.
- Revision RGPD para datos sanitarios.

## 11. Piloto comercial

Plan recomendado:
- Elegir 2-3 clinicas.
- Migrar solo datos esenciales.
- Cobrar desde el piloto con precio reducido o acuerdo cerrado.
- Medir agenda, facturacion, recordatorios y gestion de grupos.
- Recoger incidencias en una lista semanal.
- Cerrar version 1 cuando el uso diario sea estable.

