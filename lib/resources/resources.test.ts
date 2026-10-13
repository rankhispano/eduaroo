import { describe, expect, it } from 'vitest';
import { resourceGuides, getResourceGuide } from './catalog';
import { comparisons } from './comparisons';
import { selectResourceTopics, getPracticeQuestions } from './topics';
import { getWorksheetSummary, summerTopics } from './worksheets';
import {
    makeArithmetic,
    toRoman,
    fromRoman,
    angleName,
    compareDictation,
} from './learning';
import {
    getActivitySets,
    getActivityLoaders,
} from '@/content/activities/registry';
import { paths } from '@/lib/seo/urls';
import { getIndexableRoutes } from '@/lib/seo/routes';
import { cursoSlug, asignaturaSlug } from '@/lib/seo/slugs';
import map from '@/content/resources/spain-map.json';

describe('biblioteca de recursos', () => {
    it('cubre todas las secciones solicitadas y enlaza contenido existente', () => {
        expect(resourceGuides).toHaveLength(31);
        expect(new Set(resourceGuides.map((g) => g.slug)).size).toBe(
            resourceGuides.length,
        );
        for (const guide of resourceGuides) {
            for (const slug of guide.related)
                expect(
                    getResourceGuide(slug),
                    `${guide.slug} → ${slug}`,
                ).toBeDefined();
            if (guide.subject || guide.grades)
                expect(
                    selectResourceTopics(guide).length,
                    guide.slug,
                ).toBeGreaterThan(0);
        }
        expect(comparisons.map((c) => c.name)).toEqual([
            'Smartick',
            'Khan Academy Kids',
            'ABCmouse',
        ]);
    });
    it('resuelve las 238 fichas y rechaza curso, materia o tema desconocidos', () => {
        for (const set of getActivitySets('es'))
            expect(
                getWorksheetSummary(
                    cursoSlug(set.cursoId),
                    asignaturaSlug(set.asignaturaId),
                    set.temaId,
                )?.key,
            ).toBe(set.key);
        expect(
            getWorksheetSummary('7-primaria', 'lengua', 'dictado'),
        ).toBeUndefined();
        expect(
            getWorksheetSummary('1-primaria', 'inventada', 'dictado'),
        ).toBeUndefined();
        expect(
            getWorksheetSummary('1-primaria', 'lengua', 'no-existe'),
        ).toBeUndefined();
    });
    it('los cuadernos incluyen dos temas de cada materia y conservan actividades reales', async () => {
        for (const [grade, keys] of Object.entries(summerTopics)) {
            const sets = await Promise.all(
                keys.map((key) =>
                    getActivityLoaders('es')[`${grade}/${key}`](),
                ),
            );
            expect(sets.filter((s) => s.asignaturaId === 'mates')).toHaveLength(
                2,
            );
            expect(
                sets.filter((s) => s.asignaturaId === 'lengua'),
            ).toHaveLength(2);
            expect(
                sets.every(
                    (s) => s.cursoId === grade && s.activities.length > 0,
                ),
            ).toBe(true);
        }
    });
    it('la muestra orientativa cubre Matemáticas y Lengua de cada curso anterior', async () => {
        const questions = await getPracticeQuestions(
            getActivitySets('es').filter(
                (s) =>
                    s.asignaturaId === 'mates' || s.asignaturaId === 'lengua',
            ),
            8,
        );
        for (const grade of ['1', '2', '3', '4', '5']) {
            const group = questions.filter((q) => q.grade === grade);
            expect(group).toHaveLength(8);
            expect(group.filter((q) => q.subject === 'mates')).toHaveLength(4);
            expect(group.filter((q) => q.subject === 'lengua')).toHaveLength(4);
            expect(
                group.every(
                    (q) => q.answer >= 0 && q.answer < q.options.length,
                ),
            ).toBe(true);
        }
    });
    it('el sitemap contiene todas las nuevas rutas una sola vez y solo en español', async () => {
        const routes = await getIndexableRoutes();
        const routePaths = routes.map((r) => r.path);
        expect(new Set(routePaths).size).toBe(routePaths.length);
        for (const guide of resourceGuides)
            expect(routePaths).toContain(paths.resource(guide.slug));
        for (const c of comparisons)
            expect(routePaths).toContain(paths.comparison(c.slug));
        for (const set of getActivitySets('es'))
            expect(routePaths).toContain(
                paths.worksheet(set.cursoId, set.asignaturaId, set.temaId),
            );
        expect(routePaths.some((p) => p.startsWith('/en/'))).toBe(false);
    });
});
describe('herramientas educativas', () => {
    it('genera repartos válidos con resto menor que el divisor y restas no negativas', () => {
        for (const random of [() => 0, () => 0.05, () => 0.45, () => 0.99])
            for (const level of [1, 2, 3]) {
                const q = makeArithmetic('divide', level, 0, random);
                expect(q.b * q.answer + q.remainder).toBe(q.a);
                expect(q.remainder).toBeLessThan(q.b);
                if (level === 1) expect(q.remainder).toBe(0);
                expect(
                    makeArithmetic('subtract', level, 0, random).answer,
                ).toBeGreaterThanOrEqual(0);
            }
    });
    it('acepta las escrituras romanas canónicas y rechaza formas engañosas', () => {
        for (let n = 1; n <= 3999; n++) expect(fromRoman(toRoman(n)!)).toBe(n);
        for (const bad of [
            'IL',
            'IC',
            'IIII',
            'VV',
            'XM',
            '',
            'MMMM',
            'ABC',
            'I V',
        ])
            expect(fromRoman(bad)).toBeUndefined();
        for (const bad of [0, -1, 4000, 1.5, NaN])
            expect(toRoman(bad)).toBeUndefined();
        expect(fromRoman(' xlix ')).toBe(49);
    });
    it('clasifica correctamente los límites de los ángulos', () => {
        expect([0, 89, 90, 91, 179, 180, 181, 359, 360].map(angleName)).toEqual(
            [
                'Nulo',
                'Agudo',
                'Recto',
                'Obtuso',
                'Obtuso',
                'Llano',
                'Cóncavo',
                'Cóncavo',
                'Completo',
            ],
        );
    });
    it('respeta tildes y puntuación al comparar dictados y tolera espacios', () => {
        expect(compareDictation('El árbol.', '  El   árbol. ').exact).toBe(
            true,
        );
        expect(compareDictation('El árbol.', 'El arbol.').exact).toBe(false);
        expect(compareDictation('El árbol.', 'El árbol').exact).toBe(false);
        expect(compareDictation('El árbol.', 'El árbol. azul').exact).toBe(
            false,
        );
        expect(compareDictation('El árbol.', 'El árbol.').exact).toBe(true);
    });
    it('el mapa representa 17 comunidades y 2 ciudades con geometría', () => {
        expect(map).toHaveLength(19);
        expect(
            map
                .filter((r) => ['18', '19'].includes(r.id))
                .map((r) => r.name)
                .sort(),
        ).toEqual(['Ceuta', 'Melilla']);
        expect(map.every((r) => r.path.length > 0)).toBe(true);
    });
});
