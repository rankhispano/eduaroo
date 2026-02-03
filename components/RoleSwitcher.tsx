import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useRoles, UserRole } from '@/lib/auth/RolesContext';

export default function RoleSwitcher() {
    const t = useTranslations('Roles');
    const { currentRole, switchRole } = useRoles();

    const roles: { id: UserRole; label: string; icon: string; color: string }[] = [
        { id: 'student', label: t('student'), icon: '🎓', color: 'bg-blue-100 text-blue-800 border-blue-200' },
        { id: 'parent', label: t('parent'), icon: '👨‍👩‍👧', color: 'bg-green-100 text-green-800 border-green-200' },
        { id: 'teacher', label: t('teacher'), icon: '👩‍🏫', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    ];

    return (
        <div className="flex bg-white dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
            {roles.map((role) => {
                const isActive = currentRole === role.id;
                return (
                    <button
                        key={role.id}
                        onClick={() => switchRole(role.id)}
                        className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all
                            ${isActive
                                ? `${role.color} shadow-sm scale-105`
                                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            }
                        `}
                    >
                        <span>{role.icon}</span>
                        <span className={`${isActive ? 'block' : 'hidden sm:block'}`}>
                            {role.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
