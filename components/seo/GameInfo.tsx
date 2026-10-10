import { Link } from '@/i18n/navigation';
import { getGameContent, relatedGames } from '@/lib/seo/game-content';
import { toSiteLocale } from '@/lib/seo/site';
import { paths } from '@/lib/seo/urls';

const copy = {
    es: { related: 'Para seguir practicando', games: 'Más juegos educativos', all: 'Ver todos los juegos educativos de Primaria' },
    en: { related: 'Keep practising', games: 'More educational games', all: 'See all educational games for primary school' },
} as const;

// Texto descriptivo del juego, en el HTML servido y debajo de la zona de juego
export default function GameInfo({ locale, slug }: { locale: string; slug: string }) {
    const l = toSiteLocale(locale);
    const content = getGameContent(slug, l);
    if (!content) return null;
    const t = copy[l];
    const others = relatedGames[slug] ?? [];
    const linkClass = 'font-bold text-indigo-800 underline decoration-indigo-300 underline-offset-4 hover:decoration-indigo-600 dark:text-indigo-300';

    return (
        <section aria-label={content.sections[0].heading} className="bg-slate-50 px-5 py-12 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-8">
            <div className="mx-auto max-w-3xl space-y-8">
                {content.sections.map((section) => (
                    <div key={section.heading} className="space-y-3">
                        <h2 className="text-2xl font-black">{section.heading}</h2>
                        {section.paragraphs.map((text) => (
                            <p key={text} className="text-lg leading-relaxed text-slate-700 dark:text-slate-200">
                                {text}
                            </p>
                        ))}
                    </div>
                ))}

                {content.related && content.related.length > 0 ? (
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black">{t.related}</h2>
                        <ul className="list-disc space-y-1 pl-6 text-lg">
                            {content.related.map((link) => (
                                <li key={link.path}>
                                    <Link href={link.path} className={linkClass}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                <div className="space-y-2">
                    <h2 className="text-2xl font-black">{t.games}</h2>
                    <ul className="list-disc space-y-1 pl-6 text-lg">
                        {others.map((game) => (
                            <li key={game.slug}>
                                <Link href={paths.game(game.slug)} className={linkClass}>
                                    {game.name}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link href={paths.games()} className={linkClass}>
                                {t.all}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
