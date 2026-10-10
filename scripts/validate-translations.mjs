#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const sourceHash = (set) => createHash('sha256').update(JSON.stringify(set)).digest('hex');

export function validateTranslation(source, target) {
    const errors = [];
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    for (const key of ['id', 'cursoId', 'asignaturaId', 'temaId', 'lomloe']) if (!same(source[key], target[key])) errors.push(`${key} changed`);
    for (const key of ['generator', 'model', 'generatedAt', 'reviewed']) if (source.meta[key] !== target.meta[key]) errors.push(`source meta.${key} changed`);
    if (target.meta.reviewed !== false) errors.push('Teacher review must remain pending');
    if (target.meta.translation?.sourceHash !== sourceHash(source)) errors.push('Stale source hash');
    const compare = (a, b, location) => {
        if (Array.isArray(a)) {
            if (!Array.isArray(b) || a.length !== b.length) { errors.push(`${location}: different array length`); return; }
            a.forEach((v, i) => compare(v, b[i], `${location}[${i}]`));
        } else if (a && typeof a === 'object') {
            if (!b || typeof b !== 'object') { errors.push(`${location}: missing object`); return; }
            for (const [key, value] of Object.entries(a)) {
                if (key === 'meta' || key === 'lomloe') continue;
                if (key === 'lang') { if (b[key] !== 'en') errors.push(`${location}: instruction language is not English`); continue; }
                if (key === 'id' || key === 'type') { if (value !== b[key]) errors.push(`${location}.${key}: changed`); continue; }
                compare(value, b[key], `${location}.${key}`);
            }
        } else if (typeof a === 'string') {
            if (typeof b !== 'string' || !b.trim()) errors.push(`${location}: missing text`);
        } else if (a !== b) errors.push(`${location}: changed solution or value`);
    };
    compare(source, target, 'set');
    for (const a of target.activities || []) {
        const unique = (items, label) => { if (new Set(items.map(x => x.toLowerCase().trim())).size !== items.length) errors.push(`${a.id}: duplicate ${label}`); };
        if (a.options?.every(x => typeof x === 'string')) unique(a.options, 'options');
        if (a.type === 'fill-blank' && a.sentence?.split('___').length !== 2) errors.push(`${a.id}: must have one blank`);
        if (a.type === 'match' && a.pairs?.every(p => typeof p.left === 'string' && typeof p.right === 'string')) { unique(a.pairs.map(p => p.left), 'left pairs'); unique(a.pairs.map(p => p.right), 'right pairs'); }
        if (a.type === 'classify' && a.categories?.every(x => typeof x === 'string')) unique(a.categories, 'categories');
        if (a.type === 'order' && a.items?.every(x => typeof x === 'string')) unique(a.items, 'ordered items');
        if (a.type === 'reading') {
            const cap = Number(source.cursoId) <= 2 ? 60 : Number(source.cursoId) <= 4 ? 130 : 200;
            if ((a.text?.trim().split(/\s+/).length || 0) > cap) errors.push(`${a.id}: reading exceeds ${cap} words`);
            for (const q of a.questions || []) if (q.options?.every(x => typeof x === 'string')) unique(q.options, 'reading options');
            const original = source.activities.find(x => x.id === a.id);
            if (source.asignaturaId === 'lengua' && (a.text !== original.text || a.title !== original.title || a.contentLang !== 'es')) errors.push(`${a.id}: Spanish reading changed`);
        }
        if (a.lang !== 'en') errors.push(`${a.id}: instruction language is not English`);
    }
    return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../content/activities');
    let sets = 0;
    let activities = 0;
    const errors = [];
    for (let grade = 1; grade <= 6; grade++) for (const subject of fs.readdirSync(path.join(root, String(grade))).sort()) {
        for (const file of fs.readdirSync(path.join(root, String(grade), subject)).filter(f => f.endsWith('.json')).sort()) {
            const rel = `${grade}/${subject}/${file}`;
            const source = JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
            const output = path.join(root, 'en', rel);
            if (!fs.existsSync(output)) { errors.push(`${rel}: missing English translation`); continue; }
            const target = JSON.parse(fs.readFileSync(output, 'utf8'));
            errors.push(...validateTranslation(source, target).map(e => `${rel}: ${e}`));
            sets++; activities += target.activities.length;
        }
    }
    console.log(JSON.stringify({ sets, activities, errors }, null, 2));
    if (errors.length) process.exitCode = 1;
}
