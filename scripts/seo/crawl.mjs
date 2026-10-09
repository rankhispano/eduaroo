#!/usr/bin/env node
// Rastreo SEO del HTML servido (sin JS). Uso:
//   node scripts/seo/crawl.mjs --base http://localhost:3000 [--routes sitemap|known] [--out seo-audit]
// Genera <out>.csv y <out>.json con title, description, h1, canonical, robots, og/twitter,
// JSON-LD, enlaces internos, palabras visibles, imágenes sin alt y estado de los enlaces internos.
import { readdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import * as cheerio from 'cheerio';

const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i].replace(/^--/, ''), process.argv[i + 1]);
const BASE = (args.get('base') ?? 'http://localhost:3000').replace(/\/$/, '');
const MODE = args.get('routes') ?? 'known';
const OUT = args.get('out') ?? 'seo-audit';
const CONCURRENCY = 8;

function walk(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
        d.isDirectory() ? walk(join(dir, d.name)) : d.name.endsWith('.json') ? [join(dir, d.name)] : [],
    );
}

function walkPages(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
        d.isDirectory() ? walkPages(join(dir, d.name)) : d.name === 'page.tsx' ? [join(dir, d.name)] : [],
    );
}

// Rutas públicas conocidas a partir del repositorio (ficheros de content/activities + páginas estáticas)
function knownRoutes() {
    const root = 'content/activities';
    const sets = { es: [], en: [] };
    for (const file of walk(root)) {
        const rel = relative(root, file).replace(/\.json$/, '').split('/');
        if (rel[0] === 'en') sets.en.push(rel.slice(1).join('/'));
        else sets.es.push(rel.join('/'));
    }
    const routes = new Set(['/', '/repaso', '/politica-de-privacidad', '/robots.txt', '/sitemap.xml']);
    for (const locale of ['es', 'en']) {
        for (const p of ['', '/learning', '/games', '/kids', '/parents', '/teachers', '/blog', '/privacy', '/terms', '/mascota', '/pegatinas']) {
            routes.add(`/${locale}${p}`);
        }
        for (const g of ['astro-type', 'bitblox', 'calculate-target', 'cyber-segments', 'galaxy-math-fuel', 'geominds', 'syllable-quest', 'tictac', 'wordsearch']) {
            routes.add(`/${locale}/games/${g}`);
        }
        const cursos = new Set();
        const asignaturas = new Set();
        for (const key of sets[locale]) {
            const [c, a] = key.split('/');
            cursos.add(c);
            asignaturas.add(`${c}/${a}`);
            routes.add(`/${locale}/learning/${key}`);
        }
        for (const c of ['1', '2', '3', '4', '5', '6']) cursos.add(c);
        for (const c of cursos) routes.add(`/${locale}/learning/${c}`);
        for (const a of asignaturas) {
            routes.add(`/${locale}/learning/${a}`);
            routes.add(`/${locale}/learning/${a}/examen`);
        }
    }
    // Ejercicios heredados: app/[locale]/learning/{math,language}/**/page.tsx
    for (const file of walkPages('app/[locale]/learning')) {
        const path = relative('app/[locale]', file).replace(/\/page\.tsx$/, '');
        if (/^learning\/(math|language)(\/|$)/.test(path)) {
            for (const locale of ['es', 'en']) routes.add(`/${locale}/${path}`);
        }
    }
    for (const c of ['1', '2', '3', '4', '5', '6']) {
        routes.add(`/repaso/${c}`);
        for (const a of ['lengua', 'mates', 'naturales', 'sociales', 'ingles']) routes.add(`/repaso/${c}/${a}`);
    }
    return [...routes].sort();
}

async function sitemapRoutes() {
    const res = await fetch(`${BASE}/sitemap.xml`);
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const urls = [];
    for (const loc of locs) {
        if (/sitemap[^/]*\.xml$/.test(loc) && loc !== `${BASE}/sitemap.xml` && !loc.includes('eduaroo.com/es')) {
            const sub = await (await fetch(loc.replace(/^https?:\/\/[^/]+/, BASE))).text();
            urls.push(...[...sub.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
        } else urls.push(loc);
    }
    return urls.map((u) => new URL(u).pathname + new URL(u).search);
}

async function fetchPage(path) {
    const res = await fetch(BASE + path, { redirect: 'manual', headers: { 'user-agent': 'eduaroo-seo-audit' } });
    const body = res.status >= 300 && res.status < 400 ? '' : await res.text();
    return { status: res.status, location: res.headers.get('location') ?? '', headers: res.headers, body };
}

function analyse(path, page) {
    const row = {
        path,
        status: page.status,
        redirect: page.location,
        contentType: page.headers.get('content-type') ?? '',
        xRobotsTag: page.headers.get('x-robots-tag') ?? '',
        title: '', titleLen: 0, description: '', descLen: 0, h1Count: 0, h1: '', h2Count: 0,
        canonical: '', robots: '', hreflang: 0, og: 0, ogImage: '', twitter: 0, jsonLd: 0, jsonLdTypes: '',
        internalLinks: 0, words: 0, imgNoAlt: 0, lang: '',
    };
    const links = [];
    if (!row.contentType.includes('text/html') || !page.body) return { row, links };
    const $ = cheerio.load(page.body);
    row.lang = $('html').attr('lang') ?? '';
    row.title = $('head > title').first().text().trim();
    row.titleLen = [...row.title].length;
    row.description = ($('meta[name="description"]').attr('content') ?? '').trim();
    row.descLen = [...row.description].length;
    row.h1Count = $('h1').length;
    row.h1 = $('h1').first().text().replace(/\s+/g, ' ').trim();
    row.h2Count = $('h2').length;
    row.canonical = $('link[rel="canonical"]').attr('href') ?? '';
    row.robots = $('meta[name="robots"]').attr('content') ?? '';
    row.hreflang = $('link[rel="alternate"][hreflang]').length;
    row.og = $('meta[property^="og:"]').length;
    row.ogImage = $('meta[property="og:image"]').attr('content') ?? '';
    row.twitter = $('meta[name^="twitter:"]').length;
    const types = [];
    $('script[type="application/ld+json"]').each((_, el) => {
        row.jsonLd += 1;
        try {
            const data = JSON.parse($(el).text());
            for (const node of Array.isArray(data) ? data : data['@graph'] ?? [data]) types.push(node['@type']);
        } catch {
            types.push('INVALID');
        }
    });
    row.jsonLdTypes = types.join('|');
    row.imgNoAlt = $('img').filter((_, el) => $(el).attr('alt') === undefined).length;
    $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (!href || href.startsWith('#') || /^(mailto|tel|javascript):/.test(href)) return;
        try {
            const url = new URL(href, BASE + path);
            if (url.origin === BASE || url.hostname.endsWith('eduaroo.com')) {
                links.push({ href: url.pathname + url.search, text: $(el).text().replace(/\s+/g, ' ').trim() });
            }
        } catch { /* ignorar href inválido */ }
    });
    row.internalLinks = new Set(links.map((l) => l.href)).size;
    $('script, style, template, noscript, svg').remove();
    row.words = $('body').text().split(/\s+/).filter(Boolean).length;
    return { row, links };
}

async function pool(items, fn) {
    const results = new Array(items.length);
    let next = 0;
    await Promise.all(
        Array.from({ length: CONCURRENCY }, async () => {
            while (next < items.length) {
                const i = next++;
                results[i] = await fn(items[i]);
            }
        }),
    );
    return results;
}

const routes = MODE === 'sitemap' ? await sitemapRoutes() : knownRoutes();
console.error(`Rastreando ${routes.length} rutas en ${BASE} (${MODE})`);
const crawled = await pool(routes, async (path) => ({ path, ...analyse(path, await fetchPage(path)) }));

// Enlaces entrantes (huérfanas) y enlaces internos rotos
const inbound = new Map(routes.map((r) => [r, new Set()]));
const targets = new Set();
for (const { path, links } of crawled) {
    for (const { href } of links) {
        const clean = href.split('?')[0].replace(/\/$/, '') || '/';
        targets.add(clean);
        if (clean !== path) inbound.get(clean)?.add(path);
    }
}
const known = new Set(routes);
const toCheck = [...targets].filter((t) => !known.has(t));
const extra = await pool(toCheck, async (path) => ({ path, status: (await fetchPage(path)).status }));
const broken = extra.filter((e) => e.status >= 400 || e.status === 0);
const redirects = extra.filter((e) => e.status >= 300 && e.status < 400);

const columns = ['path', 'status', 'redirect', 'xRobotsTag', 'lang', 'title', 'titleLen', 'description', 'descLen', 'h1Count', 'h1', 'h2Count', 'canonical', 'robots', 'hreflang', 'og', 'ogImage', 'twitter', 'jsonLd', 'jsonLdTypes', 'internalLinks', 'words', 'imgNoAlt'];
const csv = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const rows = crawled.map((c) => ({ ...c.row, inbound: inbound.get(c.path)?.size ?? 0 }));
writeFileSync(`${OUT}.csv`, [[...columns, 'inbound'].join(','), ...rows.map((r) => [...columns, 'inbound'].map((k) => csv(r[k])).join(','))].join('\n'));
writeFileSync(`${OUT}.json`, JSON.stringify({ base: BASE, rows, broken, redirects }, null, 2));
console.error(`CSV: ${OUT}.csv · enlaces rotos: ${broken.length} · enlaces a redirects: ${redirects.length}`);
