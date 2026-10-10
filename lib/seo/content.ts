// Lectura en servidor de los metadatos reales de cada bloque de actividades (content/activities).
// La fecha de última modificación sale de meta.generatedAt del propio JSON: nunca de new Date().

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getActivitySets } from '@/content/activities/registry';
import type { ActivitySetSummary } from '@/lib/curriculum/types';
import type { SiteLocale } from './site';

export interface ActivityPage extends ActivitySetSummary {
    lastModified: Date;
}

const cache = new Map<SiteLocale, Promise<ActivityPage[]>>();

async function readLastModified(locale: SiteLocale, key: string): Promise<Date> {
    const file = path.join(process.cwd(), 'content', 'activities', ...(locale === 'en' ? ['en'] : []), `${key}.json`);
    const raw = JSON.parse(await readFile(file, 'utf8')) as { meta?: { generatedAt?: string } };
    const generatedAt = raw.meta?.generatedAt;
    if (!generatedAt || Number.isNaN(Date.parse(generatedAt))) {
        throw new Error(`Falta meta.generatedAt en ${key} (${locale}): no se puede calcular lastmod real`);
    }
    return new Date(generatedAt);
}

export function getActivityPages(locale: SiteLocale = 'es'): Promise<ActivityPage[]> {
    let pages = cache.get(locale);
    if (!pages) {
        pages = Promise.all(getActivitySets(locale).map(async (set) => ({ ...set, lastModified: await readLastModified(locale, set.key) })));
        cache.set(locale, pages);
    }
    return pages;
}

export const latest = (dates: Date[]): Date => new Date(Math.max(...dates.map((d) => d.getTime())));
