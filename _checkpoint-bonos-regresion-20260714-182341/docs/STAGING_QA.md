# Entorno de pruebas y QA comercial de Klinia

## Objetivo
Evitar que las pruebas comerciales contaminen producción. Toda prueba de 20 pacientes, 50 citas, 30 cobros, importaciones o reseteos debe hacerse en una clínica de pruebas o en un despliegue staging separado.

## Recomendación operativa mínima

1. Crear una clínica llamada `CLINICA STAGING` o `CLINICA DEMO QA` con datos ficticios.
2. Usar usuarios separados para Dirección, trabajador y recepción.
3. Ejecutar pruebas de agenda, facturación, bonos, recordatorios y rendimiento solo sobre esa clínica.
4. Antes de cada demo comercial, resetear únicamente esa clínica de pruebas desde Superadmin o Configuración.
5. No mezclar pacientes reales con pruebas de carga.

## Staging técnico recomendado

- Vercel: crear entorno Preview/Staging apuntando a una API staging.
- Render: crear `klinia-api-staging` con base PostgreSQL independiente.
- Stripe: usar claves test y price IDs test en staging.
- Google Login: añadir el dominio preview/staging como origen autorizado.
- Brevo: usar remitente de pruebas o etiqueta `[STAGING]` en asuntos.

## Checklist de reseteo antes de una demo

- Vaciar pacientes ficticios.
- Vaciar citas ficticias.
- Vaciar movimientos manuales de facturación ficticios.
- Vaciar bonos y cuotas grupales ficticias.
- Mantener configuración base: trabajadores, salas, servicios y permisos.
- Comprobar que Dirección, trabajador y recepción pueden entrar.

## QA comercial recomendado

1. Crear 20 pacientes ficticios.
2. Crear 50 citas en día y semana, con duraciones de 30, 45 y 60 minutos.
3. Cobrar 30 movimientos combinando efectivo, tarjeta, bonos y cuotas grupales.
4. Validar que facturación no duplica cobros y que agenda conserva citas cobradas.
5. Revisar rendimiento por trabajador con filtro de día, mes, rango, profesional y servicio.
6. Entrar desde Windows, macOS y móvil para confirmar que los datos coinciden.
7. Probar PWA instalada después de actualizar service worker.
8. Exportar o documentar resultados antes de resetear.

## Criterio de salida

Klinia se considera apta para piloto guiado si la clínica de staging completa el checklist sin pérdida de datos, cobros duplicados, errores de login ni diferencias entre dispositivos.