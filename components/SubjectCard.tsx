"use client";

import { ArrowRight, BookOpen, Calculator, FlaskConical, Users } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function SubjectCard({ subject, title, description, exploreText, comingSoonText }: {
    subject: any,
    title: string,
    description: string,
    exploreText: string,
    comingSoonText: string
}) {
    const icons = {
        Calculator,
        BookOpen,
        FlaskConical,
        Users
    };
    const Icon = icons[subject.icon as keyof typeof icons] || Calculator;
    const isComingSoon = subject.id !== 'math';

    return (
        <Link
            href={subject.href}
            className={`group rounded-2xl p-6 shadow-sm border flex flex-col h-full transition-all duration-300
                ${isComingSoon
                    ? 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 cursor-not-allowed opacity-70'
                    : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1'
                }`}
            aria-disabled={isComingSoon}
            onClick={(e) => isComingSoon && e.preventDefault()}
        >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${isComingSoon ? 'bg-gray-200 text-gray-400' : subject.bg}`}>
                <Icon className="w-8 h-8" />
            </div>

            <h3 className={`text-xl font-bold mb-2 transition-colors ${isComingSoon ? 'text-gray-400' : 'text-gray-900 dark:text-white group-hover:text-brand-blue'}`}>
                {title}
            </h3>

            <p className="text-gray-500 dark:text-gray-400 mb-6 flex-grow">
                {description}
            </p>

            <div className={`flex items-center gap-2 font-bold text-sm transition-transform ${isComingSoon ? 'text-gray-400' : 'text-brand-blue group-hover:translate-x-1'}`}>
                {isComingSoon ? comingSoonText : exploreText}
                {!isComingSoon && <ArrowRight className="w-4 h-4" />}
            </div>
        </Link>
    );
}
