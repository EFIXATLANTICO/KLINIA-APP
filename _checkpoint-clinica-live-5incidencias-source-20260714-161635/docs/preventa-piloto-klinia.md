# Klinia - checklist de preventa y piloto guiado

Fecha base: 2026-05-28

## Posicionamiento recomendado

Klinia esta preparada para presentarse y venderse como piloto privado guiado o beta comercial controlada.

No debe posicionarse todavia como SaaS autoservicio masivo sin acompanamiento, porque quedan tareas de operacion, legal/RGPD, monitorizacion y migracion completa de datos historicos fuera de localStorage.

## Estado minimo para ensenar en reunion

- Frontend publicado en `https://www.kliniasolutions.com`.
- Backend publico en `https://api.kliniasolutions.com`.
- `/health` debe responder `ok: true`, `env: production`, `stripe_configured: true`, `backend_setup_status: ready` y `security_status: ok`.
- Stripe webhook configurado en `https://api.kliniasolutions.com/stripe/webhook`.
- Superadmin activo y protegido por rol.
- Registro de clinica probado desde navegador limpio.
- Login probado en escritorio y movil.
- Service worker actualizado y sin versiones antiguas retenidas.

## Prueba smoke obligatoria antes de una demo comercial

1. Abrir `https://www.kliniasolutions.com` en ventana privada.
2. Comprobar landing, ayuda, planes y login.
3. Crear una clinica de prueba con email controlado.
4. Entrar con Direccion.
5. Crear un trabajador con clave segura.
6. Crear un paciente.
7. Crear una cita.
8. Cambiar estado de la cita.
9. Revisar facturacion y rendimiento sin prometer cierre contable.
10. Entrar como superadmin.
11. Confirmar que la clinica nueva aparece en Clinicas.
12. Confirmar que aparecen usuarios y eventos en Auditoria.
13. Probar reset de clave sobre un usuario de prueba.
14. Probar en movil con cache limpia o PWA reinstalada.

## Operacion minima durante piloto

- Limitar el piloto a pocas clinicas seleccionadas.
- Crear cada alta con acompanamiento.
- Mantener un registro manual de incidencias.
- Revisar superadmin diariamente.
- Exportar o comprobar backup de Postgres antes de empezar con datos reales.
- No prometer migracion automatica completa de historicos sin revisar el caso.

## Seguridad minima revisada

- Claves nuevas con minimo 8 caracteres.
- Claves almacenadas con hash, no en texto plano.
- Login con limite de intentos por IP/identificador.
- Superadmin protegido por rol backend.
- Endpoints de superadmin devuelven 401 sin token.
- Cabeceras de seguridad configuradas en frontend y backend.
- CORS limitado a dominios de Klinia.
- Stripe no expone secretos en frontend.

## Pendiente antes de venta autoservicio

- MFA para superadmin.
- Backups automaticos con prueba real de restauracion.
- Monitorizacion de errores y alertas.
- Proveedor real de email transaccional.
- Documentos legales: politica de privacidad, terminos, contrato de encargado de tratamiento y politica de cookies si aplica.
- Migraciones formales de base de datos.
- Revisar y cerrar completamente cualquier dependencia operativa de localStorage.
- Auditoria ampliada para todos los flujos clinicos criticos.

## Criterio go / no-go para la reunion

Go si:
- `/health` esta en ready y security_status ok.
- Login funciona en escritorio y movil.
- Superadmin ve clinicas, usuarios y auditoria.
- Demo comercial no usa datos reales sensibles.
- Hay discurso claro de piloto guiado.

No-go si:
- No se puede entrar en movil.
- El backend no responde o health no esta ready.
- Superadmin no entra.
- Registro crea clinica local sin backend.
- Facturacion o agenda fallan en el flujo basico de demo.
