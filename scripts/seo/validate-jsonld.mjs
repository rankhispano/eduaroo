#!/usr/bin/env node
// Valida el JSON-LD del HTML servido: que parsea y que lleva los campos obligatorios de cada tipo.
//   node scripts/seo/validate-jsonld.mjs --base http://localhost:3000
// Para validación semántica completa, pega la URL en https://search.google.com/test/rich-results
// y https://validator.schema.org (ver SEO_REPORT.md).
import * as cheerio from 'cheerio';

const base = (process.argv[process.argv.indexOf('--base') + 1] ?? 'http://localhost:3000').replace(/\/$/, '');

const REQUIRED = {
    Organization: ['name', 'url', 'logo'],
    WebSite: ['name', 'url', 'inLanguage'],
    BreadcrumbList: ['itemListElement'],
    CollectionPage: ['name', 'url', 'inLanguage'],
    LearningResource: ['name', 'description', 'url', 'inLanguage', 'educationalLevel', 'learningResourceType', 'teaches', 'audience', 'isAccessibleForFree', 'datePublished', 'dateModified', 'publisher'],
};

export function validateNodes(nodes, where) {
    const problems = [];
    for (const node of nodes) {
        const type = node['@type'];
        const required = REQUIRED[type];
        if (!required) continue;
        for (const field of required) {
            if (node[field] === undefined || node[field] === '' || (Array.isArray(node[field]) && node[field].length === 0)) {
                problems.push(`${where}: ${type} sin "${field}"`);
            }
        }
        if (type === 'BreadcrumbList') {
            node.itemListElement?.forEach((item, i) => {
                if (item.position !== i + 1 || !item.name) problems.push(`${where}: BreadcrumbList posición/nombre incorrectos en ${i + 1}`);
            });
        }
        for (const field of ['datePublished', 'dateModified']) {
            if (node[field] && Number.isNaN(Date.parse(node[field]))) problems.push(`${where}: ${type}.${field} no es una fecha válida`);
        }
    }
    return problems;
}

export async function extractJsonLd(html) {
    const $ = cheerio.load(html);
    const nodes = [];
    const problems = [];
    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const data = JSON.parse($(el).text());
            if (data['@context'] !== 'https://schema.org') problems.push('@context distinto de https://schema.org');
            nodes.push(...(data['@graph'] ?? [data]));
        } catch (error) {
            problems.push(`JSON-LD no parsea: ${error.message}`);
        }
    });
    return { nodes, problems };
}

async function main() {
    const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
    const urls = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1]);
    const all = [];
    let checked = 0;
    for (const path of urls) {
        const html = await (await fetch(base + path)).text();
        const { nodes, problems } = await extractJsonLd(html);
        const types = nodes.map((n) => n['@type']);
        const isHub = /^\/primaria\/[^/]+(\/[^/]+)?$/.test(path);
        const isTema = /^\/primaria\/[^/]+\/[^/]+\/[^/]+$/.test(path);
        if (path === '/' && !(types.includes('Organization') && types.includes('WebSite'))) problems.push('home sin Organization + WebSite');
        if (path !== '/' && !types.includes('BreadcrumbList')) problems.push('sin BreadcrumbList');
        if (isHub && !types.includes('CollectionPage')) problems.push('hub sin CollectionPage');
        if (isTema && !types.includes('LearningResource')) problems.push('tema sin LearningResource');
        all.push(...problems.map((p) => `${path}: ${p}`), ...validateNodes(nodes, path));
        checked += 1;
    }
    console.log(`JSON-LD revisado en ${checked} URLs del sitemap · problemas: ${all.length}`);
    for (const problem of all.slice(0, 40)) console.log(` - ${problem}`);
    if (all.length > 0) process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
