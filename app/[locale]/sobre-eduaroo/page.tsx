import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Prose } from '@/components/seo/HubSections';
import BreadcrumbNav from '@/components/seo/BreadcrumbNav';
import JsonLd from '@/components/seo/JsonLd';
import { Link } from '@/i18n/navigation';
import { INFO_PAGES_LAST_MODIFIED } from '@/lib/seo/games';
import { aboutContent } from '@/lib/seo/info-content';
import { staticPageMetadata, staticPages } from '@/lib/seo/pages';
import { absoluteUrl, toSiteLocale } from '@/lib/seo/site';
import { localize, paths } from '@/lib/seo/urls';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await props.params;
    return staticPageMetadata('about', toSiteLocale(locale));
}

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    setRequestLocale(locale);
    const l = toSiteLocale(locale);
    const content = aboutContent(l);

    return (
        <>
            <BreadcrumbNav locale={l} items={[{ name: l === 'es' ? 'Sobre Eduaroo' : 'About Eduaroo' }]} />
            <div className="bg-slate-50 px-5 py-10 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-8 lg:px-12">
                <article className="mx-auto max-w-3xl space-y-10">
                    <header className="space-y-4">
                        <h1 className="text-4xl font-black tracking-normal sm:text-5xl">{content.h1}</h1>
                        <p className="text-xl font-semibold text-slate-700 dark:text-slate-200">{content.lead}</p>
                    </header>
                    {content.sections.map((section) => (
                        <section key={section.heading} className="space-y-3">
                            <h2 className="text-2xl font-black sm:text-3xl">{section.heading}</h2>
                            <Prose paragraphs={section.paragraphs} />
                        </section>
                    ))}
                    <p>
                        <Link href={paths.contact()} className="text-lg font-bold text-indigo-800 underline dark:text-indigo-300">
                            {content.contactLink}
                        </Link>
                    </p>
                </article>
            </div>
            <JsonLd
                data={{
                    '@type': 'AboutPage',
                    name: staticPages.about[l].title,
                    url: absoluteUrl(localize(l, paths.about())),
                    inLanguage: l === 'es' ? 'es-ES' : 'en-GB',
                    dateModified: INFO_PAGES_LAST_MODIFIED.toISOString(),
                }}
            />
        </>
    );
}
