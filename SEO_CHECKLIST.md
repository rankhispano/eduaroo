# SEO_CHECKLIST · Antes de publicar una página o un recurso nuevo

Marca cada punto en la descripción del PR. El CI (`pnpm seo:check`) comprueba la mayoría; lo marcado con 👀 lo revisa una persona.

## Metadata
- [ ] **Title** de 30–60 caracteres, único, con el tema + curso (y marca si cabe). Sale de `lib/seo/templates.ts` o de `staticPages` (`lib/seo/pages.ts`); no escribir `<title>` a mano.
- [ ] **Description** de 120–158 caracteres, única, con beneficio + palabra clave + llamada suave. 👀 Sin relleno de palabras clave.
- [ ] Metadata construida con `buildMetadata()` (canonical autorreferente, Open Graph y Twitter completos, imagen 1200×630 con alt).
- [ ] `noindex` solo si es una página personal, de demostración o sin contenido propio. Si es noindex: fuera del sitemap.

## Contenido
- [ ] Un único **h1**, con la palabra clave principal de `KEYWORD_MAP.md`; h2/h3 jerárquicos. 👀
- [ ] Texto introductorio propio antes de los listados (hubs: 120–250 palabras). 👀
- [ ] "Actualizado el" visible y fecha real en datos (`meta.generatedAt`, nunca `new Date()`).
- [ ] "LOMLOE" solo si el recurso trabaja criterios del RD 157/2022. 👀 Sin afirmaciones legales sin fuente.
- [ ] Una palabra clave principal = una URL (sin canibalizar otra). Actualizar `KEYWORD_MAP.md`.

## Estructura y enlaces
- [ ] URL con la jerarquía `/primaria/{n}-primaria/{asignatura}/{tema}` (usar `lib/seo/urls.ts`); si se cambia una URL, 301 en `lib/seo/redirects.ts` y fila en `URL_MAP.md`.
- [ ] Migas visibles (`BreadcrumbNav`) con `BreadcrumbList`.
- [ ] Enlaza al hub de la asignatura y al del curso, y a recursos relacionados con anchor descriptivo (nunca "ver más").
- [ ] Alcanzable en ≤ 3 clics desde la home y con enlaces entrantes (no huérfana).
- [ ] Enlaces externos a fuentes oficiales con `rel="noopener noreferrer"`.

## Datos estructurados
- [ ] JSON-LD servido en el HTML: `BreadcrumbList` + `LearningResource` (recursos) o `CollectionPage` (hubs). `node scripts/seo/validate-jsonld.mjs --base <url>` sin problemas.
- [ ] Probar una URL en el [Rich Results Test](https://search.google.com/test/rich-results) y en el [validador de Schema.org](https://validator.schema.org).
- [ ] No marcar FAQPage por rich results ni reviews/ratings que no existan.

## Imágenes y rendimiento
- [ ] `next/image` con `alt` descriptivo (o `alt=""` si es decorativa), `width`/`height` o `sizes`, `priority` solo en la imagen LCP.
- [ ] Nombres de archivo descriptivos; WebP/AVIF; sin imágenes de texto.
- [ ] Sin scripts de terceros nuevos ni trackers (sitio infantil). 👀

## Verificación local
```bash
pnpm build && pnpm start -p 3111
pnpm test && pnpm seo:check     # 0 P0
```
