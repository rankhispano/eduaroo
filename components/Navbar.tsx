'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import LanguageSelector from './LanguageSelector';
import MegaMenu from './MegaMenu';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';


export default function Navbar() {
    const t = useTranslations('Navigation');
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const isGamesPage = pathname?.startsWith('/games');

    return (
        <nav className={`bg-white/80 dark:bg-black/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-800 ${isGamesPage ? '' : 'sticky top-0'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:pr-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="font-bold text-2xl text-brand-blue tracking-tight">
                            Eduaroo 🦘
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center z-50">
                        <MegaMenu />

                        {/* Other links hidden for now as per request "el navbar quiero que salga solo un elemento que sea Cursos" */}
                        {/* 
                        <Link href="/kids" className="text-gray-700 hover:text-brand-blue transition-colors">{t('kids')}</Link>
                        <Link href="/parents" className="text-gray-700 hover:text-brand-blue transition-colors">{t('parents')}</Link> 
                        */}

                        <Link href="/games" className="text-gray-700 dark:text-gray-300 hover:text-brand-blue px-3 py-2 rounded-md transition-colors">
                            {t('games')}
                        </Link>

                        <div className="flex items-center gap-4 ml-6 border-l pl-6 border-gray-200 dark:border-gray-700">

                            <ThemeToggle />
                            <LanguageSelector />
                        </div>
                    </div>

                    <div className="md:hidden flex items-center gap-3">

                        <ThemeToggle />
                        <LanguageSelector />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="ml-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
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
                        <Link
                            href="/games"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 rounded-md font-bold text-gray-700 dark:text-gray-200 hover:text-brand-blue hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            {t('games')}
                        </Link>
                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
                        <Link
                            href="/learning"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 rounded-md font-bold text-gray-700 dark:text-gray-200 hover:text-brand-blue hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            {t('startLearning')}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
