import { resourceGroups, resourceGuides } from '@/lib/resources/catalog';
import { comparisons } from '@/lib/resources/comparisons';
import { Link } from '@/i18n/navigation';
import { paths } from '@/lib/seo/urls';
import ResourceCards from './ResourceCards';
export default function ResourceDirectory({
    compact = false,
}: {
    compact?: boolean;
}) {
    if (compact)
        return (
            <nav
                aria-label="Explora recursos gratuitos"
                className="grid gap-7 sm:grid-cols-2 lg:grid-cols-5"
            >
                {resourceGroups.map((group) => (
                    <div key={group}>
                        <h2 className="mb-3 font-bold text-emerald-400">
                            {group}
                        </h2>
                        <ul className="space-y-2 text-sm">
                            {resourceGuides
                                .filter((g) => g.group === group)
                                .map((g) => (
                                    <li key={g.slug}>
                                        <Link
                                            href={paths.resource(g.slug)}
                                            className="text-slate-300 hover:text-white hover:underline"
                                        >
                                            {g.label}
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}
            </nav>
        );
    return (
        <div className="space-y-12">
            {resourceGroups.map((group, i) => (
                <section key={group} id={`grupo-${i}`} className="space-y-5">
                    <h2 className="text-2xl font-black">{group}</h2>
                    <ResourceCards
                        guides={resourceGuides.filter((g) => g.group === group)}
                    />
                </section>
            ))}
            <section className="space-y-5">
                <h2 className="text-2xl font-black">
                    Elige una plataforma con información contrastada
                </h2>
                <p>
                    Compara el enfoque de Eduaroo con otras propuestas según la
                    edad, el currículo y el tipo de práctica que necesitas.
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                    {comparisons.map((c) => (
                        <Link
                            href={paths.comparison(c.slug)}
                            key={c.slug}
                            className="rounded-xl border bg-white p-5 font-bold dark:border-slate-800 dark:bg-slate-900"
                        >
                            {c.icon} Eduaroo vs {c.name} →
                        </Link>
                    ))}
                </div>
                <Link href={paths.compare()} className="resource-link">
                    Ver todas las comparativas
                </Link>
            </section>
        </div>
    );
}
