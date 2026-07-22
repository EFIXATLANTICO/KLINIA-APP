# Aislamiento de clínicas y acceso

## Estado corregido en esta fase

- El frontend local guarda las colecciones operativas bajo `klinia:clinic:<clinicKey>:<modulo>`.
- Las colecciones clínicas quedan marcadas con `clinicKey` al guardarse y se filtran al cargarse si traen una clave de otra clínica.
- Al entrar en una clínica se repersiste el estado cargado para migrar datos legacy al formato con `clinicKey`.
- Rendimiento limpia su UI cuando una clínica no tiene trabajadores, evitando que queden datos renderizados de una clínica anterior.
- El acceso real admite usuarios por clínica:
  - dirección por email de cuenta de clínica,
  - recepción por email y contraseña configurados en Permisos,
  - trabajador por email y contraseña configurados en su ficha.
- El registro y los nuevos trabajadores reales ya no nacen con contraseña `demo`.
- La clínica demo queda separada y mantiene su acceso específico desde el flujo demo.
- El backend ya filtra pacientes, citas, trabajadores, salas y servicios por `clinic_id` y se han añadido endpoints de gestión de usuarios por clínica para dirección.

## Causa raíz del arrastre visible en Rendimiento

La clínica nueva no tenía trabajadores y `renderPerformance()` salía sin limpiar el panel. Si antes se había renderizado Clínica Maite Lozano o la demo, la UI podía conservar ese HTML anterior. Además, las colecciones legacy no tenían una marca interna `clinicKey`, por lo que era más difícil detectar contaminación si una clave local se copiaba o importaba mal.

## Pendiente para producción

- Conectar el frontend local a los endpoints reales de usuarios del backend cuando se active la API completa.
- Sustituir el almacenamiento local por PostgreSQL para todos los módulos todavía locales: consentimientos, bonos, notas clínicas, métricas extendidas y recordatorios.
- Añadir recuperación de contraseña real por email y auditoría de accesos.
- Completar políticas legales, retención y borrado RGPD con backend productivo.
