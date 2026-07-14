# v19 Recuperación de acceso

Esta versión corrige el bloqueo de entrada provocado por el selector de clínicas vacío.

Cambios:
- Recupera clínicas guardadas en `localStorage`.
- Si existe una clínica como `CLINICA MAITE LOZANO`, vuelve a aparecer en el selector.
- No borra pacientes, trabajadores, salas, servicios, grupos ni citas.
- Arranca dentro de la plataforma para evitar quedarse bloqueado en login.
- Mantiene el botón Salir para volver al login si se necesita.

Instalación:
1. Copiar `app` y `docs`.
2. Pegar encima del proyecto.
3. Aceptar reemplazar.
4. Pulsar Ctrl + F5.
