# WhatsApp y recordatorios v9

Esta version corrige la duplicidad entre pendientes e historial.

## Reglas

- Pendientes muestra solo el proximo recordatorio activo por cita.
- Historial muestra solo enviados, confirmados o fallidos.
- Preparar WhatsApp abre WhatsApp Web con el mensaje escrito y deja el recordatorio como preparado, pero sigue en pendientes hasta marcarlo como enviado/confirmado/fallido.
- Al marcar enviado/confirmado/fallido, desaparece de pendientes y pasa a historial.
- Resetear clinica limpia tambien las acciones de recordatorios.

## Nota

El envio automatico real necesita backend y proveedor externo (WhatsApp Business API, Twilio o similar). Esta fase es manual asistida para evitar tocar backend.
