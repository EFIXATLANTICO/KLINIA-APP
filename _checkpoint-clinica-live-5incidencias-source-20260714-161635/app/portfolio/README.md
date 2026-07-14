# Portfolio Klinia

Microsite independiente de la aplicación operativa de Klinia.

## Archivos

- `index.html`: estructura principal del portfolio.
- `portfolio.css`: estilos propios del microsite.
- `portfolio.js`: contenido editable de funcionalidades, retos, capturas, métricas y stack.

## Actualizar contenido

Edita los arrays de `portfolio.js`:

- `features`: funcionalidades principales.
- `challenges`: retos técnicos y soluciones.
- `captures`: secciones preparadas para capturas.
- `metrics`: métricas del proyecto.
- `stack`: tecnologías y herramientas.

## Añadir capturas reales

Puedes sustituir los mockups de `.capture-thumb` en `index.html` o ampliar `portfolio.js` para incluir rutas a imágenes.
Guarda las capturas en una carpeta separada, por ejemplo:

```text
app/portfolio/captures/
```

## Abrir localmente

Desde la carpeta `app/`:

```bash
npm run dev
```

Después abre:

```text
http://localhost:8001/portfolio/
```

También puede abrirse directamente `app/portfolio/index.html`, aunque el servidor local reproduce mejor el comportamiento de despliegue.
