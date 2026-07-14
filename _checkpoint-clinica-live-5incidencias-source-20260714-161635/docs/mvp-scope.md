# Alcance del MVP

## Objetivo del MVP

Construir una primera version que permita validar el producto con una clinica
real o una demo convincente.

## Debe incluir

- Login.
- Roles basicos.
- Dashboard con citas del dia.
- CRUD de pacientes.
- CRUD de profesionales.
- CRUD de salas.
- Configuracion de clinica para Direccion.
- CRUD de servicios.
- Catalogo de tarifas con duracion y precio por servicio.
- Agenda diaria.
- Agenda semanal.
- Crear cita.
- Editar cita.
- Cancelar cita.
- Confirmar cita.
- Marcar cita como atendida o no asistida.
- Consultar detalle de cita con notas internas.
- Validacion de conflictos.
- Nota clinica simple por cita.
- Listado de historial del paciente.
- Facturacion basica calculada desde el estado de las citas.
- Perfil de trabajador con sus citas e ingresos estimados.
- Perfil de Direccion con informe comparativo del equipo.

## Puede esperar

- Portal publico para pacientes.
- Pagos online.
- WhatsApp.
- SMS.
- Facturacion avanzada.
- Estadisticas complejas.
- Firma digital de consentimientos.
- Auditoria avanzada.
- Nominas o liquidaciones contables definitivas.

## Flujo principal

1. Recepcion inicia sesion.
2. Consulta la agenda del dia.
3. Busca o crea un paciente.
4. Selecciona profesional, sala, servicio y hora.
5. El sistema comprueba conflictos.
6. Se guarda la cita.
7. El profesional atiende al paciente.
8. El profesional registra una nota clinica.
9. La cita queda como atendida.

## Criterios de exito

- Crear una cita tarda menos de un minuto.
- El sistema impide reservar dos citas incompatibles.
- Un profesional puede ver su agenda sin ruido.
- Recepcion puede saber rapidamente que ocurre hoy.
- La ficha del paciente muestra citas y notas anteriores.
