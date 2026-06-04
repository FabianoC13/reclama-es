# Publicar Reclama en GitHub Pages

## URL

Tras el primer despliegue correcto:

**https://fabianoc13.github.io/reclama-es/**

Guía Sede Madrid (demo estática):

**https://fabianoc13.github.io/reclama-es/presentar-madrid/**

## Activar Pages (una vez)

1. En GitHub: **Settings → Pages**
2. **Build and deployment → Source:** GitHub Actions
3. Haz push a `main` o `tier2` (o ejecuta el workflow *Deploy GitHub Pages* manualmente)

## Build local

```bash
npm run build:pages
```

Genera la carpeta `out/` (sitio estático).

## Qué funciona en Pages

| Sí | No (requiere servidor) |
|----|-------------------------|
| Inicio, procedimientos, guía de envío | Generar borrador con IA (`/api/generar-documento`) |
| **Guía Sede Madrid demo** (`/presentar-madrid`) | Tier 2 completo con base de datos |
| Enlaces a la Sede oficial de Madrid | Subir justificante, `/dev`, admin |

Para la app completa (wizard + IA + Tier 2), usa **Vercel**, **Railway** o `npm run dev` en local.

## ¿Cuánto tiempo puede estar en línea?

En un repositorio **público**, GitHub Pages en el plan gratuito:

- **No caduca** mientras el repo exista y Pages siga activo.
- No “se duerme” como algunos hostings gratuitos.
- Límites orientativos: ~1 GB de almacenamiento del sitio y ~100 GB de ancho de banda al mes (suficiente para un proyecto personal o demo).

Si el repo pasa a **privado**, Pages deja de ser gratuito salvo plan de pago de GitHub.
