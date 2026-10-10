type SpeechLanguage = 'es' | 'en';

export type SpeechSegment = { text: string; lang: SpeechLanguage };

/** Guillemets mark examples in the language being studied, within translated instructions. */
export function activitySpeechSegments(step: {
    prompt: string;
    sentence?: string;
    lang?: SpeechLanguage;
    contentLang?: SpeechLanguage;
}): SpeechSegment[] {
    const lang = step.lang ?? 'es';
    const contentLang = step.contentLang ?? lang;
    const segments: SpeechSegment[] = [];
    if (contentLang === lang) {
        segments.push({ text: step.prompt, lang });
    } else {
        let start = 0;
        for (const match of step.prompt.matchAll(/«[^»]+»/g)) {
            if (match.index > start) segments.push({ text: step.prompt.slice(start, match.index), lang });
            segments.push({ text: match[0], lang: contentLang });
            start = match.index + match[0].length;
        }
        if (start < step.prompt.length) segments.push({ text: step.prompt.slice(start), lang });
    }
    if (step.sentence) segments.push({ text: step.sentence, lang: contentLang });
    return segments;
}
