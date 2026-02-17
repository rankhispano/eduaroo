'use client';

import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import ProgrammingWorkspace from '@/components/programming/ProgrammingWorkspace';
import { getProgrammingLessonById } from '@/lib/learning/programmingLessons';
import { notFound } from 'next/navigation';

export default function PlayLessonPage() {
    const params = useParams();
    const locale = useLocale();
    const lessonId = params?.lessonId as string;

    // Find lesson
    const lesson = getProgrammingLessonById(lessonId);

    if (!lesson) {
        notFound();
    }

    return (
        <ProgrammingWorkspace lesson={lesson} lang={locale} />
    );
}
