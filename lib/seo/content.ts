// Lectura en servidor de los metadatos reales de cada bloque de actividades (content/activities).
// La fecha de última modificación sale de meta.generatedAt del propio JSON: nunca de new Date().

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ACTIVITY_SETS } from '@/content/activities/registry';
import type { ActivitySetSummary } from '@/lib/curriculum/types';

export interface ActivityPage extends ActivitySetSummary {
    lastModified: Date;
}

let cache: Promise<ActivityPage[]> | undefined;

async function readLastModified(key: string): Promise<Date> {
    const file = path.join(process.cwd(), 'content', 'activities', `${key}.json`);
    const raw = JSON.parse(await readFile(file, 'utf8')) as { meta?: { generatedAt?: string } };
    const generatedAt = raw.meta?.generatedAt;
    if (!generatedAt || Number.isNaN(Date.parse(generatedAt))) {
        throw new Error(`Falta meta.generatedAt en ${key}: no se puede calcular lastmod real`);
    }
    return new Date(generatedAt);
}

// Los bloques de actividades están en español; las páginas /en no son indexables (ver site.ts)
export function getActivityPages(): Promise<ActivityPage[]> {
    cache ??= Promise.all(ACTIVITY_SETS.map(async (set) => ({ ...set, lastModified: await readLastModified(set.key) })));
    return cache;
}

export const latest = (dates: Date[]): Date => new Date(Math.max(...dates.map((d) => d.getTime())));
