export interface PracticeQuestion {
    id: string;
    grade: string;
    subject: string;
    topic: string;
    href: string;
    prompt: string;
    options: string[];
    answer: number;
    explanation: string;
    passage?: string;
    sentence?: string;
}
