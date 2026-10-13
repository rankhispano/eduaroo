import { Link } from '@/i18n/navigation';
import { paths } from '@/lib/seo/urls';
import type { ResourceGuide } from '@/lib/resources/catalog';
export default function ResourceCards({ guides }: { guides: ResourceGuide[] }) {
    return (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
                <li key={guide.slug}>
                    <Link
                        href={paths.resource(guide.slug)}
                        className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-sky-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                        <span className="mb-4 text-3xl" aria-hidden>
                            {guide.icon}
                        </span>
                        <span className="mb-1 text-xs font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">
                            {guide.ages}
                        </span>
                        <h3 className="text-xl font-black group-hover:text-sky-700 dark:group-hover:text-sky-300">
                            {guide.label}
                        </h3>
                        <p className="mt-3 flex-1 text-sm text-slate-600 dark:text-slate-300">
                            {guide.description}
                        </p>
                        <span className="mt-5 text-sm font-bold text-sky-800 dark:text-sky-300">
                            {guide.tool
                                ? 'Abrir herramienta'
                                : 'Ver actividades'}{' '}
                            →
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
