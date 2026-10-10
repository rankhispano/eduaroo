#!/usr/bin/env node
// Local bookkeeping and imports for translations written and reviewed in this chat.
// No API client, credentials, network requests or external translator.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sourceHash, validateTranslation } from './validate-translations.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content/activities');
const REPORT = path.join(ROOT, 'docs/traduccion-actividades-en.json');
const immutable = new Set(['id', 'type', 'cursoId', 'asignaturaId', 'temaId', 'lomloe', 'meta']);

function setPath(key, english = false) {
    if (!/^[1-6]\/(mates|lengua|naturales|sociales|ingles)\/[a-z0-9-]+$/.test(key)) throw new Error(`Invalid activity key: ${key}`);
    return path.join(CONTENT, english ? 'en' : '', `${key}.json`);
}
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
function writeJson(file, value) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const temp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`);
    fs.renameSync(temp, file);
}

// Every display string is required: omitted hints cannot stay in Spanish unnoticed.
// Solutions, identity, provenance and official alignment come from the original.
export function buildTranslation(key, introduction, activities) {
    const source = read(setPath(key));
    const merge = (original, translated, location) => {
        if (Array.isArray(original)) {
            if (!Array.isArray(translated) || translated.length !== original.length) throw new Error(`${location}: wrong array length`);
            return original.map((value, i) => merge(value, translated[i], `${location}[${i}]`));
        }
        if (original && typeof original === 'object') {
            if (!translated || typeof translated !== 'object' || Array.isArray(translated)) throw new Error(`${location}: missing object`);
            for (const name of Object.keys(translated)) if (!Object.hasOwn(original, name)) throw new Error(`${location}.${name}: unknown field`);
            return Object.fromEntries(Object.entries(original).map(([name, value]) => {
                if (immutable.has(name)) {
                    if (Object.hasOwn(translated, name) && JSON.stringify(value) !== JSON.stringify(translated[name])) throw new Error(`${location}.${name}: immutable field`);
                    return [name, structuredClone(value)];
                }
                if (name === 'lang') return [name, 'en'];
                if (source.asignaturaId === 'lengua' && original.type === 'reading' && ['title', 'text'].includes(name)) {
                    if (Object.hasOwn(translated, name) && translated[name] !== value) throw new Error(`${location}.${name}: preserve Spanish reading`);
                    return [name, value];
                }
                return [name, merge(value, translated[name], `${location}.${name}`)];
            }));
        }
        if (typeof original === 'string') {
            if (typeof translated !== 'string' || !translated.trim()) throw new Error(`${location}: missing translation`);
            return translated;
        }
        if (translated !== undefined && translated !== original) throw new Error(`${location}: cannot change solution or value`);
        return original;
    };
    const target = merge(source, { ...introduction, activities }, key);
    target.activities.forEach(a => { a.lang = 'en'; if (source.asignaturaId === 'lengua') a.contentLang = 'es'; });
    target.meta.translation = {
        generator: 'manual-translation@1', model: 'Codex', translatedAt: new Date().toISOString(),
        sourceLocale: 'es', targetLocale: 'en', sourceHash: sourceHash(source), validation: 'manual-review',
    };
    const errors = validateTranslation(source, target);
    if (errors.length) throw new Error(`${key}: ${errors.join('; ')}`);
    return target;
}

function inventory(previous = {}) {
    const entries = [];
    for (let grade = 1; grade <= 6; grade++) for (const subject of fs.readdirSync(path.join(CONTENT, String(grade))).sort()) {
        for (const file of fs.readdirSync(path.join(CONTENT, String(grade), subject)).filter(f => f.endsWith('.json')).sort()) {
            const key = `${grade}/${subject}/${file.slice(0, -5)}`;
            const source = read(setPath(key));
            const target = fs.existsSync(setPath(key, true)) ? read(setPath(key, true)) : null;
            const errors = target ? validateTranslation(source, target) : [];
            const sourceChecksum = sourceHash(source);
            const translationChecksum = target ? sourceHash(target) : null;
            const old = previous.entries?.find(e => e.key === key);
            const reviewed = old?.status === 'completed' && old.sourceHash === sourceChecksum && old.translationHash === translationChecksum;
            entries.push({ key, activityCount: source.activities.length, sourceHash: sourceChecksum, translationHash: translationChecksum,
                status: !target ? 'pending' : errors.length ? 'needs_fix' : reviewed ? 'completed' : 'translated_needs_review',
                ...(reviewed ? { reviewedAt: old.reviewedAt, notes: old.notes } : {}), ...(errors.length ? { errors } : {}),
            });
        }
    }
    return entries;
}

function progress(entries) {
    return {
        totalSets: entries.length,
        completedSets: entries.filter(e => e.status === 'completed').length,
        pendingSets: entries.filter(e => e.status !== 'completed').length,
        totalActivities: entries.reduce((sum, e) => sum + e.activityCount, 0),
        completedActivities: entries.filter(e => e.status === 'completed').reduce((sum, e) => sum + e.activityCount, 0),
        invalidSets: entries.filter(e => e.status === 'needs_fix').length,
    };
}
function current() { return fs.existsSync(REPORT) ? read(REPORT) : { entries: [], batches: [] }; }

function updateMarkdown(report) {
    const file = path.join(ROOT, 'docs/traduccion-actividades-en.md');
    if (!fs.existsSync(file)) return;
    const c = report.coverage;
    const subjects = ['naturales', 'sociales', 'mates', 'lengua', 'ingles'];
    const rows = ['| Curso | Naturales | Sociales | Matemáticas | Lengua | Inglés |', '| --- | --- | --- | --- | --- | --- |'];
    for (let grade = 1; grade <= 6; grade++) rows.push(`| ${grade}.º | ${subjects.map(subject => {
        const entries = report.entries.filter(e => e.key.startsWith(`${grade}/${subject}/`));
        return `${entries.filter(e => e.status === 'completed').length}/${entries.length}`;
    }).join(' | ')} |`);
    const date = new Date(report.updatedAt).toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid', day: 'numeric', month: 'long', year: 'numeric' });
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/^Estado a .*$/m, `Estado a ${date}: **${c.completedSets} de ${c.totalSets} JSON traducidos y revisados; ${c.completedActivities} de ${c.totalActivities} actividades. Quedan ${c.pendingSets} JSON**. La revisión pedagógica de los originales está terminada y se documenta en [el informe general](revision-pedagogica-actividades.md).`);
    content = content.replace(/<!-- progress:start -->[\s\S]*?<!-- progress:end -->/, `<!-- progress:start -->\n${rows.join('\n')}\n<!-- progress:end -->`);
    fs.writeFileSync(file, content);
}

// This command declares that the author compared meaning, age suitability and
// every solution with the Spanish original. Structural checks cannot do that.
export function recordReviewed(keys, notes) {
    if (!keys.length || !notes?.trim()) throw new Error('Provide reviewed keys and concrete review notes');
    const previous = current();
    const entries = inventory(previous);
    for (const key of keys) {
        setPath(key);
        const entry = entries.find(e => e.key === key);
        if (!entry || ['pending', 'needs_fix'].includes(entry.status)) throw new Error(`${key}: missing or invalid translation`);
    }
    const reviewedAt = new Date().toISOString();
    for (const entry of entries) if (keys.includes(entry.key)) Object.assign(entry, { status: 'completed', reviewedAt, notes });
    const report = { version: 1, method: 'manual-in-chat', sourceLocale: 'es', targetLocale: 'en', externalTranslationServices: false,
        updatedAt: reviewedAt, coverage: progress(entries),
        batches: [...(previous.batches || []), { reviewedAt, keys, notes }], entries,
    };
    writeJson(REPORT, report);
    updateMarkdown(report);
    return report.coverage;
}

export function importBatch(sets, notes) {
    if (!Array.isArray(sets) || !sets.length || !notes?.trim()) throw new Error('Provide a batch and its manual review notes');
    if (new Set(sets.map(s => s.key)).size !== sets.length) throw new Error('Duplicate keys in batch');
    const prepared = sets.map(s => ({ key: s.key, target: buildTranslation(s.key, s.introduction, s.activities) }));
    for (const item of prepared) writeJson(setPath(item.key, true), item.target);
    return recordReviewed(prepared.map(s => s.key), notes);
}

// Compact input for hand-written batches. Only display text is replaced;
// each activity has its own ordered text list to avoid crossing activity bounds.
function textSlots(value, spanishReading = false, location = '', slots = []) {
    if (Array.isArray(value)) value.forEach((item, i) => textSlots(item, spanishReading, `${location}[${i}]`, slots));
    else if (value && typeof value === 'object') {
        for (const [name, item] of Object.entries(value)) {
            if (immutable.has(name) || ['lang', 'contentLang'].includes(name)) continue;
            if (spanishReading && value.type === 'reading' && ['title', 'text'].includes(name)) continue;
            textSlots(item, spanishReading, location ? `${location}.${name}` : name, slots);
        }
    } else if (typeof value === 'string') slots.push({ path: location, text: value });
    return slots;
}

function replaceTexts(value, texts, spanishReading = false) {
    const slots = textSlots(value, spanishReading);
    if (!Array.isArray(texts) || texts.length !== slots.length || texts.some(t => typeof t !== 'string' || !t.trim())) throw new Error(`Expected ${slots.length} non-empty translations`);
    let index = 0;
    const visit = item => {
        if (Array.isArray(item)) return item.map(visit);
        if (item && typeof item === 'object') return Object.fromEntries(Object.entries(item).map(([name, child]) => {
            if (immutable.has(name) || ['lang', 'contentLang'].includes(name) || (spanishReading && item.type === 'reading' && ['title', 'text'].includes(name))) return [name, structuredClone(child)];
            return [name, visit(child)];
        }));
        return typeof item === 'string' ? texts[index++] : item;
    };
    return visit(value);
}

export function textDraft(key) {
    const source = read(setPath(key));
    const { activities, ...intro } = source;
    return { key, sourceHash: sourceHash(source), introduction: textSlots(intro),
        activities: activities.map(a => ({ type: a.type, texts: textSlots(a, source.asignaturaId === 'lengua'),
            ...(a.answer !== undefined ? { answer: a.answer } : {}),
            ...(a.type === 'classify' ? { categories: a.items.map(i => i.category) } : {}),
            ...(a.type === 'reading' ? { answers: a.questions.map(q => q.answer), ...(source.asignaturaId === 'lengua' ? { spanishPassage: { title: a.title, text: a.text } } : {}) } : {}),
        })),
    };
}

export function prepareTextSet(set) {
    const source = read(setPath(set.key));
    if (set.sourceHash !== sourceHash(source)) throw new Error(`${set.key}: source changed since reading`);
    if (!Array.isArray(set.activities) || set.activities.length !== source.activities.length) throw new Error(`${set.key}: wrong activity count`);
    const { activities, ...intro } = source;
    const translated = replaceTexts(intro, set.introduction);
    for (const name of immutable) delete translated[name];
    return { key: set.key, introduction: translated, activities: activities.map((a, i) => replaceTexts(a, set.activities[i], source.asignaturaId === 'lengua')) };
}

export function importTextBatch(sets, notes) {
    if (!Array.isArray(sets)) throw new Error('Provide an array of translated sets');
    return importBatch(sets.map(prepareTextSet), notes);
}

function priority(entry) {
    const [grade, subject] = entry.key.split('/');
    return ['naturales', 'sociales'].includes(subject) ? (6 - Number(grade)) * 2 + Number(subject === 'sociales') : 20 + Number(grade);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const argv = process.argv.slice(2);
    const options = {};
    const keys = [];
    for (let i = 0; i < argv.length; i++) {
        if (['--next', '--curso', '--asignatura', '--read', '--draft', '--import', '--import-texts', '--notes'].includes(argv[i])) {
            const name = argv[i].slice(2);
            if (!argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(`Missing value for ${argv[i]}`);
            options[name] = argv[++i];
        } else if (['--status', '--record'].includes(argv[i])) options[argv[i].slice(2)] = true;
        else if (argv[i].startsWith('--')) throw new Error(`Unknown option ${argv[i]}`);
        else keys.push(argv[i]);
    }
    if (options.read) console.log(JSON.stringify(read(setPath(options.read)), null, 2));
    else if (options.draft) console.log(JSON.stringify(textDraft(options.draft)));
    else if (options['import-texts']) {
        const batch = read(path.resolve(options['import-texts']));
        console.log(JSON.stringify(importTextBatch(batch.sets, options.notes || batch.notes), null, 2));
    }
    else if (options.import) {
        const batch = read(path.resolve(options.import));
        console.log(JSON.stringify(importBatch(batch.sets, options.notes || batch.notes), null, 2));
    } else if (options.record) console.log(JSON.stringify(recordReviewed(keys, options.notes), null, 2));
    else {
        const entries = inventory(current());
        if (options.next) {
            const count = Number(options.next);
            if (!Number.isInteger(count) || count < 1 || count > 20) throw new Error('--next must be 1-20');
            console.log(JSON.stringify(entries.filter(e => e.status !== 'completed' && (!options.curso || e.key.startsWith(`${options.curso}/`)) && (!options.asignatura || e.key.split('/')[1] === options.asignatura))
                .sort((a, b) => priority(a) - priority(b) || a.key.localeCompare(b.key)).slice(0, count).map(e => ({ key: e.key, status: e.status, activities: e.activityCount })), null, 2));
        } else console.log(JSON.stringify(progress(entries), null, 2));
    }
}
