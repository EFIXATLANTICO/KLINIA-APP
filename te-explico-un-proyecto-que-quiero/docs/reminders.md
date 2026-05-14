# Recordatorios Klinia

## Estado actual

Esta versión mantiene los recordatorios en el frontend, dentro del estado local de cada clínica. No toca `platform/backend`.

## Cambios v3

- La cola ya no muestra dos recordatorios iguales por cita.
- Cada cita muestra solo el siguiente recordatorio pendiente: primero 24h antes y después 2h antes.
- Cuando marcas un recordatorio como enviado, confirmado o fallido, la cola se recalcula y el siguiente pendiente sube automáticamente.
- Se añaden acciones manuales:
  - Preparar WhatsApp.
  - Preparar SMS.
  - Preparar email.
  - Confirmado.
  - Fallido.
- El botón de WhatsApp abre WhatsApp Web o la app con el mensaje preparado.
- El botón SMS abre el SMS del dispositivo con el mensaje preparado.
- El botón email abre el cliente de correo con asunto y cuerpo preparados.

## Importante sobre envío real

Esta versión no envía recordatorios automáticamente. Prepara el mensaje para enviarlo manualmente.

Para que el producto envíe recordatorios solo, aunque la app esté cerrada, hace falta una fase posterior de backend:

- Guardar recordatorios en base de datos.
- Ejecutar un proceso programado cada pocos minutos.
- Conectar un proveedor externo:
  - WhatsApp Business API / Meta Cloud API.
  - Twilio.
  - SendGrid, Resend o similar para email.
- Registrar estados reales: enviado, entregado, leído, fallido y confirmado.

## Recomendación de producto

Para demo comercial inmediata: mantener envío manual asistido con WhatsApp/SMS/email.

Para producto vendible real: pasar recordatorios al backend y conectar proveedor oficial de mensajería.

## v4 - cola viva

- La lista de pendientes queda anclada arriba del panel.
- Los pendientes se ordenan por urgencia: vencidos primero y despues por hora de envio mas cercana.
- Al marcar un recordatorio como enviado, confirmado o fallido, desaparece de pendientes y pasa al historial.
- El historial muestra primero las acciones mas recientes.
- Sigue siendo un sistema local de frontend: no envia mensajes automaticamente hasta conectarlo a backend y proveedor externo.
