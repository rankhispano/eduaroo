import assert from 'node:assert/strict';
import test from 'node:test';
import { activitySpeechSegments } from '../lib/curriculum/speech.ts';
import { toSteps } from '../lib/curriculum/steps.ts';

test('Spanish examples are spoken in Spanish inside English instructions', () => {
    const prompt = 'Count the sounds in «mesa», then compare «sol».';
    const segments = activitySpeechSegments({ prompt, lang: 'en', contentLang: 'es' });
    assert.equal(segments.map(s => s.text).join(''), prompt);
    assert.deepEqual(segments.filter(s => s.lang === 'es').map(s => s.text), ['«mesa»', '«sol»']);
    assert.equal(segments[0].lang, 'en');
    assert.equal(segments.at(-1).lang, 'en');
});

test('a fill sentence retains its study language after mixed instructions', () => {
    const segments = activitySpeechSegments({
        prompt: 'Complete the Spanish word «gato».', sentence: 'El ___ato maúlla.', lang: 'en', contentLang: 'es',
    });
    assert.deepEqual(segments.at(-1), { text: 'El ___ato maúlla.', lang: 'es' });
    assert.equal(segments[0].lang, 'en');
});

test('quotes do not switch language in monolingual activities', () => {
    assert.deepEqual(activitySpeechSegments({ prompt: 'Lee «sol».', lang: 'es' }), [{ text: 'Lee «sol».', lang: 'es' }]);
    assert.deepEqual(activitySpeechSegments({ prompt: 'Read “I am”.', lang: 'en' }), [{ text: 'Read “I am”.', lang: 'en' }]);
});

test('reading questions retain the study language for quoted examples', () => {
    const [step] = toSteps([{
        id: 'reading', type: 'reading', prompt: 'Read.', explanation: 'Letters.', lang: 'en', contentLang: 'es',
        title: 'Un cuento', text: 'El sol.', questions: [{ prompt: 'How does «sol» end?', options: ['l', 'm'], answer: 0, explanation: 'l' }],
    }], '1/lengua/example');
    assert.equal(step.lang, 'en');
    assert.equal(step.passage.lang, 'es');
    assert.deepEqual(activitySpeechSegments(step).find(s => s.lang === 'es'), { text: '«sol»', lang: 'es' });
});
