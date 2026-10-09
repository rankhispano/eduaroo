// Compatibilidad: el código de la app todavía enlaza con rutas "lógicas" antiguas
// (/learning/3/mates/..., /games, /privacy). Estas funciones las traducen a la URL pública
// (/primaria/3-primaria/matematicas/..., /juegos, /politica-de-privacidad) y al revés, de modo que
// ningún enlace interno apunte a una URL que luego redirige. Se usan desde i18n/navigation.ts.
import { asignaturaSlug, cursoSlug, parseAsignaturaSlug, parseCursoSlug } from './slugs';

const SIMPLE: [logical: string, publicPath: string][] = [
    ['/games', '/juegos'],
    ['/privacy', '/politica-de-privacidad'],
    ['/terms', '/terminos'],
];

const startsWithSegment = (path: string, base: string) => path === base || path.startsWith(`${base}/`);

export function toPublicPath(path: string): string {
    for (const [logical, pub] of SIMPLE) {
        if (startsWithSegment(path, logical)) return pub + path.slice(logical.length);
    }
    if (path === '/learning') return '/primaria';
    const match = /^\/learning\/([1-6])(?:\/([^/]+))?(\/.*)?$/.exec(path);
    if (match) {
        const [, curso, asignatura, rest = ''] = match;
        return `/primaria/${cursoSlug(curso)}${asignatura ? `/${asignaturaSlug(asignatura)}` : ''}${rest}`;
    }
    return path;
}

export function toLogicalPath(path: string): string {
    for (const [logical, pub] of SIMPLE) {
        if (startsWithSegment(path, pub)) return logical + path.slice(pub.length);
    }
    if (path === '/primaria') return '/learning';
    const match = /^\/primaria\/([^/]+)(?:\/([^/]+))?(\/.*)?$/.exec(path);
    const curso = match && parseCursoSlug(match[1]);
    if (match && curso) {
        const [, , asignatura, rest = ''] = match;
        const id = asignatura ? (parseAsignaturaSlug(asignatura) ?? asignatura) : undefined;
        return `/learning/${curso}${id ? `/${id}` : ''}${rest}`;
    }
    return path;
}

/** Aplica toPublicPath a un href de <Link> conservando query y hash */
export function toPublicHref<T>(href: T): T {
    if (typeof href === 'string') {
        const index = href.search(/[?#]/);
        const path = index === -1 ? href : href.slice(0, index);
        return (toPublicPath(path) + (index === -1 ? '' : href.slice(index))) as T;
    }
    if (href && typeof href === 'object' && 'pathname' in href && typeof href.pathname === 'string') {
        return { ...href, pathname: toPublicPath(href.pathname) } as T;
    }
    return href;
}
