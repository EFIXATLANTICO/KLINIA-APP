# Lanzamiento comercial inicial

## Estado real

Klinia esta listo para preparar una demo comercial instalable, pero aun no debe venderse como SaaS cerrado sin terminar estas piezas: autenticacion real, base de datos productiva, pagos, proveedor WhatsApp oficial, backups, seguridad y textos legales.

## Lo que ya queda preparado

- PWA instalable desde el navegador.
- Pantalla offline basica.
- Manifest de aplicacion con icono y accesos rapidos.
- Service worker para cachear la interfaz.
- Tarjeta de recordatorios dinamica y acceso directo a automatizaciones.

## Siguiente bloque tecnico

1. Desplegar frontend y API en un entorno de staging.
2. Conectar PostgreSQL productivo.
3. Crear login real por email y Google OAuth.
4. Separar tenants: cada clinica ve solo sus datos.
5. Integrar Stripe para suscripciones.
6. Integrar WhatsApp Business API mediante proveedor.
7. Activar backups, logs, auditoria y politicas RGPD.

## Cuentas externas necesarias

- Dominio propio.
- Hosting para API y frontend.
- Base de datos PostgreSQL gestionada.
- Stripe.
- Google Cloud OAuth.
- Proveedor WhatsApp Business API.
- Email transaccional para altas y recuperacion de contrasena.

## Forma segura de vender antes de cerrarlo todo

Venderlo como piloto controlado: una URL privada, clinicas seleccionadas, soporte manual, datos revisados y contrato simple de prueba. El objetivo es validar el flujo real de agenda, pacientes, servicios, salas, trabajadores, facturacion y recordatorios antes de escalar.
