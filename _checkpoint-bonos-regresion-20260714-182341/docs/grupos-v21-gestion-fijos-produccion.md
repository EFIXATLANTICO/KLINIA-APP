# v21 - Gestion de grupos desde Configuracion y clase completada

Cambios aplicados:

- Los pacientes fijos de un grupo se gestionan desde Configuracion > Grupos.
- En la agenda ya no se editan pacientes fijos, para evitar sobrecarga visual.
- En Configuracion > Grupos cada grupo permite:
  - añadir paciente fijo desde la base de pacientes,
  - quitar paciente fijo,
  - mantener capacidad y plazas.
- En la agenda se mantiene la clase suelta del dia.
- Se añade el boton "Marcar clase completada" en la clase grupal.
- Al completar una clase grupal se guarda en rendimiento/produccion del trabajador.
- La produccion operativa de la clase se calcula como asistentes x precio de clase suelta.
- La cuota mensual de pacientes fijos queda preparada para la facturacion mensual del grupo.

Notas:

- No se toca backend ni platform.
- Solo se modifican app y docs.
- Los datos actuales de pacientes, trabajadores, grupos y agenda se mantienen.
