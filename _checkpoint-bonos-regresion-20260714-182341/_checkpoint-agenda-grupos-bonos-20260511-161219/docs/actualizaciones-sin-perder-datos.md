# Actualizar Klinia sin perder datos

## Principio comercial

En produccion, los datos de las clinicas no deben vivir en el navegador. Deben vivir en PostgreSQL gestionado, con backups automaticos y migraciones controladas. La PWA puede actualizarse todas las veces que haga falta sin borrar clinicas porque solo cambia codigo, no datos.

## Mientras seguimos en prototipo local

Antes de cualquier cambio grande:

1. Entrar en Klinia.
2. Ir a Configuracion.
3. Pulsar `Exportar copia`.
4. Guardar el JSON en una carpeta segura.
5. Aplicar cambios.
6. Si algo falla, usar `Importar copia`.

## En produccion

Flujo seguro recomendado:

1. Tener dos entornos: `staging` y `production`.
2. Probar cada cambio en staging.
3. Hacer backup de PostgreSQL antes de publicar cambios importantes.
4. Publicar frontend PWA en Vercel.
5. Publicar backend FastAPI en Render/Railway.
6. Ejecutar migraciones de base de datos si hay cambios de modelo.
7. Verificar login, agenda, pacientes y facturacion.

## Backups minimos

- Backup automatico diario en PostgreSQL.
- Retencion minima: 7-30 dias.
- Exportacion manual antes de cambios grandes.
- Acceso restringido a datos clinicos.

## Regla de oro

Nunca hacer cambios de estructura directamente sobre produccion sin backup reciente, prueba previa en staging y plan de vuelta atras.
