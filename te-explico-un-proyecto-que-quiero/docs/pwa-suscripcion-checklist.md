# PWA instalable y suscripcion

## Estado actual

La app ya tiene manifiesto PWA, iconos, service worker, pantalla offline, boton de instalacion cuando el navegador emite `beforeinstallprompt`, registro local de clinicas y una pantalla de suscripcion. El backend ya tiene contratos iniciales para registro de clinica, estado de facturacion, checkout y portal de Stripe.

## Para instalar en otros equipos

Falta cerrar estas piezas antes de entregarlo a clinicas reales:

- Publicar en HTTPS con dominio estable.
- Confirmar que `manifest.webmanifest`, `sw.js`, iconos 192/512 y `offline.html` se sirven con MIME correcto.
- Probar instalacion en Chrome/Edge Windows, Android y Safari/iOS.
- Revisar `start_url`, `scope` e `id` para que no colisionen entre entornos.
- Versionar cache en cada despliegue para evitar que equipos remotos mantengan codigo antiguo.
- Validar que la app arranca offline sin romper login ni mostrar datos obsoletos como si fueran sincronizados.

## Para suscripcion real

Piezas ya preparadas:

- Planes SaaS en frontend.
- Perfil fiscal en frontend.
- Backend con Stripe Checkout, Portal y webhook.

Piezas pendientes para venta real:

- Activar `STRIPE_SECRET_KEY`, price ids reales y `STRIPE_WEBHOOK_SECRET`.
- Bloquear uso de clinicas sin suscripcion activa o fuera de prueba.
- Sincronizar estado de suscripcion en login y en recargas.
- Guardar facturas SaaS o enlazar portal de Stripe.
- Emails transaccionales: alta, prueba a punto de terminar, pago fallido y baja.
- Politicas legales: terminos, privacidad, encargado de tratamiento y cookies.

## QA minimo de PWA

1. Abrir la URL publica en HTTPS.
2. Verificar que aparece instalacion.
3. Instalar en Windows y Android.
4. Abrir en modo standalone.
5. Probar login, agenda, paciente, historial, facturacion y consentimientos.
6. Desconectar red y comprobar pantalla offline.
7. Publicar una version nueva y verificar que el service worker actualiza cache.

## Riesgo actual

La app es instalable para demo, pero para clientes reales depende de backend persistente, suscripcion activa, RGPD y pruebas multi-equipo con sincronizacion real.
