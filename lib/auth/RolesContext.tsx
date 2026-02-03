'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'student' | 'parent' | 'teacher';

interface UserProfile {
    id: string;
    name: string;
    role: UserRole;
    avatar?: string;
}

interface RolesContextType {
    currentRole: UserRole;
    currentUser: UserProfile | null;
    switchRole: (role: UserRole) => void;
    childrenData: UserProfile[]; // For parents to see their kids
    classData: UserProfile[]; // For teachers
}

const DEFAULT_USER: UserProfile = {
    id: 'student_1',
    name: 'Alex',
    role: 'student',
    avatar: 'mascot_roo'
};

const RolesContext = createContext<RolesContextType | undefined>(undefined);

export function RolesProvider({ children }: { children: ReactNode }) {
    const [currentRole, setCurrentRole] = useState<UserRole>('student');
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEFAULT_USER);

    // Mock data for other roles
    const childrenData: UserProfile[] = [
        DEFAULT_USER,
        { id: 'student_2', name: 'Sara', role: 'student' }
    ];

    const classData: UserProfile[] = [
        DEFAULT_USER,
        { id: 'student_2', name: 'Sara', role: 'student' },
        { id: 'student_3', name: 'Leo', role: 'student' },
        { id: 'student_4', name: 'Mia', role: 'student' }
    ];

    const switchRole = (role: UserRole) => {
        setCurrentRole(role);
        if (role === 'student') setCurrentUser(DEFAULT_USER);
        if (role === 'parent') setCurrentUser({ id: 'parent_1', name: 'Mamá/Papá', role: 'parent' });
        if (role === 'teacher') setCurrentUser({ id: 'teacher_1', name: 'Prof. García', role: 'teacher' });
    };

    return (
        <RolesContext.Provider value={{ currentRole, currentUser, switchRole, childrenData, classData }}>
            {children}
        </RolesContext.Provider>
    );
}

export const useRoles = () => {
    const context = useContext(RolesContext);
    if (context === undefined) {
        throw new Error('useRoles must be used within a RolesProvider');
    }
    return context;
};
