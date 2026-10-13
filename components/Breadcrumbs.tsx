'use client';

import { isSpanishResourcePath } from '@/lib/resources/catalog';
import { Link, usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronRight, Home } from 'lucide-react';
import { getCurriculum, getAsignatura, getCurso } from '@/src/data/localizedCurriculum';

type Crumb = { href: string; name: string };

// Los ejercicios antiguos (/learning/math/grade3/operations) se muestran dentro de
// su curso, asignatura y tema, buscando el recurso que los enlaza en curriculum.ts
function legacyExerciseCrumbs(path: string, learningLabel: string, locale: string): Crumb[] | null {
    if (!/^\/learning\/(math|language)\/grade\d\/./.test(path)) return null;
    let best: { len: number; crumbs: Crumb[] } | null = null;
    for (const curso of getCurriculum(locale)) {
        for (const asignatura of curso.asignaturas) {
            for (const tema of asignatura.temas) {
                for (const recurso of tema.recursos) {
                    const url = recurso.url.replace(/^\/(es|en)(?=\/)/, '');
                    const matches = path === url || path.startsWith(`${url}/`);
                    if (matches && (!best || url.length > best.len)) {
                        best = {
                            len: url.length,
                            crumbs: [
                                { href: '/learning', name: learningLabel },
                                { href: `/learning/${curso.id}`, name: curso.nombre },
                                { href: `/learning/${curso.id}/${asignatura.id}`, name: asignatura.nombre },
                                { href: path, name: tema.nombre },
                            ],
                        };
                    }
                }
            }
        }
    }
    return best?.crumbs ?? null;
}

export default function Breadcrumbs() {
    const pathname = usePathname();
    const t = useTranslations('Navigation');
    const locale = useLocale();

    // usePathname de i18n/navigation devuelve la ruta lógica sin idioma: /learning/math/grade4
    const pathSegments = pathname.split('/').filter(Boolean);

    // Don't show on home page
    if (pathSegments.length === 0 || isSpanishResourcePath(pathname)) return null;

    // Las páginas del árbol /primaria, los juegos y las legales pintan sus propias migas en el servidor
    // (components/seo/BreadcrumbNav.tsx), con BreadcrumbList JSON-LD
    if (/^\/(learning\/[1-6](\/|$)|games|privacy|terms)/.test(pathname)) return null;

    // Don't show on programming play pages (they have their own custom header)
    if (pathname.includes('/learning/programming/play')) return null;

    // Helper to get readable name
    const getSegmentName = (segment: string, index: number) => {
        // Try direct keys first
        if (['learning', 'math', 'fractions', 'problems', 'language', 'games', 'mates', 'naturales', 'sociales', 'ingles', 'kids', 'store', 'pegatinas', 'repaso', 'examen'].includes(segment)) {
            return t(segment);
        }

        if (/^[1-6]$/.test(segment)) {
            try {
                return t(`levels.grade${segment}`);
            } catch {
                return `${segment}º Primaria`;
            }
        }

        // Programming specific logic
        if (segment === 'programming') return t('programming');

        // Handle Programming Sections (section1 -> "El Explorador")
        if (segment.startsWith('section') && pathSegments[index - 1] === 'programming') {
            try {
                return t(`ProgrammingNavigation.${segment}`);
            } catch { return segment; }
        }

        // Handle Programming Phases (phase1 -> "Primeros Pasos")
        // Depends on previous segment (sectionX)
        if (segment.startsWith('phase') && pathSegments[index - 1]?.startsWith('section')) {
            try {
                const secNum = pathSegments[index - 1].replace('section', '');
                const phaseNum = segment.replace('phase', '');
                const key = `prog_s${secNum}_phase${phaseNum}`;
                return t(`ProgrammingNavigation.${key}`);
            } catch { return segment; }
        }

        // Try grade keys
        if (segment.startsWith('grade')) {
            // "grade4" -> t('levels.grade4')
            try {
                return t(`levels.${segment}`);
            } catch {
                return segment;
            }
        }

        // Catch-all: capitalize or return as is
        return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    };

    // Ruta nueva: /learning/<curso>/<asignatura>/<tema> con nombres reales
    const curriculumName = (segment: string, index: number): string | null => {
        if (pathSegments[0] !== 'learning' || index === 0) return null;
        const cursoId = pathSegments[1];
        if (index === 1) return getCurso(segment, locale)?.nombre ?? null;
        const asignatura = getAsignatura(cursoId, pathSegments[2], locale);
        if (index === 2) return asignatura?.nombre ?? null;
        if (index === 3) return asignatura?.temas.find((tema) => tema.id === segment)?.nombre ?? null;
        return null;
    };

    const crumbs: Crumb[] =
        legacyExerciseCrumbs(`/${pathSegments.join('/')}`, t('learning'), locale) ??
        pathSegments.map((segment, index) => ({
            href: `/${pathSegments.slice(0, index + 1).join('/')}`,
            name: curriculumName(segment, index) ?? getSegmentName(segment, index),
        }));

    return (
        <nav aria-label="Breadcrumb" className="bg-slate-50 border-b border-slate-200 dark:bg-black dark:border-gray-800 py-3">
            <div className="container mx-auto px-4 flex items-center text-sm text-slate-500 whitespace-nowrap overflow-x-auto no-scrollbar">

                {/* Home Link */}
                <Link
                    href="/"
                    className="flex items-center hover:text-indigo-600 transition-colors"
                    title={t('home')}
                >
                    <Home className="w-4 h-4" />
                </Link>

                {crumbs.map(({ href, name }, index) => {
                    const isLast = index === crumbs.length - 1;

                    return (
                        <div key={href} className="flex items-center">
                            <ChevronRight className="w-4 h-4 mx-2 text-slate-300 flex-shrink-0" />
                            {isLast ? (
                                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                                    {name}
                                </span>
                            ) : (
                                <Link
                                    href={href}
                                    className="hover:text-indigo-600 transition-colors flex items-center"
                                >
                                    {name}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}
