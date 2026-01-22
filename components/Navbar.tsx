'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import LanguageSelector from './LanguageSelector';
import MegaMenu from './MegaMenu';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const t = useTranslations('Navigation');
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="font-bold text-2xl text-brand-blue tracking-tight">
                            Eduaroo 🦘
                        </Link>
                    </div>

                    <div className="hidden md:flex space-x-8 items-center">
                        <MegaMenu />

                        {/* Other links hidden for now as per request "el navbar quiero que salga solo un elemento que sea Asignaturas" */}
                        {/* 
                        <Link href="/kids" className="text-gray-700 hover:text-brand-blue transition-colors">{t('kids')}</Link>
                        <Link href="/parents" className="text-gray-700 hover:text-brand-blue transition-colors">{t('parents')}</Link> 
                        */}

                        <div className="ml-4 border-l pl-4 border-gray-200">
                            <LanguageSelector />
                        </div>
                    </div>

                    <div className="md:hidden flex items-center">
                        <LanguageSelector />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="ml-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-white dark:bg-black shadow-lg border-t border-gray-100 dark:border-gray-800">
                    <div className="px-3 py-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('subjects')}</h3>
                        <div className="pl-4 border-l-2 border-gray-100 dark:border-gray-800 space-y-3">
                            <div>
                                <h4 className="flex items-center gap-2 text-brand-blue font-medium text-sm mb-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                                    {t('math')}
                                </h4>
                                <div className="pl-4 mt-1">
                                    <Link
                                        href="/learning/math/grade4"
                                        onClick={() => setIsOpen(false)}
                                        className="block py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-brand-blue font-medium"
                                    >
                                        {t('grade4')}
                                    </Link>
                                </div>
                            </div>
                            {/* Other subjects disabled for now */}
                            <div className="opacity-50">
                                <h4 className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                    {t('language')}
                                </h4>
                            </div>
                            <div className="opacity-50">
                                <h4 className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                    {t('science')}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
