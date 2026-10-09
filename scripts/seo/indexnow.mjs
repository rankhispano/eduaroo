#!/usr/bin/env node
// Avisa a Bing/Yandex (IndexNow) de las URLs del sitemap tras un despliegue.
//   INDEXNOW_KEY=... node scripts/seo/indexnow.mjs [--site https://www.eduaroo.com]
// La clave no se guarda en el repositorio: va en un secreto de CI y en la variable INDEXNOW_KEY del hosting
// (la ruta /indexnow-key.txt la publica para que IndexNow pueda verificarla).
const key = process.env.INDEXNOW_KEY;
const site = (process.argv[process.argv.indexOf('--site') + 1] ?? 'https://www.eduaroo.com').replace(/\/$/, '');

if (!key) {
    console.log('INDEXNOW_KEY no definida: se omite el aviso a IndexNow.');
    process.exit(0);
}

const sitemap = await (await fetch(`${site}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/indexnow-key.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} URLs enviadas · HTTP ${response.status}`);
if (!response.ok && response.status !== 202) process.exit(1);
