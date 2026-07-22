# Klinia - plan para comercializar la version definitiva

Objetivo: pasar de demo local a producto vendible con datos reales por clinica.

## Fase 1 - Producto real usable

Estado: en marcha.

1. Backend real con FastAPI.
2. PostgreSQL como base de datos.
3. Login real con JWT.
4. Datos separados por `clinic_id`.
5. Roles: direccion, recepcion/trabajador y trabajador.
6. Frontend conectado a la API.
7. CRUD completo: crear, editar y eliminar pacientes, trabajadores, salas, servicios, grupos y citas.
8. Copias de seguridad de base de datos.

Salida de esta fase: una clinica puede trabajar sin depender del almacenamiento del navegador.

## Fase 2 - Piloto cobrable

1. Subir backend y PostgreSQL a produccion.
2. Subir frontend o servirlo desde el backend.
3. Activar dominio y HTTPS.
4. Crear 2 o 3 clinicas reales.
5. Cargar datos minimos: trabajadores, salas, servicios y algunos pacientes.
6. Usar la agenda durante 2 semanas.
7. Cobrar desde el piloto, aunque sea precio reducido.

Salida de esta fase: validacion comercial real.

## Fase 3 - Automatizaciones

1. WhatsApp Business Cloud API o proveedor equivalente.
2. Consentimiento del paciente para mensajes.
3. Plantillas aprobadas.
4. Cola de recordatorios.
5. Panel de enviados, pendientes y fallidos.

Salida de esta fase: recordatorios automaticos reales.

## Fase 4 - Cobro SaaS

1. Stripe Checkout o Customer Portal.
2. Planes de precio.
3. Webhooks de suscripcion.
4. Estado de pago por clinica.
5. Aviso o bloqueo por impago.

Salida de esta fase: cobro recurrente automatizado.

## Fase 5 - Legal y confianza

1. Politica de privacidad.
2. Terminos de uso.
3. Aviso legal.
4. Contrato de encargado de tratamiento.
5. Politica de cookies si aplica.
6. Consentimiento para comunicaciones por WhatsApp/email/SMS.
7. Revision especifica RGPD por datos sanitarios.

Salida de esta fase: base legal para vender a clinicas.

## Orden inmediato recomendado

1. Conectar el frontend actual al backend real.
2. Completar CRUD API de todos los modulos.
3. Activar PostgreSQL con migraciones.
4. Subir una primera instancia privada.
5. Meter una clinica piloto.
6. Cobrar la mensualidad piloto.

