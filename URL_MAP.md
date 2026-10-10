# URL_MAP · Jerarquía de URLs y redirects

## Política

- Host canónico único: `https://www.eduaroo.com`. `eduaroo.com` y `http://` redirigen con **301 en un solo salto** (`next.config.ts`).
  En producción el dominio apex lo redirige hoy Vercel con 307; hay que cambiarlo a permanente en el panel del dominio (ver SEO_REPORT.md).
- **Sin barra final** (`trailingSlash: false`): `/primaria/` → 308 → `/primaria`. Canonical, sitemap y enlaces internos usan siempre la forma sin barra.
- Español sin prefijo de idioma; inglés bajo `/en` (noindex hasta que esté traducido, ver `lib/seo/site.ts`).
- Slugs en español, minúsculas, sin acentos, sin ids opacos. Los ids internos (`mates`, `naturales`, `sociales`, curso `3`) no cambian: son las claves de `content/activities`, del registro y del progreso guardado en el navegador.
- Todas las URLs se construyen con `lib/seo/urls.ts`. El código antiguo que enlaza con rutas lógicas (`/learning/3/mates`) pasa por `lib/seo/legacy-paths.ts` (ver `i18n/navigation.tsx`), así ningún enlace interno apunta a una URL que redirige.

## Jerarquía nueva

```
/                                                         Home
/primaria                                                 Índice de cursos
/primaria/{n}-primaria                                    Hub de curso (n = 1…6)
/primaria/{n}-primaria/{asignatura}                       Hub de asignatura
/primaria/{n}-primaria/{asignatura}/{tema}                Tema (bloque de actividades)
/primaria/{n}-primaria/{asignatura}/examen                Prepara tu examen (noindex)
/juegos  ·  /juegos/{juego}                               Juegos educativos
/politica-de-privacidad  ·  /terminos                     Legales (noindex, follow)
```

| id interno | slug público |
|---|---|
| `lengua` | `lengua` |
| `mates` | `matematicas` |
| `naturales` | `ciencias-naturales` |
| `sociales` | `ciencias-sociales` |
| `ingles` | `ingles` |

Ejemplo: `/primaria/3-primaria/matematicas/decimales-decimas`.

## Mapeo antiguo → nuevo (todos 301, un solo salto)

| Antiguo | Nuevo |
|---|---|
| `/es` | `/` |
| `/es/learning` · `/learning` · `/{es,en}/learning/math` · `/{es,en}/learning/language` · `/repaso` | `/primaria` (`/en/primaria` para `/en/…`) |
| `/es/learning/{n}` · `/repaso/{n}` | `/primaria/{n}-primaria` |
| `/es/learning/{n}/{id}` · `/repaso/{n}/{id}` | `/primaria/{n}-primaria/{slug}` |
| `/es/learning/{n}/{id}/{tema}` (y `/examen`) | `/primaria/{n}-primaria/{slug}/{tema}` |
| `/es/learning/math/grade{n}` | `/primaria/{n}-primaria/matematicas` |
| `/es/learning/language/grade{n}` | `/primaria/{n}-primaria/lengua` |
| `/es/games` · `/games` | `/juegos` |
| `/es/games/{juego}` · `/games/{juego}` | `/juegos/{juego}` |
| `/es/privacy` · `/privacy` · `/privacy-policy` | `/politica-de-privacidad` |
| `/es/terms` · `/terms` | `/terminos` |
| `/es/{cualquier otra ruta}` | `/{misma ruta}` (p. ej. `/es/kids` → `/kids`) |

Las mismas reglas existen para el prefijo `/en` (destino bajo `/en`). Las reglas están en `lib/seo/redirects.ts` y se aplican antes que el middleware.

No cambian: ejercicios heredados `/learning/math/grade{n}/*`, `/learning/language/grade4/*`, `/learning/programming/*` y `/learning/repaso` (noindex, enlazados desde cada tema), ni `/kids`, `/pegatinas`, `/mascota`, `/blog`, `/parents`, `/teachers` (noindex).

## Verificación

```bash
pnpm build && pnpm start -p 3111
# cada URL antigua debe dar 301 y, en el salto siguiente, 200 (sin cadenas ni bucles)
curl -sI http://localhost:3111/es/learning/3/mates/decimales-decimas | head -3
```
