import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateTranslation } from './validate-translations.mjs';
import { buildTranslation, prepareTextSet, textDraft } from './translate-activities.mjs';

const source = JSON.parse(fs.readFileSync(new URL('../content/activities/6/naturales/la-reproduccion-humana-y-la-pubertad.json', import.meta.url), 'utf8'));
const english = JSON.parse(fs.readFileSync(new URL('../content/activities/en/6/naturales/la-reproduccion-humana-y-la-pubertad.json', import.meta.url), 'utf8'));

test('reviewed sensitive translation retains its solutions and source alignment', () => {
    assert.deepEqual(validateTranslation(source, english), []);
    const rel = '6/sociales/la-guerra-civil-y-el-franquismo.json';
    const es = JSON.parse(fs.readFileSync(new URL(`../content/activities/${rel}`, import.meta.url), 'utf8'));
    const en = JSON.parse(fs.readFileSync(new URL(`../content/activities/en/${rel}`, import.meta.url), 'utf8'));
    assert.deepEqual(validateTranslation(es, en), []);
});

test('rejects changed correct answers and categories', () => {
    const wrong = structuredClone(english);
    wrong.activities[0].answer = 1;
    wrong.activities[2].items[0].category = 1;
    const errors = validateTranslation(source, wrong);
    assert.ok(errors.some(e => e.includes('answer')));
    assert.ok(errors.some(e => e.includes('category')));
});

test('rejects options collapsed into duplicates by translation', () => {
    const wrong = structuredClone(english);
    wrong.activities[0].options[1] = wrong.activities[0].options[0];
    assert.ok(validateTranslation(source, wrong).some(e => e.includes('duplicate options')));
});

test('rejects a stale translation after Spanish source edits', () => {
    const changed = structuredClone(source);
    changed.activities[0].explanation += ' Updated.';
    assert.ok(validateTranslation(changed, english).includes('Stale source hash'));
});

test('rejects omitted activities, missing text and invalid blanks', () => {
    const wrong = structuredClone(english);
    wrong.summary = '';
    wrong.activities[0].sentence = 'No blank here.';
    wrong.activities.pop();
    const errors = validateTranslation(source, wrong);
    assert.ok(errors.some(e => e.includes('missing text')));
    assert.ok(errors.some(e => e.includes('one blank')));
    assert.ok(errors.some(e => e.includes('different array length')));
});

test('automated translation cannot claim teacher review', () => {
    const wrong = structuredClone(english);
    wrong.meta.reviewed = true;
    assert.ok(validateTranslation(source, wrong).includes('Teacher review must remain pending'));
});

const manualKey = '6/naturales/la-reproduccion-humana-y-la-pubertad';
const introduction = Object.fromEntries(['temaNombre', 'title', 'summary', 'keyIdeas'].map(key => [key, english[key]]));

test('local import preserves answers and curriculum without claiming teacher review', () => {
    const imported = buildTranslation(manualKey, introduction, english.activities);
    assert.deepEqual(validateTranslation(source, imported), []);
    assert.deepEqual(imported.lomloe, source.lomloe);
    assert.equal(imported.meta.translation.validation, 'manual-review');
    assert.equal(imported.meta.reviewed, false);
});

test('local import rejects omitted hints rather than copying Spanish silently', () => {
    const activities = structuredClone(english.activities);
    delete activities[0].hint;
    assert.throws(() => buildTranslation(manualKey, introduction, activities), /hint: missing translation/);
});

test('local import rejects changed solutions and official curriculum references', () => {
    const activities = structuredClone(english.activities);
    activities[0].answer = 1;
    assert.throws(() => buildTranslation(manualKey, introduction, activities), /answer: cannot change solution or value/);
    assert.throws(() => buildTranslation(manualKey, { ...introduction, lomloe: {} }, english.activities), /lomloe: immutable field/);
});

const valueAt = (object, location) => location.replace(/\[(\d+)\]/g, '.$1').split('.').reduce((value, key) => value[key], object);
function compactTranslation() {
    const draft = textDraft(manualKey);
    return { key: draft.key, sourceHash: draft.sourceHash,
        introduction: draft.introduction.map(slot => valueAt(english, slot.path)),
        activities: draft.activities.map((activity, i) => activity.texts.map(slot => valueAt(english.activities[i], slot.path))),
    };
}

test('compact local import keeps each text in its original exercise field', () => {
    const patch = prepareTextSet(compactTranslation());
    const target = buildTranslation(patch.key, patch.introduction, patch.activities);
    assert.deepEqual(target.activities, english.activities);
});

test('compact local import rejects stale originals and incomplete exercise text', () => {
    const stale = compactTranslation();
    stale.sourceHash = 'old-source';
    assert.throws(() => prepareTextSet(stale), /source changed since reading/);
    const incomplete = compactTranslation();
    incomplete.activities[0].pop();
    assert.throws(() => prepareTextSet(incomplete), /non-empty translations/);
});
