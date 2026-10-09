import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { formatDate, type LomloeBlockItem, lomloeNote } from '@/lib/seo/hub-content';
import type { SiteLocale } from '@/lib/seo/site';

const headingClass = 'mb-4 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl';

export function UpdatedOn({ date, locale }: { date: Date; locale: SiteLocale }) {
    return (
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            {locale === 'es' ? 'Actualizado el ' : 'Updated on '}
            <time dateTime={date.toISOString()}>{formatDate(date, locale)}</time>
        </p>
    );
}

export function Prose({ paragraphs }: { paragraphs: string[] }) {
    return (
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-slate-700 dark:text-slate-200">
            {paragraphs.map((text) => (
                <p key={text}>{text}</p>
            ))}
        </div>
    );
}

export function LomloeSection({ heading, items, locale }: { heading: string; items: LomloeBlockItem[]; locale: SiteLocale }) {
    if (items.length === 0) return null;
    const note = lomloeNote(locale);
    return (
        <section aria-labelledby="lomloe-heading" className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900 sm:p-8">
            <h2 id="lomloe-heading" className={headingClass}>
                {heading}
            </h2>
            <dl className="space-y-4">
                {items.map((item) => (
                    <div key={item.subject}>
                        <dt className="text-lg font-extrabold text-slate-900 dark:text-white">{item.subject}</dt>
                        <dd className="mt-1 text-base text-slate-700 dark:text-slate-200">{item.text}</dd>
                    </div>
                ))}
            </dl>
            <p className="mt-6 max-w-3xl text-base text-slate-600 dark:text-slate-300">
                {note.intro}{' '}
                <a
                    href="https://www.boe.es/buscar/act.php?id=BOE-A-2022-3296"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-indigo-700 underline dark:text-indigo-300"
                >
                    {note.linkLabel}
                    <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
            </p>
        </section>
    );
}

export interface RelatedLink {
    name: string;
    path: string;
    description?: string;
}

export function RelatedLinks({ heading, links }: { heading: string; links: RelatedLink[] }) {
    if (links.length === 0) return null;
    return (
        <section aria-labelledby="related-heading">
            <h2 id="related-heading" className={headingClass}>
                {heading}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {links.map((link) => (
                    <li key={link.path}>
                        <Link
                            href={link.path}
                            className="flex h-full items-center justify-between gap-3 rounded-2xl border-2 border-slate-100 bg-white p-4 text-lg font-bold text-slate-900 transition hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        >
                            <span>
                                {link.name}
                                {link.description ? <span className="mt-1 block text-sm font-medium text-slate-600 dark:text-slate-300">{link.description}</span> : null}
                            </span>
                            <ArrowRight className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export { headingClass };
