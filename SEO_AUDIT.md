# SEO_AUDIT · Estado inicial de eduaroo.com

Auditoría de solo lectura (Fase 0). Fecha: 2026-10-09. Fuente: `next build` + `next start` en local y
rastreo con `scripts/seo/crawl.mjs` (HTML servido, sin JS) sobre 479 rutas públicas conocidas. Detalle por URL en
[`seo-audit.csv`](seo-audit.csv). Producción comprobada con `curl` contra https://www.eduaroo.com.

> El rastreo se hizo sobre el árbol de trabajo con los cambios sin commitear de la sesión anterior (localización EN,
> actividades regeneradas). Las conclusiones de SEO no dependen de ellos.

## 0. Correcciones al "estado conocido" del encargo

| Supuesto del encargo | Realidad verificada |
|---|---|
| Title de la home "Repasa Primaria" | Solo es el `default` del layout raíz y lo ven `/` y `/repaso/*`. La home real es `/es`, con title `Eduaroo \| Repasa Primaria`. |
| Body casi vacío para crawlers | **Parcialmente cierto.** Casi todas las páginas se renderizan en servidor (~180 palabras de mediana), pero `/`, `/es` y `/en` (la home, "Mi mapa") devuelven solo un esqueleto/Roo y **0 `h1`** hasta que hidrata el cliente. |
| Sin confirmar sitemap, robots, canonical, OG, JSON-LD, hreflang, 404 | Confirmado: no existen sitemap, robots, manifest, canonical, OG/Twitter ni JSON-LD. `robots.txt`, `sitemap.xml` y `manifest.webmanifest` devuelven **HTML de la home con 200** (y `noindex`). Todos los errores devuelven **200** (soft-404). hreflang sí existe, pero roto (ver P0-7). |
| Web monolingüe es-ES | Hay dos idiomas (`/es`, `/en`) con `next-intl`, pero en ese momento solo 2 de 240 bloques de actividades estaban traducidos al inglés (la traducción completa llegó después, ver SEO_REPORT.md). |

## 1. Arquitectura y render

- Next.js 16.1.4, **App Router**, Turbopack, `next-intl` 4 (`locales: ['en','es']`, `defaultLocale: 'es'`, prefijo siempre).
- Despliegue: Vercel detrás de Cloudflare. `proxy.ts` (middleware) aplica `next-intl`, salvo `/`, `/repaso/*` y la política de privacidad.
- **Todas las rutas son `ƒ` (dinámicas, SSR bajo demanda)**: ninguna es SSG/ISR. Todas devuelven
  `Cache-Control: private, no-cache, no-store` y `Set-Cookie: NEXT_LOCALE` (cookie en cada respuesta, impide caché en CDN).
- `app/loading.tsx` y `app/(repasa)/loading.tsx` hacen *streaming*: el status se envía antes de ejecutar `notFound()`/`redirect()`
  → causa raíz de los soft-404.
- `metadataBase`, `alternates.canonical`, `openGraph`, `twitter`, `robots`, `icons`, `manifest`: **ausentes**.
  Solo `app/layout.tsx` (title/description) y `app/[locale]/layout.tsx` (template `%s | Eduaroo` + `alternates.languages` con rutas relativas).
- `lang`: `<html lang="es">` fijo en el layout raíz, también en `/en/*` (incorrecto); el 404 global usa `lang="en"`.
- Fuentes: `next/font` (Nunito, subset latin, swap). Bien.

## 2. Inventario de rutas

| Patrón | Nº URLs (es+en) | Render | Origen de title/description | Palabras HTML (mediana) |
|---|---:|---|---|---:|
| `/` | 1 | SSR + `redirect('/es')` con 200 | layout raíz | 0 |
| `/{l}` (home "Mi mapa") | 2 | SSR esqueleto + cliente | `HomePage.description` (misma en todo el sitio) | 22 |
| `/{l}/learning` | 2 | SSR | `generateMetadata` | 46 |
| `/{l}/learning/{curso}` | 12 | SSR | plantilla i18n `courseSeo` | 71 |
| `/{l}/learning/{curso}/{asignatura}` | 32 | SSR | plantilla i18n `subjectSeo` | 55 |
| `/{l}/learning/{curso}/{asignatura}/{tema}` | 240 | SSR (+ `ActivityPlayer` cliente) | título y resumen del JSON de la actividad | 202 |
| `/{l}/learning/{curso}/{asignatura}/examen` | 32 | SSR + cliente | plantilla i18n | 92 |
| `/{l}/learning/math/gradeN/*`, `/language/grade4/*`, `/programming/*` (ejercicios heredados) | 82 rastreadas | SSR + cliente | mayoritariamente sin metadata propia | 26 |
| `/repaso`, `/repaso/{c}`, `/repaso/{c}/{a}` ("Repasa Primaria") | 37 | SSR | `generateMetadata` | 29–53 |
| `/{l}/games`, `/{l}/games/{juego}` | 20 | SSR + cliente | i18n (2 con clave cruda) | 31–178 |
| `/{l}/privacy`, `/{l}/terms`, `/politica-de-privacidad` | 5 | SSR | `generateMetadata` | 300–1090 |
| `/{l}/kids`, `/kids/store`, `/pegatinas`, `/mascota` | 8 | cliente (progreso en localStorage) | metadata mínima | 70–90 |
| `/{l}/teachers`, `/{l}/parents` | 4 | cliente con **datos de demostración** | `Eduaroo \| Teachers` | 60 |
| `/{l}/blog` | 2 | SSR | **claves i18n crudas** | 26 |
| `/{l}/[...rest]` | — | catch-all → `NotFoundContent` con **200** | — | — |

Contenido real indexable: 238 bloques de actividades en español (1º 38, 2º 38, 3º 39, 4º 41, 5º 42, 6º 40), 5 asignaturas × 6 cursos.

## 3. Resultados del rastreo (479 URLs)

| Métrica | Resultado |
|---|---|
| Respuestas 200 | 461 de 479 (las otras 18 son redirects 307 de los hubs heredados `/learning/math\|language`); además hay **200 en rutas inexistentes** |
| Con `<link rel="canonical">` | 0 |
| Con Open Graph / Twitter card | 0 / 0 |
| Con JSON-LD | 0 |
| Con meta robots | 2 (`robots.txt` y `sitemap.xml`, por accidente: son la página 404 de next-intl) |
| Con hreflang | 422 (relativos, ver P0-7) |
| Páginas sin `h1` | 54 (home `/`, `/es`, `/en`, 6 juegos, ~44 ejercicios heredados `learning/math/*` solo cliente, robots, sitemap) |
| Títulos fuera de 30–60 car. | 296 de 461 |
| Descriptions fuera de 120–158 car. | 440 de 461 (mediana 84) |
| Descriptions duplicadas | 186 páginas; la misma frase en 61 |
| Titles duplicados | 15 títulos en 38 páginas (`Eduaroo \| Repasa Primaria`, claves crudas, `Mi Progreso`, etc.) |
| Imágenes sin `alt` | 0 |
| Enlaces internos rotos | 0 (solo 1 enlace a un redirect) |
| Huérfanas (0 enlaces entrantes) | 47: `/`, blog, mascota, parents, teachers (×2 idiomas), robots, sitemap y los ejercicios heredados de `/en/learning/{math,language}/*` |
| Cadenas de redirects | apex http → apex https → www (2 saltos, ver P1-8) |

## 4. Hallazgos priorizados

Esfuerzo: S ≤ 2 h, M ≤ 1 día, L > 1 día.

### P0 (bloquean indexación o enseñan señales erróneas)

| # | Hallazgo | Esfuerzo | Fase |
|---|---|:-:|:-:|
| P0-1 | **Soft-404 generalizado**: `/es/zzz`, `/es/learning/9`, `/es/learning/3/mates/foo`, `/en/learning/3/mates/<tema sin traducir>` devuelven 200. Causa: `loading.tsx` + render dinámico. | M | 1 |
| P0-2 | `robots.txt`, `sitemap.xml`, `manifest.webmanifest` no existen y devuelven HTML 200 con `noindex`. | S | 1 |
| P0-3 | **Home sin contenido en el HTML**: `/es` y `/en` son un esqueleto cliente (0 `h1`, ~22 palabras); `/` redirige con 200. | M | 3, 5 |
| P0-4 | Sin canonical, `metadataBase`, OG, Twitter ni JSON-LD en todo el sitio. | M | 1, 2, 4 |
| P0-5 | Titles con **claves i18n crudas** en producción (`BlogPage.title`, `GamesPage.bitbloxMessages.meta_title`). | S | 2 |
| P0-6 | 186 descriptions duplicadas y 440 fuera de rango; una sola frase se repite en 61 URLs. | M | 2 |
| P0-7 | hreflang con URLs **relativas** en todas las páginas, apuntando a versiones EN que son Spanish-con-chrome-inglés o inexistentes (solo 2/240 temas traducidos). x-default apunta a `/` (sin contenido). | S | 1 |
| P0-8 | `/teachers` y `/parents` exponen **datos de demostración** ("Alex Johnson", 24 estudiantes) y `/kids`, `/pegatinas` son personales (localStorage): deben ser `noindex`. No se toca el dashboard (decisión de alcance previa); solo metadata. | S | 2 |
| P0-9 | Dos jerarquías duplicadas: `/repaso/{curso}/{asignatura}` ("Repasa Primaria") y `/es/learning/{curso}/{asignatura}` muestran los mismos temas. Contenido duplicado sin canonical. | M | 3 |

### P1

| # | Hallazgo | Esfuerzo | Fase |
|---|---|:-:|:-:|
| P1-1 | Hubs de curso/asignatura sin texto propio (50–70 palabras: solo tarjetas y "Explorar"). | M | 3, 5 |
| P1-2 | Sin breadcrumbs semánticos en HTML servido (`Breadcrumbs` es componente cliente) ni `BreadcrumbList`. | M | 3, 4 |
| P1-3 | Todas las rutas dinámicas y `no-store`: sin caché CDN, TTFB alto. Cookie `NEXT_LOCALE` en cada respuesta. | M | 1, 6 |
| P1-4 | Páginas de tema: title hasta 91 car.; las descriptions vienen del `summary` generado (42–143 car.). | S | 2 |
| P1-5 | Sin manifest ni juego de iconos (solo `app/icon.png`; `apple-touch-icon.png` y `favicon.png` en `/public` sin enlazar); sin `theme-color`. | S | 1 |
| P1-6 | `lang="es"` también en `/en/*`; el 404 global declara `lang="en"`. | S | 1 |
| P1-7 | Política de privacidad (`/politica-de-privacidad`, `/{l}/privacy`) describe la app "Tablas de Multiplicar", no la web; title con triple marca. Sin página Sobre nosotros ni Contacto. | M | 5 |
| P1-8 | Producción: apex → www con **307** (temporal) y `http://eduaroo.com` pasa por dos saltos. Se corrige en el dashboard del dominio (Vercel), no en código. | S | infra |
| P1-9 | Huérfanas: blog, mascota, parents, teachers. Navegación principal solo lleva a "Cursos" y "Juegos"; el footer no enlaza los 6 cursos. | S | 3 |
| P1-10 | Ejercicios heredados (`/learning/math/gradeN/*`) con redirects `permanent: false` en `next.config.ts` y metadata mínima. | S | 3 |
| P1-11 | Lighthouse móvil (build local): SEO 82–83 (fallan `robots-txt` y `hreflang`), LCP 3.9–4.3 s en las tres plantillas. | M | 6 |

### P2

| # | Hallazgo | Esfuerzo |
|---|---|:-:|
| P2-1 | Fecha de actualización no visible; `meta.generatedAt` de cada actividad permite mostrarla y usarla como `lastmod`. | S |
| P2-2 | No hay mecanismo de IndexNow ni verificación GSC/Bing. | S |
| P2-3 | Sin cabeceras de seguridad (`X-Content-Type-Options`, `Referrer-Policy`). | S |
| P2-4 | `public/app-ads.txt` presente en un sitio infantil: revisar con el equipo que sigue siendo necesario. | S |
| P2-5 | Mezcla `package-lock.json` y `pnpm-lock.yaml`. | S |

## 5. Línea base Lighthouse (móvil, throttling por defecto, `next start` local)

| Plantilla | Performance | Accesibilidad | Best practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/es` | 85 | 90 | 100 | 83 | 4.3 s | 0 | 10 ms |
| `/es/learning/3` | 86 | 89 | 100 | 83 | 4.2 s | 0 | 0 ms |
| `/es/learning/3/mates/decimales-decimas` | 87 | 89 | 100 | 82 | 3.9 s | 0 | 120 ms |

## 6. Cómo reproducir

```bash
pnpm build && pnpm start -p 3111
node scripts/seo/crawl.mjs --base http://localhost:3111 --out seo-audit
```
