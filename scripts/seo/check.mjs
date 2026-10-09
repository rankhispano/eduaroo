#!/usr/bin/env node
// Comprobaciones SEO de CI sobre el HTML servido (build de producción en marcha). Falla (exit 1) con P0.
//   node scripts/seo/check.mjs --base http://localhost:3000
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { extractJsonLd, validateNodes } from './validate-jsonld.mjs';

const base = (process.argv[process.argv.indexOf('--base') + 1] ?? 'http://localhost:3000').replace(/\/$/, '');
const SITE = 'https://www.eduaroo.com';

const out = join(mkdtempSync(join(tmpdir(), 'seo-check-')), 'crawl');
execFileSync('node', ['scripts/seo/crawl.mjs', '--base', base, '--out', out], { stdio: ['ignore', 'ignore', 'inherit'] });
const { rows, broken } = JSON.parse(readFileSync(`${out}.json`, 'utf8'));

const p0 = [];
const p1 = [];

// --- sitemap y robots -------------------------------------------------------------------------------
const sitemapXml = await (await fetch(`${base}/sitemap.xml`)).text();
const sitemapPaths = new Set([...sitemapXml.matchAll(/<loc>https:\/\/www\.eduaroo\.com([^<]*)<\/loc>/g)].map((m) => m[1] || '/'));
if (sitemapPaths.size === 0) p0.push('sitemap.xml vacío o con URLs que no son del host canónico');
const robots = await (await fetch(`${base}/robots.txt`)).text();
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) p0.push('robots.txt no declara el sitemap canónico');
if (/Disallow:\s*\/_next/.test(robots)) p0.push('robots.txt bloquea /_next');

const byPath = new Map(rows.map((r) => [r.path, r]));
const indexable = rows.filter((r) => r.status === 200 && r.contentType.includes('text/html') && !/noindex/.test(r.robots));

// --- reglas por página ------------------------------------------------------------------------------
const seenTitles = new Map();
const seenDescriptions = new Map();
for (const r of indexable) {
    const where = r.path;
    if (!sitemapPaths.has(r.path)) p0.push(`${where}: indexable pero no está en el sitemap`);
    if (r.titleLen < 30 || r.titleLen > 60) p0.push(`${where}: title de ${r.titleLen} caracteres (30–60)`);
    if (r.descLen < 120 || r.descLen > 158) p0.push(`${where}: description de ${r.descLen} caracteres (120–158)`);
    if (seenTitles.has(r.title)) p0.push(`${where}: title duplicado con ${seenTitles.get(r.title)}`);
    if (seenDescriptions.has(r.description)) p0.push(`${where}: description duplicada con ${seenDescriptions.get(r.description)}`);
    seenTitles.set(r.title, where);
    seenDescriptions.set(r.description, where);
    if (r.h1Count !== 1) p0.push(`${where}: ${r.h1Count} h1 (debe haber uno)`);
    if (!r.canonical.startsWith(`${SITE}/`) && r.canonical !== SITE) p0.push(`${where}: canonical ausente o no absoluta ("${r.canonical}")`);
    else if (r.canonical !== SITE + (r.path === '/' ? '' : r.path) && r.canonical !== `${SITE}/`) p0.push(`${where}: canonical no autorreferente (${r.canonical})`);
    if (r.xRobotsTag && /noindex/i.test(r.xRobotsTag)) p0.push(`${where}: cabecera X-Robots-Tag noindex`);
    if (r.og < 6 || r.twitter < 4 || !r.ogImage) p0.push(`${where}: Open Graph/Twitter incompletos`);
    if (r.hreflang > 0) p0.push(`${where}: hreflang emitido sin contenido en más de un idioma`);
    if (r.imgNoAlt > 0) p0.push(`${where}: ${r.imgNoAlt} imágenes sin atributo alt`);
    if (r.words < 80) p1.push(`${where}: solo ${r.words} palabras visibles en el HTML servido`);
}

// URLs del sitemap: todas 200, indexables y sin redirects
for (const path of sitemapPaths) {
    const r = byPath.get(path);
    if (!r) p0.push(`${path}: está en el sitemap y no se pudo rastrear`);
    else if (r.status !== 200) p0.push(`${path}: está en el sitemap y responde ${r.status}`);
    else if (/noindex/.test(r.robots)) p0.push(`${path}: está en el sitemap y es noindex`);
}

// --- JSON-LD, enlaces rotos, 404 reales ---------------------------------------------------------------
for (const r of indexable) {
    const html = await (await fetch(base + r.path)).text();
    const { nodes, problems } = await extractJsonLd(html);
    for (const problem of [...problems, ...validateNodes(nodes, r.path)]) p0.push(`${r.path}: JSON-LD: ${problem}`);
    if (!nodes.some((n) => n['@type'] === 'BreadcrumbList') && r.path !== '/') p0.push(`${r.path}: sin BreadcrumbList`);
}
for (const b of broken) p0.push(`enlace interno roto: ${b.path} (${b.status})`);

for (const path of ['/esta-ruta-no-existe', '/primaria/9-primaria', '/primaria/3-primaria/matematicas/tema-inexistente']) {
    const status = (await fetch(base + path, { redirect: 'manual' })).status;
    if (status !== 404) p0.push(`${path}: debería responder 404 real y responde ${status}`);
}

// --- redirects antiguos: un solo salto, sin bucles ----------------------------------------------------
const legacy = {
    '/es': '/',
    '/es/learning': '/primaria',
    '/es/learning/3': '/primaria/3-primaria',
    '/es/learning/3/mates': '/primaria/3-primaria/matematicas',
    '/es/learning/3/mates/decimales-decimas': '/primaria/3-primaria/matematicas/decimales-decimas',
    '/repaso/3/mates': '/primaria/3-primaria/matematicas',
    '/es/games/astro-type': '/juegos/astro-type',
    '/es/privacy': '/politica-de-privacidad',
};
for (const [from, to] of Object.entries(legacy)) {
    const first = await fetch(base + from, { redirect: 'manual' });
    const location = first.headers.get('location')?.replace(/^https?:\/\/[^/]+/, '');
    if (first.status !== 301 || location !== to) p0.push(`${from}: debería dar 301 a ${to} y da ${first.status} → ${location}`);
    else if ((await fetch(base + to, { redirect: 'manual' })).status !== 200) p0.push(`${to}: destino de redirect no responde 200`);
}

// --- salida -----------------------------------------------------------------------------------------
console.log(`Páginas indexables: ${indexable.length} · URLs en el sitemap: ${sitemapPaths.size}`);
for (const msg of p1) console.log(`P1 ${msg}`);
for (const msg of p0) console.log(`P0 ${msg}`);
console.log(`Resultado: ${p0.length} P0, ${p1.length} P1`);
if (p0.length > 0) process.exit(1);
