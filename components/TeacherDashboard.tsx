'use client';

import {
    Users,
    BookOpen,
    FileSpreadsheet,
    MoreVertical,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Search
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function TeacherDashboard() {
    const t = useTranslations('TeacherDashboard');
    // Mock class data
    const students = [
        { id: 1, name: "Alex Johnson", level: 5, progress: 75, lastActive: "2h ago", status: "ontrack" },
        { id: 2, name: "Sara Miller", level: 4, progress: 40, lastActive: "1d ago", status: "needs_help" },
        { id: 3, name: "Leo Davies", level: 5, progress: 85, lastActive: "5m ago", status: "ontrack" },
        { id: 4, name: "Mia Wilson", level: 3, progress: 20, lastActive: "3d ago", status: "falling_behind" },
        { id: 5, name: "Tom Baker", level: 6, progress: 95, lastActive: "1h ago", status: "exceling" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {t('title')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <Users className="w-4 h-4" /> {t('studentsCount', { count: 24 })}
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{t('year')}</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                            <FileSpreadsheet className="w-4 h-4" /> {t('exportCSV')}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                            <BookOpen className="w-4 h-4" /> {t('createTask')}
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: t('classAverage'), value: "78%", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50" },
                        { label: t('needsHelp'), value: "3", icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-50" },
                        { label: t('completedTasks'), value: "142", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
                        { label: t('totalTime'), value: "12h", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-xl font-bold dark:text-white">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Student List Table */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Table Header / Toolbar */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4">
                        <h3 className="font-bold text-lg dark:text-white">{t('students')}</h3>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('search')}
                                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm w-full sm:w-64 border-none focus:ring-2 focus:ring-brand-blue"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-750 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">{t('table.name')}</th>
                                    <th className="px-6 py-4">{t('table.level')}</th>
                                    <th className="px-6 py-4">{t('table.progress')}</th>
                                    <th className="px-6 py-4">{t('table.status')}</th>
                                    <th className="px-6 py-4">{t('table.lastActive')}</th>
                                    <th className="px-6 py-4 text-right">{t('table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-xs">
                                                {student.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            {student.name}
                                        </td>
                                        <td className="px-6 py-4">Lvl {student.level}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${student.progress > 80 ? 'bg-green-500' :
                                                                student.progress > 40 ? 'bg-blue-500' : 'bg-orange-500'
                                                            }`}
                                                        style={{ width: `${student.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium">{student.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(student.status, t)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{student.lastActive}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Placeholder */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700 text-center text-xs text-gray-400">
                        {t('placeholders.showing', { current: 5, total: 24 })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function getStatusBadge(status: string, t: any) {
    switch (status) {
        case 'ontrack':
            return <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">{t('status.ontrack')}</span>;
        case 'needs_help':
            return <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">{t('status.needs_help')}</span>;
        case 'falling_behind':
            return <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">{t('status.falling_behind')}</span>;
        case 'exceling':
            return <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">{t('status.exceling')}</span>;
        default:
            return null;
    }
}
