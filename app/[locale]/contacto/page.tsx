import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import BreadcrumbNav from '@/components/seo/BreadcrumbNav';
import JsonLd from '@/components/seo/JsonLd';
import { INFO_PAGES_LAST_MODIFIED } from '@/lib/seo/games';
import { contactContent } from '@/lib/seo/info-content';
import { staticPageMetadata, staticPages } from '@/lib/seo/pages';
import { absoluteUrl, contactEmail, legalName, toSiteLocale } from '@/lib/seo/site';
import { localize, paths } from '@/lib/seo/urls';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await props.params;
    return staticPageMetadata('contact', toSiteLocale(locale));
}

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    setRequestLocale(locale);
    const l = toSiteLocale(locale);
    const content = contactContent(l);

    return (
        <>
            <BreadcrumbNav locale={l} items={[{ name: l === 'es' ? 'Contacto' : 'Contact' }]} />
            <div className="bg-slate-50 px-5 py-10 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-8 lg:px-12">
                <article className="mx-auto max-w-3xl space-y-8">
                    <header className="space-y-4">
                        <h1 className="text-4xl font-black tracking-normal sm:text-5xl">{content.h1}</h1>
                        <p className="text-xl font-semibold text-slate-700 dark:text-slate-200">{content.intro}</p>
                    </header>
                    <dl className="space-y-3 rounded-3xl bg-white p-6 text-lg shadow-sm dark:bg-slate-900">
                        <div>
                            <dt className="font-extrabold">{content.emailLabel}</dt>
                            <dd>
                                <a href={`mailto:${contactEmail}`} className="font-bold text-indigo-800 underline dark:text-indigo-300">
                                    {contactEmail}
                                </a>
                            </dd>
                        </div>
                        <div>
                            <dt className="font-extrabold">{content.companyLabel}</dt>
                            <dd>{legalName}</dd>
                        </div>
                        <div>
                            <dt className="font-extrabold">{content.locationLabel}</dt>
                            <dd>{content.location}</dd>
                        </div>
                    </dl>
                    <ul className="list-disc space-y-2 pl-6 text-lg text-slate-700 dark:text-slate-200">
                        {content.tips.map((tip) => (
                            <li key={tip}>{tip}</li>
                        ))}
                    </ul>
                </article>
            </div>
            <JsonLd
                data={{
                    '@type': 'ContactPage',
                    name: staticPages.contact[l].title,
                    url: absoluteUrl(localize(l, paths.contact())),
                    inLanguage: l === 'es' ? 'es-ES' : 'en-GB',
                    dateModified: INFO_PAGES_LAST_MODIFIED.toISOString(),
                }}
            />
        </>
    );
}
