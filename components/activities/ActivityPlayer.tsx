'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import confetti from 'canvas-confetti';
import { ArrowRight, BookOpen, ChevronLeft, Clock, Lightbulb, RefreshCcw, Star, Target } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import ExerciseFeedback from '@/components/ExerciseFeedback';
import { useGamificationStore, type SubjectId } from '@/lib/gamification/store';
import { usePracticeStore, type StepAnswer } from '@/lib/learning/practiceStore';
import { playComplete, playCorrect, playIncorrect } from '@/lib/audio/soundEffects';
import { starsFor, toSteps, type Step } from '@/lib/curriculum/steps';
import { activitySpeechSegments } from '@/lib/curriculum/speech';
import type { ActivitySet, LomloeCycle } from '@/lib/curriculum/types';
import type { AsignaturaId, Recurso } from '@/src/types';
import RooMascot from '@/components/mascot/RooMascot';
import RecursoItem from '@/src/components/RecursoItem';
import SpeakButton from './SpeakButton';
import OptionsActivity from './OptionsActivity';
import TrueFalseActivity from './TrueFalseActivity';
import MatchActivity from './MatchActivity';
import ClassifyActivity from './ClassifyActivity';
import OrderActivity from './OrderActivity';

const GAMIFICATION_SUBJECT: Record<AsignaturaId, SubjectId> = {
    mates: 'math',
    lengua: 'language',
    naturales: 'science',
    sociales: 'social',
    ingles: 'english',
};

// Presentación según el ciclo: Peques (1º-2º), Medianos (3º-4º) y Mayores (5º-6º)
const LOOK: Record<LomloeCycle, { card: string; prompt: string; autoRead: boolean }> = {
    1: { card: 'text-lg', prompt: 'text-2xl sm:text-3xl', autoRead: true },
    2: { card: '', prompt: 'text-xl sm:text-2xl', autoRead: false },
    3: { card: 'dark', prompt: 'text-xl sm:text-2xl', autoRead: false },
};

export type PlayerMode = 'topic' | 'exam' | 'review';

export default function ActivityPlayer({
    set,
    steps: stepsOverride,
    mode = 'topic',
    color,
    subjectName,
    cursoNombre,
    backHref,
    backLabel,
    criteria = [],
    extras = [],
}: {
    set: ActivitySet;
    steps?: Step[];
    mode?: PlayerMode;
    color: string;
    subjectName: string;
    cursoNombre: string;
    backHref: string;
    backLabel?: string;
    criteria?: { id: string; text: string }[];
    // Otros recursos del tema (ejercicios con dibujos, juegos) para después o en lugar de la lección
    extras?: Recurso[];
}) {
    const t = useTranslations('Activities');
    const locale = useLocale();
    const completeExercise = useGamificationStore((s) => s.completeExercise);
    const recordTopicResult = usePracticeStore((s) => s.recordTopicResult);
    const recordAnswers = usePracticeStore((s) => s.recordAnswers);

    const setKey = `${set.cursoId}/${set.asignaturaId}/${set.temaId}`;
    const baseSteps = useMemo(() => stepsOverride ?? toSteps(set.activities, setKey), [stepsOverride, set.activities, setKey]);
    const look = LOOK[set.lomloe.cycle] ?? LOOK[2];

    const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
    const [steps, setSteps] = useState<Step[]>(baseSteps);
    const [retrying, setRetrying] = useState(false);
    const [round, setRound] = useState(0);
    const [index, setIndex] = useState(0);
    const [result, setResult] = useState<boolean | null>(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState({ show: false, isCorrect: false });
    const [xpGained, setXpGained] = useState(0);
    const [wrongSteps, setWrongSteps] = useState<Step[]>([]);
    const [answers, setAnswers] = useState<StepAnswer[]>([]);

    const step = steps[index];
    const isLast = index === steps.length - 1;
    const backText = backLabel ?? t('backToTopics');

    const play = (list: Step[], isRetry: boolean) => {
        setSteps(list);
        setRetrying(isRetry);
        setIndex(0);
        setCorrectCount(0);
        setResult(null);
        setShowHint(false);
        setWrongSteps([]);
        setAnswers([]);
        setRound((r) => r + 1);
        setPhase('play');
    };

    const handleAnswer = (isCorrect: boolean) => {
        setResult(isCorrect);
        setFeedback({ show: true, isCorrect });
        setAnswers((a) => [...a, { setKey: step.setKey, stepId: step.id, correct: isCorrect }]);
        if (isCorrect) {
            setCorrectCount((c) => c + 1);
            playCorrect();
        } else {
            setWrongSteps((w) => [...w, step]);
            playIncorrect();
        }
    };

    const finish = () => {
        const total = steps.length;
        // Un bloque terminado cuenta como ejercicio: XP, estrellas, meta diaria, racha y logros
        const reward = completeExercise(GAMIFICATION_SUBJECT[set.asignaturaId], correctCount, total, correctCount === total);
        setXpGained(reward.xpGained);
        // Los fallos vuelven en el repaso del día; los aciertos de repasos los van retirando
        recordAnswers(answers);
        if (mode === 'topic' && !retrying) recordTopicResult(setKey, correctCount, total);
        playComplete();
        if (correctCount / total >= 0.7) confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        setPhase('result');
    };

    const next = () => {
        setFeedback((f) => ({ ...f, show: false }));
        if (isLast) {
            finish();
            return;
        }
        setIndex((i) => i + 1);
        setResult(null);
        setShowHint(false);
    };

    const stars = starsFor(correctCount, steps.length);
    const speakText = step ? (step.type === 'fill-blank' ? `${step.prompt}. ${step.sentence}` : step.prompt) : '';
    const speakSegments = step ? activitySpeechSegments(step) : undefined;

    return (
        <div className="mx-auto max-w-4xl p-4">
            <Link href={backHref} className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-indigo-600">
                <ChevronLeft className="h-4 w-4" />
                {backText}
            </Link>

            <div className={look.card}>
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white text-gray-900 shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
                    <div className="flex items-center justify-between gap-4 p-6 text-white" style={{ backgroundColor: color }}>
                        <div className="min-w-0">
                            <p className="text-sm font-extrabold text-white/85">
                                {cursoNombre} · {subjectName}
                            </p>
                            <h1 className="truncate text-2xl font-black sm:text-3xl">
                                {retrying ? t('retryTitle') : set.title}
                            </h1>
                        </div>
                        {phase === 'play' ? (
                            <Button variant="ghost" size="icon" onClick={() => play(baseSteps, false)} aria-label={t('restart')} className="text-white hover:bg-white/20 dark:text-white dark:hover:bg-white/20">
                                <RefreshCcw className="h-5 w-5" />
                            </Button>
                        ) : null}
                    </div>

                    {phase === 'intro' ? (
                        <div className="flex flex-col gap-8 p-8">
                            <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-400">
                                <span className="inline-flex items-center gap-1">
                                    <BookOpen className="h-4 w-4" /> {t('activitiesCount', { count: baseSteps.length })}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <Clock className="h-4 w-4" /> {t('minutes', { count: Math.max(5, Math.round(baseSteps.length * 0.75)) })}
                                </span>
                            </div>
                            {set.summary ? <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">{set.summary}</p> : null}

                            {locale === 'en' && !set.meta.translation ? (
                                <p className="rounded-xl bg-sky-50 px-4 py-3 font-semibold text-sky-800 dark:bg-sky-900/30 dark:text-sky-200">{t('spanishTopic')}</p>
                            ) : null}

                            {set.keyIdeas.length > 0 ? (
                                <section className="relative rounded-2xl bg-amber-50 p-6 sm:pr-36 dark:bg-amber-900/20">
                                    <RooMascot pose="read" title={t('rooMascot')} size={110} className="absolute -bottom-3 right-3 hidden sm:block" />
                                    <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-amber-700 dark:text-amber-300">
                                        <Lightbulb className="h-6 w-6" /> {t('keyIdeasTitle')}
                                    </h2>
                                    <ul className="space-y-3">
                                        {set.keyIdeas.map((idea) => (
                                            <li key={idea} className="flex items-start gap-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
                                                <span className="mt-1 text-amber-500">★</span>
                                                <span className="flex-1">{idea}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            ) : null}

                            <Button size="lg" onClick={() => play(baseSteps, false)} className="self-center px-10 text-lg font-black">
                                {t('start')} <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>

                            {extras.length > 0 ? (
                                <section className="flex flex-col gap-3">
                                    <h2 className="text-lg font-black text-gray-800 dark:text-gray-100">{t('moreToPractice')}</h2>
                                    <ul className="space-y-3">
                                        {extras.map((recurso) => (
                                            <RecursoItem key={recurso.id} recurso={recurso} color={color} />
                                        ))}
                                    </ul>
                                </section>
                            ) : null}

                            {criteria.length > 0 ? (
                                <details className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600 dark:border-gray-800 dark:text-gray-400">
                                    <summary className="cursor-pointer font-bold">{t('lomloeTitle')}</summary>
                                    {locale === 'en' ? <p className="mt-3">{t('lomloeOriginal')}</p> : null}
                                    <ul className="mt-3 space-y-2">
                                        {criteria.map((c) => (
                                            <li key={c.id}>
                                                <span className="font-black">{t('criterion')} {c.id}.</span> {c.text}
                                            </li>
                                        ))}
                                    </ul>
                                    {set.lomloe.basicKnowledge.length > 0 ? (
                                        <p className="mt-3">
                                            <span className="font-black">{t('basicKnowledge')}:</span> {set.lomloe.basicKnowledge.join(' · ')}
                                        </p>
                                    ) : null}
                                </details>
                            ) : null}
                        </div>
                    ) : null}

                    {phase === 'play' && step ? (
                        <div className={`flex flex-col gap-8 p-6 sm:p-8 ${result !== null ? 'pb-56 sm:pb-8' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: color }}
                                        initial={false}
                                        animate={{ width: `${((index + (result !== null ? 1 : 0)) / steps.length) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm font-black text-slate-500 dark:text-slate-400">
                                    {t('progress', { current: index + 1, total: steps.length })}
                                </span>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${round}-${step.setKey}-${step.id}`}
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -40 }}
                                    className="flex flex-col items-center gap-8"
                                >
                                    {step.type === 'reading-question' ? (
                                        <article className="w-full rounded-2xl bg-slate-50 p-6 dark:bg-gray-800">
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <h3 className="text-lg font-black text-gray-800 dark:text-gray-100">📖 {step.passage.title}</h3>
                                                <SpeakButton text={`${step.passage.title}. ${step.passage.text}`} lang={step.passage.lang} />
                                            </div>
                                            <p lang={step.passage.lang} className="whitespace-pre-line text-lg leading-relaxed text-gray-700 dark:text-gray-200">{step.passage.text}</p>
                                        </article>
                                    ) : null}

                                    <div className="flex w-full items-start justify-center gap-3">
                                        <h2 className={`text-center font-bold text-gray-800 dark:text-gray-100 ${look.prompt}`}>{step.prompt}</h2>
                                        <SpeakButton text={speakText} lang={step.lang} segments={speakSegments} autoPlay={look.autoRead && step.type !== 'reading-question'} />
                                    </div>

                                    {renderStep(step, result !== null, handleAnswer)}

                                    {step.hint && result === null ? (
                                        showHint ? (
                                            <p className="rounded-xl bg-sky-50 px-4 py-3 text-base font-semibold text-sky-800 dark:bg-sky-900/30 dark:text-sky-200">💡 {step.hint}</p>
                                        ) : (
                                            <Button variant="ghost" onClick={() => setShowHint(true)}>
                                                <Lightbulb className="mr-2 h-4 w-4" /> {t('hint')}
                                            </Button>
                                        )
                                    ) : null}
                                </motion.div>
                            </AnimatePresence>

                            {result !== null ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`fixed inset-x-0 bottom-0 z-60 flex flex-col gap-4 rounded-t-3xl border-t-2 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(15,23,42,0.15)] sm:static sm:z-auto sm:flex-row sm:items-center sm:rounded-2xl sm:border-2 sm:pb-5 sm:shadow-none ${result ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950' : 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950'}`}
                                >
                                    <RooMascot pose={result ? 'celebrate' : 'encourage'} title={t('rooMascot')} size={58} className="hidden shrink-0 sm:block" />
                                    <div className="flex-1">
                                        <p className={`text-lg font-black ${result ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}`}>
                                            {result ? t('correct') : t('incorrect')}
                                        </p>
                                        <p className="mt-1 text-base font-semibold text-gray-700 dark:text-gray-200">{step.explanation}</p>
                                    </div>
                                    <Button size="lg" onClick={next} className="h-12 shrink-0 text-lg font-black">
                                        {isLast ? t('finish') : t('next')} <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </motion.div>
                            ) : null}
                        </div>
                    ) : null}

                    {phase === 'result' ? (
                        <div className="flex flex-col items-center gap-6 p-10 text-center">
                            <RooMascot pose={correctCount / steps.length >= 0.7 ? 'celebrate' : 'encourage'} size={130} />
                            <div className="flex gap-2">
                                {[1, 2, 3].map((n) => (
                                    <motion.div
                                        key={n}
                                        initial={{ scale: 0, rotate: -90 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: n * 0.2, type: 'spring' }}
                                    >
                                        <Star className={`h-16 w-16 ${n <= stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} />
                                    </motion.div>
                                ))}
                            </div>
                            <h2 className="text-3xl font-black text-gray-800 dark:text-gray-100">{t('resultTitle')}</h2>
                            <p className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                                {t('resultScore', { correct: correctCount, total: steps.length })}
                            </p>
                            <p className="text-base font-bold text-indigo-600 dark:text-indigo-400">+{xpGained} XP</p>
                            <p className="max-w-md text-base text-gray-500 dark:text-gray-400">
                                {wrongSteps.length === 0 ? t('resultPerfect') : correctCount / steps.length >= 0.7 ? t('resultGreat') : t('resultKeepGoing')}
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {wrongSteps.length > 0 ? (
                                    <Button size="lg" onClick={() => play(wrongSteps, true)} className="font-black">
                                        <Target className="mr-2 h-5 w-5" /> {t('retryMistakes', { count: wrongSteps.length })}
                                    </Button>
                                ) : null}
                                <Button size="lg" variant="secondary" onClick={() => play(baseSteps, false)}>
                                    <RefreshCcw className="mr-2 h-5 w-5" /> {t('tryAgain')}
                                </Button>
                                <Link href={backHref} className="inline-flex h-11 items-center rounded-md border border-gray-200 px-8 font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                                    {backText}
                                </Link>
                            </div>
                            {wrongSteps.length > 0 ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('mistakesSaved')}</p>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>

            {/* La celebración a pantalla completa solo en pantallas grandes: en móvil taparía la explicación */}
            <div className="hidden sm:block">
                <ExerciseFeedback show={feedback.show} isCorrect={feedback.isCorrect} message={feedback.isCorrect ? t('correct') : t('incorrect')} onComplete={() => setFeedback((f) => ({ ...f, show: false }))} />
            </div>
        </div>
    );
}

function renderStep(step: Step, answered: boolean, onAnswer: (isCorrect: boolean) => void) {
    switch (step.type) {
        case 'choice':
        case 'reading-question':
            return <OptionsActivity options={step.options} answer={step.answer} disabled={answered} onAnswer={onAnswer} />;
        case 'fill-blank':
            return <OptionsActivity options={step.options} answer={step.answer} sentence={step.sentence} disabled={answered} onAnswer={onAnswer} />;
        case 'true-false':
            return <TrueFalseActivity answer={step.answer} disabled={answered} onAnswer={onAnswer} />;
        case 'match':
            return <MatchActivity pairs={step.pairs} disabled={answered} onAnswer={onAnswer} />;
        case 'classify':
            return <ClassifyActivity categories={step.categories} items={step.items} disabled={answered} onAnswer={onAnswer} />;
        case 'order':
            return <OrderActivity items={step.items} disabled={answered} onAnswer={onAnswer} />;
    }
}
