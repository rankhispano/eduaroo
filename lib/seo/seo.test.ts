import { describe, expect, it } from 'vitest';
import { countWords, gameContent } from './game-content';
import { gameCatalog } from './games';
import { toLogicalPath, toPublicPath } from './legacy-paths';
import { legacyRedirects } from './redirects';
import { ASIGNATURA_SLUGS, parseAsignaturaSlug, parseCursoSlug } from './slugs';
import { validateGeneratedMetadata } from './validate';
import { paths } from './urls';

describe('slugs y rutas', () => {
    it('convierte ida y vuelta curso y asignatura', () => {
        expect(parseCursoSlug('3-primaria')).toBe('3');
        expect(parseCursoSlug('7-primaria')).toBeUndefined();
        for (const [id, slug] of Object.entries(ASIGNATURA_SLUGS)) expect(parseAsignaturaSlug(slug)).toBe(id);
    });

    it('las rutas lógicas antiguas se traducen a la URL pública y viceversa', () => {
        const cases: [string, string][] = [
            ['/learning', '/primaria'],
            ['/learning/3', '/primaria/3-primaria'],
            ['/learning/3/mates', '/primaria/3-primaria/matematicas'],
            ['/learning/6/sociales/la-constitucion-de-1978', '/primaria/6-primaria/ciencias-sociales/la-constitucion-de-1978'],
            ['/games', '/juegos'],
            ['/games/astro-type', '/juegos/astro-type'],
            ['/privacy', '/politica-de-privacidad'],
        ];
        for (const [logical, publicPath] of cases) {
            expect(toPublicPath(logical)).toBe(publicPath);
            expect(toLogicalPath(publicPath)).toBe(logical);
        }
        // Los ejercicios heredados no se tocan
        expect(toPublicPath('/learning/math/grade3/operations')).toBe('/learning/math/grade3/operations');
        // Idempotente: una ruta ya pública no cambia
        expect(toPublicPath('/primaria/3-primaria')).toBe('/primaria/3-primaria');
    });

    it('paths.* genera la jerarquía sin barra final', () => {
        expect(paths.tema('3', 'mates', 'decimales-decimas')).toBe('/primaria/3-primaria/matematicas/decimales-decimas');
        expect(paths.curso('1').endsWith('/')).toBe(false);
    });
});

describe('redirects', () => {
    const rules = legacyRedirects();

    it('todos son 301 y ningún destino empieza por una ruta antigua', () => {
        for (const rule of rules) {
            expect(rule.statusCode).toBe(301);
            expect(rule.destination).not.toMatch(/^(\/en)?\/(learning|repaso|games|privacy|terms)(\/|$)/);
        }
    });

    it('la regla genérica /es/* va después de las específicas', () => {
        const generic = rules.findIndex((r) => r.source === '/es/:path*');
        const specific = rules.findIndex((r) => r.source === '/es/learning/:curso([1-6])');
        expect(specific).toBeGreaterThanOrEqual(0);
        expect(generic).toBeGreaterThan(specific);
    });
});

describe('metadata generada', () => {
    it('title y description únicos y dentro de rango en todo el catálogo', () => {
        expect(validateGeneratedMetadata()).toEqual([]);
    });
});

describe('texto de los juegos', () => {
    it('cada juego tiene texto en español e inglés de al menos 120 palabras', () => {
        for (const { slug } of gameCatalog) {
            for (const locale of ['es', 'en'] as const) {
                const content = gameContent[slug]?.[locale];
                expect(content, `${slug} (${locale})`).toBeDefined();
                expect(countWords(content!), `${slug} (${locale})`).toBeGreaterThanOrEqual(120);
            }
        }
    });
});
