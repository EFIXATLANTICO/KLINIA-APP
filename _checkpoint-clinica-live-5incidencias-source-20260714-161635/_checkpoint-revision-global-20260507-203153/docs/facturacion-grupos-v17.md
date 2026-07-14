# v17 - Facturación PRO de grupos

## Qué añade

- Facturación mensual para grupos recurrentes.
- Los pacientes fijos se facturan una vez por mes.
- Las clases sueltas del mes se suman dentro del cierre mensual.
- Cálculo de comisión del profesional por grupo.
- Evita duplicar cierres: un grupo solo puede facturarse una vez por periodo.
- Los importes de grupos aparecen en Facturación junto con las citas individuales.

## Cómo usarlo

1. Configura un grupo en Configuración > Grupos.
2. Añade pacientes fijos al grupo.
3. Añade clases sueltas desde la agenda cuando corresponda.
4. Ve a Facturación.
5. En "Facturación de grupos", pulsa "Facturar mes" para cerrar ese grupo en el mes seleccionado.

## Reglas de negocio

- Fijos: `pacientes fijos x precio mensual`.
- Sueltos: `clases sueltas del mes x precio clase suelta`.
- Total grupo: `fijos + sueltos`.
- Comisión: `total grupo x % comisión`.

## Nota

Esta versión no toca backend. Todo sigue funcionando en frontend/localStorage para mantener el flujo actual de trabajo.
