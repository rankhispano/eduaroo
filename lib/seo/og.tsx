// Imágenes Open Graph 1200×630 generadas con next/og: marca Eduaroo, texto legible y sin
// dependencias externas (el icono se lee del disco en el build).
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

interface OgContent {
    kicker: string;
    title: string;
    subtitle?: string;
    accent?: string;
}

let logo: Promise<string> | undefined;
const getLogo = () => {
    logo ??= readFile(path.join(process.cwd(), 'public', 'icons', 'icon-192.png')).then(
        (buffer) => `data:image/png;base64,${buffer.toString('base64')}`,
    );
    return logo;
};

export async function renderOg({ kicker, title, subtitle, accent = '#f97316' }: OgContent) {
    const logoSrc = await getLogo();
    const titleSize = title.length > 60 ? 56 : title.length > 36 ? 68 : 80;

    return new ImageResponse(
        (
            <div style={{ width: '100%', height: '100%', display: 'flex', background: 'linear-gradient(135deg, #7DD3FC 0%, #E0F2FE 100%)', padding: 48 }}>
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        background: '#ffffff',
                        borderRadius: 36,
                        borderLeft: `20px solid ${accent}`,
                        padding: '48px 56px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logoSrc} width={72} height={72} alt="" style={{ borderRadius: 16 }} />
                        <div style={{ display: 'flex', fontSize: 40, fontWeight: 800, color: '#0f172a' }}>Eduaroo</div>
                        <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: '#475569', marginLeft: 12 }}>{kicker}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'flex', fontSize: titleSize, fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{title}</div>
                        {subtitle ? <div style={{ display: 'flex', fontSize: 34, color: '#334155', lineHeight: 1.25 }}>{subtitle}</div> : null}
                    </div>
                    <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: accent }}>www.eduaroo.com</div>
                </div>
            </div>
        ),
        ogSize,
    );
}

// --- Contenido por tipo de página --------------------------------------------------------------

import { getCatalogAsignatura, getCatalogCurso } from './catalog';
import type { SiteLocale } from './site';

const esLocale = (locale: SiteLocale) => locale === 'es';

export function renderHomeOg(locale: SiteLocale) {
    const es = esLocale(locale);
    return renderOg({
        kicker: es ? 'Repaso de Primaria' : 'Primary revision',
        title: es ? 'Recursos de repaso de Primaria, 1º a 6º' : 'Primary school revision, years 1 to 6',
        subtitle: es ? 'Ejercicios por curso y asignatura según la LOMLOE' : 'Exercises by year and subject, aligned with the LOMLOE',
    });
}

export async function renderCursoOg(locale: SiteLocale, curso: string) {
    const data = getCatalogCurso(curso, locale);
    if (!data) return null;
    const es = esLocale(locale);
    return renderOg({
        kicker: es ? 'Repaso de Primaria · LOMLOE' : 'Primary revision · LOMLOE',
        title: es ? `${data.grade}º de Primaria` : `Primary ${data.grade}`,
        subtitle: data.asignaturas.map((a) => a.asignatura.nombre).join(' · '),
    });
}

export async function renderAsignaturaOg(locale: SiteLocale, curso: string, asignatura: string) {
    const c = getCatalogCurso(curso, locale);
    const a = getCatalogAsignatura(curso, asignatura, locale);
    if (!c || !a) return null;
    const es = esLocale(locale);
    return renderOg({
        kicker: es ? `${c.grade}º de Primaria · LOMLOE` : `Primary ${c.grade} · LOMLOE`,
        title: a.asignatura.nombre,
        subtitle: es ? `${a.published.length} temas · ${a.activityCount} actividades` : `${a.published.length} topics · ${a.activityCount} activities`,
        accent: a.asignatura.color,
    });
}
