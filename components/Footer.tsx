'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('Footer');
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-white">
            {/* Main footer content */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {/* Brand section */}
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-emerald-400">Eduaroo</h2>
                        <p className="text-slate-400 text-sm">
                            {t('tagline')}
                        </p>
                    </div>

                    {/* Social icons - centered */}
                    <div className="flex justify-center gap-4">
                        {/* Social links can be added here */}
                    </div>

                    {/* Contact info - right aligned */}
                    <div className="flex flex-col md:items-end gap-2 text-sm text-slate-300">
                        <span className="font-medium text-emerald-400">{t('contact')}</span>
                        <a
                            href="mailto:nicolas@archivados.com"
                            className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                        >
                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            nicolas@archivados.com
                        </a>
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {t('location')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm flex items-center gap-2">
                        © {currentYear} Archivados Network S.L. {t('rights')}
                        <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs">
                            🌍
                        </span>
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link
                            href="/privacy"
                            className="text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                            {t('privacy')}
                        </Link>
                        <Link
                            href="/terms"
                            className="text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                            {t('terms')}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
