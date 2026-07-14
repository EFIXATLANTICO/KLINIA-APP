# Klinia v10 - Recordatorios sin duplicados

Esta version corrige el flujo de cola e historial de recordatorios.

## Cambios

- Un recordatorio gestionado no vuelve a aparecer en pendientes.
- Si una cita ya tiene un recordatorio enviado, confirmado o fallido, no se genera otro recordatorio para esa misma cita.
- El historial se limpia por cita para evitar entradas duplicadas antiguas.
- Los botones se bloquean al hacer clic para evitar doble envio por pulsacion repetida.
- El boton Preparar WhatsApp solo prepara el mensaje; no pasa a historial hasta marcar Enviado, Confirmado o Fallido.

## Uso recomendado

1. Crear cita confirmada con paciente y telefono.
2. Ir a Automatizaciones.
3. Pulsar Preparar WhatsApp para abrir WhatsApp Web.
4. Tras enviarlo, pulsar Enviado.
5. El recordatorio desaparece de pendientes y aparece una sola vez en historial.
