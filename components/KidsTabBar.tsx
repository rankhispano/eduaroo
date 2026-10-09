'use client';

import { useTranslations } from 'next-intl';
import { Gamepad2, Map as MapIcon, Smile, Sticker } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';

// Pantallas que ya usan la parte inferior (actividades, examen, repaso, juegos y ejercicios)
const HIDDEN = [
    /^\/learning\/[^/]+\/[^/]+\/[^/]+/,
    /^\/learning\/repaso/,
    /^\/learning\/(math|language|programming)\//,
    /^\/games\/.+/,
];

export default function KidsTabBar() {
    const t = useTranslations('KidsMap');
    const pathname = usePathname() ?? '/';
    if (HIDDEN.some((re) => re.test(pathname))) return null;

    const tabs = [
        { href: '/', label: t('tabMap'), Icon: MapIcon, active: pathname === '/' || pathname.startsWith('/learning') },
        { href: '/games', label: t('tabGames'), Icon: Gamepad2, active: pathname.startsWith('/games') },
        { href: '/pegatinas', label: t('tabStickers'), Icon: Sticker, active: pathname.startsWith('/pegatinas') },
        { href: '/kids', label: t('tabMe'), Icon: Smile, active: pathname.startsWith('/kids') },
    ];

    return (
        <>
            {/* Hueco para que la barra no tape el final de la página */}
            <div className="h-20 md:hidden" aria-hidden />
            <nav
                aria-label={t('tabsLabel')}
                className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-950/95"
            >
                {tabs.map(({ href, label, Icon, active }) => (
                    <Link
                        key={href}
                        href={href}
                        aria-current={active ? 'page' : undefined}
                        className={`flex flex-col items-center gap-0.5 py-2 text-xs font-black ${active ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        <Icon className="h-6 w-6" aria-hidden />
                        {label}
                    </Link>
                ))}
            </nav>
        </>
    );
}
