# SEO_REPORT · Eduaroo

> Actualización del 13 de octubre de 2026: la biblioteca de recursos y comparativas amplía el sitemap a 568 URLs indexables, con cero P0/P1 en el rastreo. El informe de abajo documenta la auditoría anterior de 288 URLs. Véase [recursos y comparativas](docs/recursos-seo-competencia.md).

Rama `seo/technical-seo` (worktree `.claude/worktrees/seo`), un commit por fase. Estado inicial en [SEO_AUDIT.md](SEO_AUDIT.md) y `seo-audit.csv`; estado final en `seo-audit-after.csv`.

## 1. Resumen

Antes, el sitio no tenía sitemap, robots, canonical, Open Graph ni JSON-LD; cualquier error devolvía 200 (soft-404), `robots.txt` y `sitemap.xml` devolvían la home en HTML, y la portada llegaba sin contenido al crawler. Ahora hay **288 URLs indexables** en el sitemap, todas con title y description únicos y en rango, canonical absoluta autorreferente, un h1, Open Graph/Twitter con imagen propia y JSON-LD válido; los errores son 404 reales; la jerarquía de URLs es `/primaria/{n}-primaria/{asignatura}/{tema}` con 301 de un solo salto desde las antiguas. `pnpm seo:check` da **0 P0**.

## 2. Qué se ha hecho por fase

| Fase | Commit | Resumen |
|---|---|---|
| 0 | `chore(seo): fase 0` | Auditoría (`SEO_AUDIT.md`, `seo-audit.csv`) y rastreador `scripts/seo/crawl.mjs`. |
| 1 | `feat(seo): fase 1` | `lib/seo/site.ts` (única fuente de URL/nombre/locale), `robots.ts`, `sitemap.ts` (lastmod real de `meta.generatedAt`), `manifest.ts`, iconos (ico, 32, 180, 192, 512, maskable), 404 reales (se elimina `loading.tsx`), generación estática con `dynamicParams=false`, redirects 301 apex→www y http→https, cabeceras de seguridad y caché de estáticos, sin cookie `NEXT_LOCALE` ni cabecera `Link` del middleware. |
| 2 | `feat(seo): fase 2` | `buildMetadata()` en todas las páginas; plantillas de title/description desde los datos; **validación en build** (el sitemap falla si hay duplicados o longitudes fuera de rango); imágenes OG 1200×630 en `/og/**` (home, curso, asignatura); noindex para páginas personales, de demostración y heredadas; sin hreflang. |
| 3 | `feat(seo): fase 3` | Nueva jerarquía y redirects (ver `URL_MAP.md`); hubs de curso y asignatura con intro, listado de temas, bloque LOMLOE y enlaces relacionados; migas visibles; footer con los 6 cursos; portada con h1 y texto en el HTML servido; se retira `/repaso` (duplicado). |
| 4 | `feat(seo): fase 4` | `<JsonLd/>` tipado; `Organization` + `WebSite` (home), `BreadcrumbList` (todas las internas), `CollectionPage` (hubs), `LearningResource` (238 temas); `validate-jsonld.mjs`. |
| 5 | `feat(seo): fase 5` | Sobre Eduaroo y Contacto; `KEYWORD_MAP.md` + `docs/keyword-map-temas.csv`; h1 accesible en los 3 juegos que no tenían. |
| 6 | `perf(seo): fase 6` | Sprite 469 KB → 71 KB, accesibilidad y contraste. |
| 7 | `feat(seo): fase 7` | Verificación GSC/Bing por variables de entorno, IndexNow, analítica Plausible opcional sin cookies. |
| 8 | `chore(seo): fase 8` | `scripts/seo/check.mjs`, tests vitest, `lighthouserc.json`, workflow `seo.yml`, `SEO_CHECKLIST.md`. |

## 3. Métricas antes / después

Medido en local sobre `next build` + `next start` (el despliegue real se mide aparte).

| Métrica | Antes | Después |
|---|---:|---:|
| URLs en sitemap | 0 (devolvía HTML) | 288 |
| `robots.txt` | HTML 200 con noindex | válido, declara el sitemap |
| Respuesta ante rutas inexistentes | 200 (soft-404) | 404 real |
| Páginas indexables con canonical / OG / Twitter | 0 / 0 / 0 | 288 / 288 / 288 |
| JSON-LD | 0 páginas | 288 (Breadcrumb en 287, Organization+WebSite en la home, 37 hubs, 238 temas) |
| Titles duplicados | 15 títulos en 38 páginas | 0 |
| Descriptions duplicadas | 186 páginas (una frase en 61) | 0 |
| Title fuera de 30–60 | 296 de 461 | 0 de 288 |
| Description fuera de 120–158 | 440 de 461 | 0 de 288 |
| Indexables sin h1 | 54 | 0 |
| hreflang | 422 relativos y rotos | no se emite (un solo idioma indexable) |
| Palabras en el HTML de la home | 22 | 247 |
| Palabras en un hub de curso | 71 | 631 |
| Enlaces internos rotos / a redirects | 0 / 1 | 0 / 0 |
| `Cache-Control` de las páginas | `private, no-store` | `s-maxage=31536000` (estáticas) |
| Peso del sprite del canguro (en todas las páginas) | 469 KB | 71 KB |

Lighthouse móvil (3 plantillas, local):

| | SEO | Accesibilidad | Rendimiento | LCP simulado | LCP con throttling aplicado | CLS |
|---|---:|---:|---:|---:|---:|---:|
| Antes (`/es`, `/es/learning/3`, tema) | 83 / 83 / 82 | 90 / 89 / 89 | 85 / 86 / 87 | 4,3 / 4,2 / 3,9 s | — | 0 |
| Después (`/`, curso, tema) | 100 / 100 / 100 | 100 / 96 / 96 | 90 / 91 / 92 | 3,4 s (las tres) | 1,7 s (rendimiento 98–99) | 0,066 / 0 / 0 |

El LCP *simulado* sigue por encima de 2,5 s (Lighthouse lo extrapola con CPU 4× y 4G lenta); con throttling aplicado es 1,7 s. Hay que confirmarlo con datos de campo (CrUX / Search Console → Core Web Vitals) tras desplegar. Los umbrales del CI (SEO ≥ 95, accesibilidad ≥ 90, rendimiento ≥ 85) se cumplen.

## 4. Decisiones y desviaciones del encargo (léelas)

1. **Trabajo en rama y worktree aparte.** El repositorio tenía ~225 ficheros sin commitear (localización EN, actividades regeneradas). Para no mezclarlos en mis commits, partí de `HEAD` en `seo/technical-seo`. **Conflictos esperables al fusionar** (9 ficheros que tú también tocas): las páginas de `app/[locale]/learning/{page,[curso]/page,[curso]/[asignatura]/page,…/[tema]/page,…/examen/page}.tsx` (ahora viven en `app/[locale]/primaria/…` y siguen usando `getCurso/getActivityLoaders` en español: habrá que portar tu versión localizada), `components/Breadcrumbs.tsx`, `components/map/MiMapa.tsx` (solo `h1`→`h2`) y `components/map/TemaPath.tsx` (`h1`/`p` intercambiados, cabecera más oscura). Mi código solo usa `ACTIVITY_SETS` (español) de `content/activities/registry.ts`, que sigue exportado en tu versión.
2. **"Fichas".** Los recursos son ejercicios interactivos, no fichas imprimibles; por eso los títulos dicen "ejercicios" y no "fichas". Es la mayor oportunidad de contenido (ver plan).
3. **Sin barra final.** El ejemplo del encargo tenía barra final; elegí la política por defecto de Next (sin barra) y la aplico en canonical, sitemap y enlaces.
4. **Español sin prefijo** (`localePrefix: 'as-needed'`): `/es/x` → `/x`. La home real es `/`.
5. **Inglés `noindex`, sin hreflang y fuera del sitemap** (`englishIndexable = false` en `lib/seo/site.ts`): hay 238 bloques traducidos (`content/activities/en`), pero sin revisar. Cuando se revisen: poner el flag a `true`, añadir `alternates.languages` y mover el `<html lang>`. Limitación actual: `<html lang="es">` también en `/en/*` (probé mover el layout raíz a `[locale]`, pero con `globalNotFound` el 404 perdía el contenido, así que lo revertí).
6. **Capa de compatibilidad `lib/seo/legacy-paths.ts`**: el código antiguo sigue enlazando `/learning/3/mates…` y `i18n/navigation.tsx` lo traduce a la URL pública, así no hubo que tocar ~35 ficheros de la app. Se puede ir sustituyendo por `paths.*`.
7. **Ejercicios heredados** (`/learning/math/gradeN/*`, `/language/*`, `/programming/*`, `/learning/repaso`) siguen donde estaban, `noindex`. `/teachers` y `/parents` tienen datos de demostración (alumnos inventados): `noindex`, sin tocar los dashboards.
8. **Afirmaciones de marketing que debes confirmar**: "gratis y sin registro" (home, descriptions), "corrección inmediata" y "explicación tras cada respuesta" (verificado en `ActivityPlayer`). Si habrá plan de pago, hay que cambiar `lib/seo/templates.ts`.
9. **"Sobre Eduaroo" dice que las actividades se elaboran con ayuda de IA** (el repositorio lo indica: `meta.generator`/`model`, `reviewed: false`). Es honesto y recomendable, pero es decisión del equipo publicarlo: `lib/seo/info-content.ts`.
10. **Política de privacidad**: el texto existente describe la app "Eduaroo: Tablas de Multiplicar" (AdMob, paquete Android), no esta web. No he escrito texto legal; sigue `noindex`.
11. **Sin datos de volumen/competencia**: `KEYWORD_MAP.md` y el plan de contenido son cualitativos.
12. **Textos de los juegos**: cada juego tiene ahora ~280-350 palabras en el HTML (cómo se juega, qué se practica, consejos y enlaces a temas de repaso y a otros juegos), redactadas contra el código de cada juego (`lib/seo/game-content.ts`). Conviene que alguien del equipo las lea; si cambia una mecánica, hay que actualizar el texto. En `calculate-target` se quitó `body { overflow: hidden }` para poder llegar al texto.
13. **ISR / `revalidate`**: no aplica; las páginas son estáticas y el contenido cambia con cada despliegue. `priority` en imágenes: el LCP es texto, no hay imagen LCP.
14. **Dependencias de desarrollo nuevas**: `cheerio` (rastreo) y `vitest`. Nada de terceros en producción.

## 5. Pendientes que requieren al equipo

| Pendiente | Dónde / cómo |
|---|---|
| Cambiar la redirección apex → www de **307 a 301/308** en Vercel (Domains) y evitar el doble salto `http://eduaroo.com` → `https://eduaroo.com` → `https://www…` | Panel del dominio |
| Verificar el sitio en **Search Console** (propiedad de dominio) y **Bing Webmaster** | Variables `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` en el hosting |
| Enviar `https://www.eduaroo.com/sitemap.xml` en ambos (ver §7) | GSC / Bing |
| Clave IndexNow (opcional) | `INDEXNOW_KEY` en el hosting y como secreto de GitHub |
| Analítica sin cookies (opcional) | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`; los clics a temas ya llevan `plausible-event-name=Resource+click` |
| Cuenta de X/Twitter si existe (`twitter:site`) y perfiles para `sameAs` de Organization | `lib/seo/site.ts`, `HomeSeo.tsx` |
| **Icono maestro ≥ 1024 px** (el actual mide 258×260; los 192/512 son ampliaciones) y revisar las **imágenes OG** (plantilla genérica) | `scripts/seo/generate-icons.mjs`, `lib/seo/og.tsx` |
| Revisión de "Sobre Eduaroo" y "Contacto" (autoría, responsable pedagógico, si se publica el uso de IA) | `lib/seo/info-content.ts` |
| Reescribir la política de privacidad para la web y para público infantil (revisión legal) | `app/[locale]/politica-de-privacidad` |
| Revisión docente de los bloques (`meta.reviewed` es `false` en todos) y, si existe, mostrar quién revisó | datos de `content/activities` |
| Confirmar el enlace al BOE (RD 157/2022) y, si procede, añadir decretos autonómicos | `lib/seo/lomloe.ts` |
| Traducción al inglés completa → activar `englishIndexable` | ver §4.5 |
| Decidir qué hacer con `/blog`, `/mascota` (hoy `noindex`, sin enlaces) | — |
| `app-ads.txt` en un sitio infantil: confirmar que sigue siendo necesario | `public/app-ads.txt` |

## 6. Cómo validar

```bash
pnpm build && pnpm start -p 3111
pnpm test                      # vitest: slugs, rutas legacy, redirects, plantillas
pnpm seo:check                 # 0 P0: metadata, h1, canonical, JSON-LD, sitemap, enlaces, 404, redirects
node scripts/seo/validate-jsonld.mjs --base http://localhost:3111
npx lighthouse http://localhost:3111/primaria/3-primaria --preset=perf --form-factor=mobile
```

- **Datos estructurados:** pega una URL de un tema y de un hub en el [Rich Results Test](https://search.google.com/test/rich-results) y en el [validador de Schema.org](https://validator.schema.org). `LearningResource` y `BreadcrumbList` se validan en Schema.org; Google solo da rich result a `BreadcrumbList` (los recursos educativos no tienen aspecto enriquecido propio, el valor es semántico).
- **HTML sin JS:** `curl -s https://www.eduaroo.com/primaria/3-primaria | grep -c "<h1"` y comprobar que el texto del hub aparece.
- **Redirects:** `curl -sI https://www.eduaroo.com/es/learning/3/mates` debe dar un 301 y el siguiente salto un 200.

## 7. Solicitar indexación de los hubs

1. Search Console → Sitemaps → añadir `sitemap.xml`. Bing Webmaster → Sitemaps → igual (o importar desde GSC).
2. Inspección de URLs → **solicitar indexación** de, por este orden: `/`, `/primaria`, los 6 hubs de curso (`/primaria/{n}-primaria`) y 4–5 hubs de asignatura prioritarios (p. ej. Matemáticas y Lengua de 3º–4º). Google limita las solicitudes manuales: el resto llegará por el sitemap y los enlaces internos.
3. A las 2–3 semanas: Informe de páginas → comprobar "Indexada" vs "Rastreada, actualmente sin indexar" por plantilla (curso, asignatura, tema). Si los temas quedan sin indexar, reforzar texto y enlaces antes de crear más.
4. A las 4–6 semanas: Rendimiento → consultas por página y contraste con `KEYWORD_MAP.md`.

## 8. Plan de contenido a 90 días

Sin datos de volumen ni competencia: prioridad por (a) intención gratuita clara, (b) lo que el contenido ya cubre, (c) coherencia con el alcance del producto (portal de práctica para niños; sin informes para docentes). Contrastar con Search Console a las 4–6 semanas.

| Semanas | Qué | Por qué |
|---|---|---|
| 1–2 | Desplegar, verificar, enviar sitemap, medir CWV de campo. Revisar títulos/descriptions de los 6 hubs de curso con los primeros datos de impresiones. | Sin medir no se puede priorizar. |
| 3–6 | **Fichas imprimibles (PDF)** de los temas ya publicados, empezando por Matemáticas y Lengua de 2º–4º (más demanda genérica de "fichas"), con página de descarga por asignatura y curso y evento `Ficha+download`. | Es la búsqueda más habitual y hoy no hay recurso que la satisfaga. |
| 5–8 | Completar **Sociales e Inglés de 3º–4º** (prioridad ya decidida) y revisar la duplicidad de nombres entre cursos. | Cierra huecos de cobertura en asignaturas con menos temas por curso. |
| 7–10 | Vista **"con soluciones"** por tema (explicaciones visibles en el HTML) y 2–3 páginas de **modelo de examen** indexables por asignatura (hoy `examen` es herramienta noindex). | Capturan "con soluciones" y "examen {asignatura} {n}º". |
| 9–12 | **Repaso de verano** por curso (itinerario de 4–6 semanas con temas ya publicados) publicado antes de mayo–junio. | Estacional: hay que estar indexado antes del pico. |

Competencia estimada (a validar): "fichas de matemáticas {n}º primaria" y "ejercicios de {asignatura} {n}º primaria" son muy disputadas (grandes editoriales y portales de fichas); conviene ganar primero la cola larga por tema ("{tema} {n}º primaria") donde los 238 bloques ya compiten con contenido más específico.
