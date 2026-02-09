'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
    const pathname = usePathname();
    const t = useTranslations('Navigation');
    
    // Split path into segments
    // /es/learning/math -> ['', 'es', 'learning', 'math']
    const segments = pathname.split('/').filter(Boolean);
    
    // Remove locale (first segment)
    // We assume the first segment is ALWAYS the locale due to middleware config
    const pathSegments = segments.slice(1);

    // Don't show on home page
    if (pathSegments.length === 0) return null;

    // Helper to get readable name
    const getSegmentName = (segment: string) => {
        // Try direct keys first
        if (['learning', 'math', 'fractions', 'problems'].includes(segment)) {
            return t(segment);
        }
        
        // Try grade keys
        if (segment.startsWith('grade')) {
            // "grade4" -> t('levels.grade4')
            try {
                return t(`levels.${segment}`);
            } catch (e) {
                return segment;
            }
        }

        // Catch-all: capitalize or return as is
        return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    };

    return (
        <nav aria-label="Breadcrumb" className="bg-slate-50 border-b border-slate-200 dark:bg-black dark:border-gray-800 py-3">
            <div className="container mx-auto px-4 flex items-center text-sm text-slate-500 whitespace-nowrap overflow-x-auto no-scrollbar">
                
                {/* Home Link */}
                <Link 
                    href="/" 
                    className="flex items-center hover:text-indigo-600 transition-colors"
                    title={t('home')}
                >
                    <Home className="w-4 h-4" />
                </Link>

                {pathSegments.map((segment, index) => {
                    const isLast = index === pathSegments.length - 1;
                    
                    // Reconstruct path up to this segment
                    // We don't need locale in href because Link handles it, 
                    // BUT we need the segments relative to root.
                    // segments = ['es', 'learning', 'math']
                    // pathSegments = ['learning', 'math']
                    // for 'learning' (index 0) -> '/learning'
                    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
                    
                    const name = getSegmentName(segment);

                    return (
                        <div key={href} className="flex items-center">
                            <ChevronRight className="w-4 h-4 mx-2 text-slate-300 flex-shrink-0" />
                            {isLast ? (
                                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                                    {name}
                                </span>
                            ) : (
                                <Link 
                                    href={href} 
                                    className="hover:text-indigo-600 transition-colors flex items-center"
                                >
                                    {name}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}
