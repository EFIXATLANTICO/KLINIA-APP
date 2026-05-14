# Proteccion de datos e importacion de clinicas

## Estado actual

Klinia separa los datos por clinica en el almacenamiento local del navegador y permite exportar/importar una copia JSON desde Configuracion > Seguridad de datos. Esto sirve para demo, pruebas y migraciones manuales controladas, pero no debe considerarse almacenamiento sanitario definitivo.

Datos sensibles detectados:

- Pacientes: identidad, contacto, DNI, digitalizacion de DNI, alertas internas.
- Historial clinico: motivo de consulta, evolucion, observaciones y adjuntos.
- Consentimientos: documento firmado, ciudad, fecha y firma digital.
- Facturacion: importes, bonos, datos fiscales y facturas generadas.
- Usuarios/trabajadores: permisos, disponibilidad y actividad.

## Requisitos antes de usar datos reales de clientes

- Backend multi-tenant obligatorio: cada clinica debe tener `clinic_id` y no debe poder leer datos de otra clinica.
- PostgreSQL gestionado con copias automaticas, cifrado en reposo y backups probados.
- HTTPS obligatorio en todos los entornos con datos reales.
- Control de accesos por rol y auditoria de acciones sensibles: alta/baja de paciente, historial, consentimientos, facturas, importaciones y exportaciones.
- Politica de retencion y derecho de supresion diferenciando datos administrativos, clinicos y facturacion.
- Contrato de encargado de tratamiento y revision RGPD especifica para datos de salud.

## Importacion desde otra clinica

La importacion segura no debe sobrescribir directamente produccion. Flujo recomendado:

1. Crear copia exportada desde la clinica origen.
2. Validar estructura: pacientes, citas, servicios, trabajadores, consentimientos, bonos e historial.
3. Previsualizar resumen antes de importar: totales, duplicados por DNI/email/nombre y conflictos de agenda.
4. Importar en modo transaccional: si falla una parte critica, no se aplica nada.
5. Guardar registro de auditoria: usuario, fecha, origen del archivo, totales importados y errores.
6. Mantener IDs de origen como `external_id` para evitar duplicados en futuras importaciones.

## Contrato minimo de importacion en backend

Endpoint propuesto:

`POST /imports/clinic-backup`

Debe aceptar un JSON versionado y devolver:

- `preview_id`
- resumen de entidades detectadas
- duplicados y conflictos
- errores bloqueantes

Confirmacion:

`POST /imports/clinic-backup/{preview_id}/commit`

Debe ejecutar la importacion con transaccion y auditoria.

## Riesgo actual

La importacion local existente es util para demo y recuperacion manual, pero sobrescribe datos del navegador. Para clientes reales debe sustituirse por el flujo de previsualizacion, validacion y commit en backend.
