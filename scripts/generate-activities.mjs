#!/usr/bin/env node
/**
 * ==============================================================================
 * GENERADOR DE ACTIVIDADES LOMLOE - EDUAROO
 * ==============================================================================
 *
 * Genera bloques de actividades ORIGINALES para cada tema de src/data/curriculum.ts,
 * alineados con los criterios de evaluación y saberes básicos del RD 157/2022
 * (lib/curriculum/lomloe/*.json). No parte de bancos de preguntas de terceros.
 *
 * Salida:
 *   content/activities/<curso>/<asignatura>/<tema>.json   (un ActivitySet por tema)
 *   content/activities/registry.ts                         (índice que usa la web)
 *
 * Uso:
 *   node scripts/generate-activities.mjs --list
 *   node scripts/generate-activities.mjs --list --curso 3
 *   node scripts/generate-activities.mjs --curso 3 --asignatura sociales --limit 2
 *   node scripts/generate-activities.mjs --curso 4 --asignatura ingles --tema daily-routines
 *   node scripts/generate-activities.mjs --curso 3 --asignatura sociales --tema la-poblacion --append
 *   node scripts/generate-activities.mjs --curso 3 --asignatura sociales --dry-run
 *   node scripts/generate-activities.mjs --registry          (solo regenera el índice)
 *
 * Opciones:
 *   -c, --curso <1-6>          Curso de Primaria
 *   -a, --asignatura <id>      lengua | mates | naturales | sociales | ingles
 *   -t, --tema <id>            Id del tema (slug, ver --list)
 *   -l, --limit <n>            Máximo de temas a generar en esta tanda
 *   -n, --count <n>            Actividades por tema [Defecto: 10]
 *   --append                   Añade actividades nuevas a un tema ya generado
 *   -f, --force                Regenera desde cero un tema ya generado
 *   --include-covered          Incluye temas que ya tienen recursos hechos a mano
 *   --verify / --no-verify     Segunda pasada que resuelve cada actividad a ciegas y descarta
 *                              las que no coinciden [Defecto: activa solo en mates]
 *   -d, --delay <segundos>     Pausa entre llamadas [Defecto: 10]
 *   -m, --model <nombre>       Modelo Gemini [Defecto: GEMINI_MODEL o gemini-3.8-flash]
 *   --aistudio                 Usa el endpoint de Google AI Studio en lugar de Vertex AI
 *   --dry-run                  Muestra el prompt del primer tema sin llamar a la API
 *   --list                     Muestra la cobertura de temas
 *   --registry                 Regenera content/activities/registry.ts y termina
 *   -h, --help                 Muestra esta ayuda
 *
 * Variables de entorno (se leen también de .env.local):
 *   GEMINI_API_KEY, GEMINI_MODEL, GCP_PROJECT_ID, GCP_LOCATION
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Silencia el aviso de Node al importar src/data/curriculum.ts sin "type": "module"
process.removeAllListeners('warning');
process.on('warning', (w) => {
    if (w.code !== 'MODULE_TYPELESS_PACKAGE_JSON') console.warn(w);
});

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'activities');
const CATALOG_DIR = path.join(ROOT, 'lib', 'curriculum', 'lomloe');
const GENERATOR = 'generate-activities@1';

// Mismo mapa que lib/curriculum/lomloe.ts (ASIGNATURA_LOMLOE): mantenlos iguales.
const ASIGNATURA_LOMLOE = {
    mates: { area: 'matematicas' },
    lengua: { area: 'lengua-castellana' },
    naturales: { area: 'conocimiento-medio', competencies: ['CE1', 'CE2', 'CE3', 'CE4', 'CE5', 'CE6'], blocks: ['A', 'B'] },
    sociales: { area: 'conocimiento-medio', competencies: ['CE1', 'CE2', 'CE5', 'CE6', 'CE7', 'CE8', 'CE9'], blocks: ['C'] },
    ingles: { area: 'lengua-extranjera' },
};

const ACTIVITY_TYPES = ['choice', 'true-false', 'fill-blank', 'match', 'classify', 'order', 'reading'];

const MATH_RULES = `MATEMÁTICAS (muy importante):
- Notación escolar española: punto de miles (12.500), coma decimal (3,5), "×" para multiplicar, "÷" para dividir, fracciones como 3/4, unidades con espacio (5 km, 2,5 kg, 3,50 €).
- Usa números del rango del tema y del curso; no adelantes contenidos de cursos superiores.
- Antes de escribir cada actividad, resuelve tú el cálculo paso a paso y comprueba el resultado. Si una respuesta no es exacta e indiscutible, cambia los datos.
- Problemas: incluye solo los datos necesarios y una única pregunta; los resultados deben ser números "amables" salvo que el tema trabaje decimales o restos.
- "explanation": muestra el procedimiento con las operaciones (ej. "45 + 28 = 73: sumamos unidades 5 + 8 = 13, llevamos 1...").
- Distractores = errores típicos: olvidar la llevada, operar al revés, confundir unidades, sumar en vez de multiplicar, colocar mal la coma.
- Incluye al menos 1 actividad de "encuentra el error" (un personaje resuelve mal algo y el alumno detecta el fallo) y 1 de cálculo mental o estimación.
- En primer ciclo puedes representar cantidades pequeñas con emojis repetidos (🍎🍎🍎, máximo 10).
- Usa "order" para ordenar números o pasos de un procedimiento y "classify" para propiedades (par/impar, mayor/menor que, figuras...).`;

const SUBJECT_RULES = {
    lengua: `LENGUA (muy importante):
- Ortografía y gramática según la norma actual de la RAE (Ortografía de 2010): "solo" y los demostrativos sin tilde, "guion" sin tilde, etc. No enseñes reglas desfasadas.
- Usa la terminología escolar habitual en España (sustantivo, determinante, sujeto y predicado...) adaptada al curso; no adelantes análisis de cursos superiores.
- Para ortografía, los distractores deben ser las faltas que de verdad cometen los niños (b/v, g/j, h, ll/y, tildes), y la explicación debe citar la regla.
- Los textos de lectura deben ser originales, nunca fragmentos de obras con derechos de autor. Si el tema trata un autor u obra clásica, escribe un resumen o una adaptación propia.
- Incluye al menos 1 actividad de comprensión o uso en contexto (no solo teoría) y 1 de "encuentra el error" en una frase.`,
    naturales: `CIENCIAS NATURALES (muy importante):
- Rigor científico adaptado a la edad: simplifica sin decir cosas falsas (ej. no digas que la sangre venosa es azul ni que la lengua tiene zonas para cada sabor).
- Usa situaciones de observación y pequeños experimentos SEGUROS que se puedan hacer en casa o en clase con supervisión; nada con fuego, electricidad de la red, productos químicos peligrosos o animales en riesgo.
- Conecta con hábitos saludables y cuidado del medio ambiente cuando encaje.
- Incluye al menos 1 actividad de razonamiento científico (predecir qué pasará, interpretar un resultado) y 1 de "encuentra el error" en una idea equivocada frecuente.`,
    sociales: `CIENCIAS SOCIALES (muy importante):
- Datos geográficos e históricos exactos y actuales (comunidades, capitales, instituciones, fechas). Si dudas de un dato, no lo uses.
- Trata la historia con perspectiva de género y diversidad, sin anacronismos ni juicios simplistas; temas sensibles (guerras, dictadura) con rigor y lenguaje adecuado a la edad.
- Incluye al menos 1 actividad de razonamiento (causas y consecuencias, comparar épocas o lugares).`,
};

const CYCLE_STYLE = {
    1: 'Primer ciclo (6-8 años). Frases muy cortas (máximo 12 palabras), vocabulario cercano y concreto, números pequeños. Si hay lectura, máximo 60 palabras. Evita la doble negación y las preguntas trampa.',
    2: 'Segundo ciclo (8-10 años). Frases claras (máximo 20 palabras). Si hay lectura, entre 80 y 130 palabras. Puedes plantear pequeños problemas de dos pasos.',
    3: 'Tercer ciclo (10-12 años). Puedes usar frases más elaboradas y razonamiento. Si hay lectura, entre 120 y 200 palabras, con alguna pregunta inferencial o crítica.',
};

// -----------------------------------------------------------------------------
// UTILIDADES
// -----------------------------------------------------------------------------

function parseArgs(argv) {
    const alias = { c: 'curso', a: 'asignatura', t: 'tema', l: 'limit', n: 'count', f: 'force', d: 'delay', m: 'model', h: 'help' };
    const flags = new Set(['append', 'force', 'include-covered', 'aistudio', 'dry-run', 'list', 'registry', 'help', 'verify', 'no-verify']);
    const args = {};
    for (let i = 0; i < argv.length; i++) {
        const raw = argv[i].replace(/^-+/, '');
        const key = alias[raw] ?? raw;
        if (flags.has(key)) args[key] = true;
        else args[key] = argv[++i];
    }
    return args;
}

function loadEnv() {
    for (const file of ['.env.local', '.env']) {
        try {
            process.loadEnvFile(path.join(ROOT, file));
        } catch {
            // El archivo no existe: se usan las variables del entorno
        }
    }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function shuffleWithAnswer(options, answer) {
    const order = options.map((_, i) => i).sort(() => Math.random() - 0.5);
    return { options: order.map((i) => options[i]), answer: order.indexOf(answer) };
}

const isText = (v) => typeof v === 'string' && v.trim().length > 0;
const clean = (v) => String(v).trim();

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// -----------------------------------------------------------------------------
// CURRÍCULO Y CATÁLOGO LOMLOE
// -----------------------------------------------------------------------------

async function loadCurriculum() {
    // Node >= 22.18 importa .ts directamente (type stripping)
    const mod = await import(pathToFileURL(path.join(ROOT, 'src', 'data', 'curriculum.ts')).href);
    return mod.curriculum;
}

function loadCatalog(area) {
    return readJson(path.join(CATALOG_DIR, `${area}.json`));
}

function lomloeContext(asignaturaId, grade) {
    const map = ASIGNATURA_LOMLOE[asignaturaId];
    const catalog = loadCatalog(map.area);
    const cycle = Math.min(3, Math.max(1, Math.ceil(grade / 2)));
    const cycleData = catalog.cycles.find((c) => c.cycle === cycle);
    const competencies = catalog.competencies.filter((c) => !map.competencies || map.competencies.includes(c.id));
    const criteria = cycleData.criteria.filter((c) => !map.competencies || map.competencies.includes(c.competency));
    const blocks = cycleData.basicKnowledge.filter((b) => !map.blocks || map.blocks.includes(b.id));
    const knowledgeLabels = blocks.flatMap((b) =>
        b.sections.map((s) => (s.title ? `${b.id}. ${b.title} › ${s.title}` : `${b.id}. ${b.title}`)),
    );
    return { area: map.area, areaName: catalog.name, cycle, competencies, criteria, blocks, knowledgeLabels };
}

// -----------------------------------------------------------------------------
// PROMPT
// -----------------------------------------------------------------------------

function buildPrompt({ curso, asignatura, tema, ctx, count, existing }) {
    const isMath = asignatura.id === 'mates';
    const isEnglish = asignatura.id === 'ingles';
    const criteriaBlock = ctx.criteria.map((c) => `- ${c.id} (${c.competency}): ${c.text}`).join('\n');
    const knowledgeBlock = ctx.blocks
        .map((b) =>
            b.sections
                .map((s) => {
                    const label = s.title ? `${b.id}. ${b.title} › ${s.title}` : `${b.id}. ${b.title}`;
                    return `* ${label}\n${s.items.map((i) => `    – ${i}`).join('\n')}`;
                })
                .join('\n'),
        )
        .join('\n');
    const otherTemas = asignatura.temas.map((t) => t.nombre).join(' | ');
    const existingBlock = existing?.length
        ? `\nYA EXISTEN ESTAS ACTIVIDADES EN EL TEMA (no las repitas ni las parafrasees, busca situaciones nuevas):\n${existing.map((a) => `- ${a.prompt}`).join('\n')}\n`
        : '';

    const coveredBlock = tema.recursos.length
        ? `\nEste tema ya tiene en Eduaroo estos recursos: ${tema.recursos.map((r) => `"${r.titulo}" (${r.tipo}: ${r.descripcion ?? ''})`).join('; ')}. Esos ejercicios generan operaciones sueltas: este bloque debe COMPLEMENTARLOS con situaciones contextualizadas, razonamiento y análisis de errores, sin repetir ejercicios mecánicos.\n`
        : '';

    const languageRules = isEnglish
        ? `IDIOMA (Inglés como lengua extranjera):
- "prompt", "sentence", "options", "pairs", "items", "text" y "questions" van en INGLÉS sencillo, adecuado al nivel (A1 o inferior) y con "lang": "en".
- Si el enunciado necesita una instrucción, puede ir en español breve antes del contenido en inglés (ej. "Elige la palabra correcta: I ___ a dog.").
- "explanation", "hint", "keyIdeas", "title" y "summary" van en ESPAÑOL para guiar al alumno.
- Prioriza vocabulario funcional, rutinas y expresiones cotidianas; nada de terminología gramatical compleja.`
        : `IDIOMA: todo en español de España (euros, sistema métrico, decimales con coma: 2,5). "lang": "es".`;

    return `Actúas como maestro/a de Educación Primaria en España experto/a en el currículo LOMLOE (Real Decreto 157/2022) y como diseñador/a de actividades interactivas para niños.
Tu misión es crear un bloque de práctica 100% ORIGINAL para que el alumnado repase en casa lo aprendido en el cole.

CONTEXTO
- Curso: ${curso.nombre}
- Asignatura: ${asignatura.nombre} (área LOMLOE: ${ctx.areaName})
- Tema: "${tema.nombre}"
- Otros temas del curso (no los mezcles): ${otherTemas}
- ${CYCLE_STYLE[ctx.cycle]}

CRITERIOS DE EVALUACIÓN DEL CICLO (elige 1-3 que trabaje este tema; usa SOLO estos ids):
${criteriaBlock}

SABERES BÁSICOS DEL CICLO (contenido de referencia):
${knowledgeBlock}

ETIQUETAS VÁLIDAS PARA "basicKnowledge" (elige 1-3 y cópialas exactamente):
${ctx.knowledgeLabels.map((l) => `- ${l}`).join('\n')}
${existingBlock}${coveredBlock}
ESTILO EDUAROO
- Tono cercano, alegre y motivador; trata al alumno de tú.
- Contextos de la vida cotidiana: el cole, el recreo, la familia, el barrio, el mercado, excursiones, deportes, animales.
- Nombres variados y diversos (Lucía, Hugo, Aisha, Wei, Martina, Adrián, Nerea, Omar...), con igualdad de género y sin estereotipos. Sin marcas comerciales.
- Puedes usar algún emoji en el enunciado si ayuda (🍬, 🚌, 🌳), sin abusar.
- Los distractores deben reflejar ERRORES TÍPICOS del alumnado en este tema, nunca opciones absurdas. Prohibido "todas las anteriores" o "ninguna de las anteriores".
- Una sola respuesta correcta, indiscutible y comprobable. Revisa cálculos y datos dos veces: el contenido lo leerán niños.
- "explanation": 1-3 frases que expliquen POR QUÉ es así (feedback formativo), sin regañar. Texto plano, sin markdown.
- "hint" (opcional): una pista breve que no dé la respuesta.
- Las actividades son SOLO TEXTO: nunca menciones imágenes, dibujos, figuras, mapas o tablas que no estén escritos en el propio enunciado. Si hace falta un dato, escríbelo.
- No escribas la solución dentro de los elementos de "order", "classify" o "match" (ej. "Cuadrado de 4 cm (16 cm)"): el alumno debe calcularla.

${languageRules}
${isMath ? `\n${MATH_RULES}\n` : ''}${SUBJECT_RULES[asignatura.id] ? `\n${SUBJECT_RULES[asignatura.id]}\n` : ''}
TIPOS DE ACTIVIDAD DISPONIBLES (JSON exacto de cada uno):
- {"type":"choice","prompt":"...","options":["...","...","..."],"answer":0,"explanation":"...","hint":"...","lang":"es"}  → 3 o 4 opciones; "answer" es el índice correcto.
- {"type":"true-false","prompt":"Afirmación para valorar","answer":true,"explanation":"...","lang":"es"}
- {"type":"fill-blank","prompt":"Instrucción breve","sentence":"Frase con ___ en el hueco","options":["...","...","..."],"answer":1,"explanation":"...","lang":"es"}  → exactamente un "___".
- {"type":"match","prompt":"Une cada ... con su ...","pairs":[{"left":"...","right":"..."}],"explanation":"...","lang":"es"}  → 3 a 5 pares, sin textos repetidos.
- {"type":"classify","prompt":"Clasifica ...","categories":["...","..."],"items":[{"text":"...","category":0}],"explanation":"...","lang":"es"}  → 2 o 3 categorías, 4 a 8 elementos, todas las categorías con al menos un elemento.
- {"type":"order","prompt":"Ordena ...","items":["primero","segundo","tercero"],"explanation":"...","lang":"es"}  → 3 a 6 elementos EN EL ORDEN CORRECTO (la web los desordena).
- {"type":"reading","prompt":"Lee el texto y responde","title":"...","text":"...","questions":[{"prompt":"...","options":["...","...","..."],"answer":0,"explanation":"..."}],"explanation":"...","lang":"es"}  → 2 a 4 preguntas (literal, inferencial y, en 3er ciclo, alguna crítica).

COMPOSICIÓN DEL BLOQUE
- Exactamente ${count} actividades, de menos a más dificultad (2-3 fáciles para empezar, reto al final).
- Usa al menos 4 tipos distintos y elige el tipo que mejor sirva al contenido: "order" para procesos, secuencias o líneas del tiempo; "classify" para categorías; "match" para relaciones; "reading" (máximo 1) para comprensión en Lengua, Ciencias o Inglés.
- Al menos 2 actividades deben ser situaciones o problemas contextualizados (enfoque competencial LOMLOE), no solo memoria.

FORMATO DE SALIDA: devuelve ÚNICAMENTE un objeto JSON válido:
{
  "title": "Título atractivo del bloque (máx. 6 palabras)",
  "summary": "Una frase que diga qué va a practicar el alumno",
  "keyIdeas": ["Idea clave 1 para recordar antes de practicar (máx. 25 palabras)", "Idea clave 2", "Idea clave 3"],
  "criteria": ["2.1"],
  "basicKnowledge": ["A. Sentido numérico › Cantidad"],
  "activities": [ ... ]
}`;
}

// -----------------------------------------------------------------------------
// VALIDACIÓN
// -----------------------------------------------------------------------------

function validateOptions(options, answer, label) {
    if (!Array.isArray(options) || options.length < 2 || options.length > 4) throw new Error(`${label}: necesita 2-4 opciones`);
    const texts = options.map((o) => (isText(o) ? clean(o) : null));
    if (texts.includes(null)) throw new Error(`${label}: opción vacía`);
    if (new Set(texts.map((t) => t.toLowerCase())).size !== texts.length) throw new Error(`${label}: opciones repetidas`);
    if (!Number.isInteger(answer) || answer < 0 || answer >= texts.length) throw new Error(`${label}: "answer" fuera de rango`);
    return shuffleWithAnswer(texts, answer);
}

function normalizeActivity(raw, id, defaultLang) {
    if (!raw || !ACTIVITY_TYPES.includes(raw.type)) throw new Error(`tipo desconocido "${raw?.type}"`);
    if (!isText(raw.prompt)) throw new Error('falta "prompt"');
    if (!isText(raw.explanation)) throw new Error('falta "explanation"');

    const base = {
        id,
        type: raw.type,
        prompt: clean(raw.prompt),
        explanation: clean(raw.explanation),
        ...(isText(raw.hint) ? { hint: clean(raw.hint) } : {}),
        lang: raw.lang === 'en' ? 'en' : defaultLang,
    };

    switch (raw.type) {
        case 'choice':
            return { ...base, ...validateOptions(raw.options, raw.answer, 'choice') };
        case 'true-false':
            if (typeof raw.answer !== 'boolean') throw new Error('true-false: "answer" debe ser booleano');
            return { ...base, answer: raw.answer };
        case 'fill-blank': {
            if (!isText(raw.sentence) || raw.sentence.split('___').length !== 2) throw new Error('fill-blank: "sentence" necesita un único ___');
            return { ...base, sentence: clean(raw.sentence), ...validateOptions(raw.options, raw.answer, 'fill-blank') };
        }
        case 'match': {
            const pairs = Array.isArray(raw.pairs) ? raw.pairs.filter((p) => isText(p?.left) && isText(p?.right)) : [];
            if (pairs.length < 3 || pairs.length > 5) throw new Error('match: necesita 3-5 pares');
            const lefts = new Set(pairs.map((p) => clean(p.left).toLowerCase()));
            const rights = new Set(pairs.map((p) => clean(p.right).toLowerCase()));
            if (lefts.size !== pairs.length || rights.size !== pairs.length) throw new Error('match: textos repetidos');
            return { ...base, pairs: pairs.map((p) => ({ left: clean(p.left), right: clean(p.right) })) };
        }
        case 'classify': {
            const categories = Array.isArray(raw.categories) ? raw.categories.filter(isText).map(clean) : [];
            if (categories.length < 2 || categories.length > 3) throw new Error('classify: necesita 2-3 categorías');
            const items = Array.isArray(raw.items) ? raw.items : [];
            if (items.length < 4 || items.length > 8) throw new Error('classify: necesita 4-8 elementos');
            for (const item of items) {
                if (!isText(item?.text) || !Number.isInteger(item.category) || item.category < 0 || item.category >= categories.length) {
                    throw new Error('classify: elemento inválido');
                }
            }
            if (new Set(items.map((i) => i.category)).size !== categories.length) throw new Error('classify: alguna categoría vacía');
            return { ...base, categories, items: items.map((i) => ({ text: clean(i.text), category: i.category })) };
        }
        case 'order': {
            const items = Array.isArray(raw.items) ? raw.items.filter(isText).map(clean) : [];
            if (items.length < 3 || items.length > 6) throw new Error('order: necesita 3-6 elementos');
            if (new Set(items).size !== items.length) throw new Error('order: elementos repetidos');
            return { ...base, items };
        }
        case 'reading': {
            if (!isText(raw.title) || !isText(raw.text)) throw new Error('reading: falta título o texto');
            const questions = Array.isArray(raw.questions) ? raw.questions : [];
            if (questions.length < 2 || questions.length > 4) throw new Error('reading: necesita 2-4 preguntas');
            return {
                ...base,
                title: clean(raw.title),
                text: clean(raw.text),
                questions: questions.map((q, i) => {
                    if (!isText(q?.prompt) || !isText(q?.explanation)) throw new Error(`reading: pregunta ${i + 1} incompleta`);
                    return { prompt: clean(q.prompt), explanation: clean(q.explanation), ...validateOptions(q.options, q.answer, `reading[${i}]`) };
                }),
            };
        }
    }
}

// El modelo no siempre copia la etiqueta literal ("Sentido numérico > Cantidad", sin la letra del bloque...)
const normalizeLabel = (v) =>
    String(v)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/^\*?\s*[a-h]\.\s*/, '')
        .replace(/[›>/|:–-]+/g, ' ')
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

function matchKnowledgeLabel(raw, labels) {
    const wanted = normalizeLabel(raw);
    if (!wanted) return null;
    const found =
        labels.find((l) => normalizeLabel(l) === wanted) ??
        labels.find((l) => normalizeLabel(l).includes(wanted) || wanted.includes(normalizeLabel(l))) ??
        labels.find((l) => l.includes('›') && wanted.includes(normalizeLabel(l.split('›')[1])));
    if (!found) console.log(`\x1b[33m  [Saber básico no reconocido]: ${raw}\x1b[0m`);
    return found ?? null;
}

async function buildSet({ ai, curso, asignatura, tema, ctx, model, previous, count, verify }) {
    const setId = `g${curso.id}-${asignatura.id}-${tema.id}`;
    const defaultLang = asignatura.id === 'ingles' ? 'en' : 'es';
    const offset = previous?.activities.length ?? 0;

    let activities = [];
    const rawActivities = Array.isArray(ai.activities) ? ai.activities : [];
    rawActivities.forEach((raw, i) => {
        try {
            activities.push(normalizeActivity(raw, `tmp-${i + 1}`, defaultLang));
        } catch (err) {
            console.log(`\x1b[33m  [Descartada actividad ${i + 1}]: ${err.message}\x1b[0m`);
        }
    });
    if (verify) activities = await verify(activities);
    activities = activities.map((a, i) => ({ ...a, id: `${setId}-${String(offset + i + 1).padStart(2, '0')}` }));
    if (activities.length < Math.ceil(count / 2)) {
        throw new Error(`solo ${activities.length}/${count} actividades válidas`);
    }

    const validCriteria = new Set(ctx.criteria.map((c) => c.id));
    const criteria = [...new Set([...(previous?.lomloe.criteria ?? []), ...(ai.criteria ?? []).map(String)])].filter((c) => validCriteria.has(c));
    if (criteria.length === 0) throw new Error('ningún criterio de evaluación válido');

    const competencies = [...new Set(ctx.criteria.filter((c) => criteria.includes(c.id)).map((c) => c.competency))];
    const descriptors = [...new Set(ctx.competencies.filter((c) => competencies.includes(c.id)).flatMap((c) => c.descriptors))].sort();
    const basicKnowledge = [...new Set([
        ...(previous?.lomloe.basicKnowledge ?? []),
        ...(Array.isArray(ai.basicKnowledge) ? ai.basicKnowledge : []).map((k) => matchKnowledgeLabel(k, ctx.knowledgeLabels)).filter(Boolean),
    ])];

    const keyIdeas = previous?.keyIdeas ?? (Array.isArray(ai.keyIdeas) ? ai.keyIdeas.filter(isText).map(clean).slice(0, 4) : []);

    return {
        id: setId,
        cursoId: curso.id,
        asignaturaId: asignatura.id,
        temaId: tema.id,
        temaNombre: tema.nombre,
        title: previous?.title ?? (isText(ai.title) ? clean(ai.title) : tema.nombre),
        summary: previous?.summary ?? (isText(ai.summary) ? clean(ai.summary) : ''),
        keyIdeas,
        lomloe: { area: ctx.area, cycle: ctx.cycle, competencies, criteria, descriptors, basicKnowledge },
        activities: [...(previous?.activities ?? []), ...activities],
        meta: {
            generator: GENERATOR,
            model,
            generatedAt: new Date().toISOString(),
            reviewed: false,
        },
    };
}

// -----------------------------------------------------------------------------
// VERIFICACIÓN A CIEGAS
// -----------------------------------------------------------------------------

const shuffled = (items) => [...items].sort(() => Math.random() - 0.5);

// Prepara cada actividad sin su solución y guarda lo que se espera como respuesta
function blindActivity(a) {
    const base = { id: a.id, type: a.type, prompt: a.prompt };
    switch (a.type) {
        case 'choice':
            return { task: { ...base, options: a.options }, expected: a.answer };
        case 'fill-blank':
            return { task: { ...base, sentence: a.sentence, options: a.options }, expected: a.answer };
        case 'true-false':
            return { task: base, expected: a.answer };
        case 'reading':
            return { task: { ...base, text: a.text, questions: a.questions.map((q) => ({ prompt: q.prompt, options: q.options })) }, expected: a.questions.map((q) => q.answer) };
        case 'order':
            return { task: { ...base, items: shuffled(a.items) }, expected: a.items };
        case 'classify':
            return { task: { ...base, categories: a.categories, items: a.items.map((i) => i.text) }, expected: a.items.map((i) => i.category) };
        case 'match':
            return { task: { ...base, left: a.pairs.map((p) => p.left), right: shuffled(a.pairs.map((p) => p.right)) }, expected: a.pairs.map((p) => p.right) };
    }
}

const sameAnswer = (got, expected) => JSON.stringify(got) === JSON.stringify(expected);

function createVerifier(generate, curso) {
    return async function verify(activities) {
        const blind = activities.map(blindActivity);
        const prompt = `Eres un maestro/a de ${curso.nombre} revisando actividades antes de dárselas a niños. Resuelve cada actividad TÚ MISMO, con cuidado y paso a paso, sin suponer que están bien planteadas.

Formato de "answer" según el tipo:
- choice / fill-blank: índice (empezando en 0) de la opción correcta.
- true-false: true o false.
- reading: array con el índice correcto de cada pregunta.
- order: array con los textos de "items" en el orden correcto.
- classify: array con el índice de categoría de cada elemento de "items", en el mismo orden.
- match: array con el texto de "right" que corresponde a cada elemento de "left", en el mismo orden.

Si una actividad tiene más de una respuesta válida, ninguna, un dato erróneo o un enunciado confuso para un niño, pon "problem" con una frase explicándolo.

ACTIVIDADES:
${JSON.stringify(blind.map((b) => b.task), null, 2)}

Devuelve ÚNICAMENTE JSON: {"results":[{"id":"...","answer":...,"problem":null}]}`;

        const { data } = await generate(prompt, { temperature: 0 });
        const results = new Map((Array.isArray(data?.results) ? data.results : []).map((r) => [r.id, r]));
        const kept = activities.filter((a, i) => {
            const r = results.get(a.id);
            const ok = r && !r.problem && sameAnswer(r.answer, blind[i].expected);
            if (!ok) {
                const why = !r ? 'sin respuesta del verificador' : r.problem ? r.problem : `el verificador responde ${JSON.stringify(r.answer)}`;
                console.log(`\x1b[33m  [Descartada en verificación] ${a.type}: "${a.prompt.slice(0, 70)}" → ${why}\x1b[0m`);
            }
            return ok;
        });
        console.log(`  [Verificación] ${kept.length}/${activities.length} actividades confirmadas`);
        return kept;
    };
}

// -----------------------------------------------------------------------------
// GEMINI
// -----------------------------------------------------------------------------

function buildApiUrl({ useAiStudio, projectId, location, model }) {
    if (useAiStudio) return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const host = location === 'global' ? 'aiplatform.googleapis.com' : `${location}-aiplatform.googleapis.com`;
    if (!projectId) return `https://${host}/v1/publishers/google/models/${model}:generateContent`;
    return `https://${host}/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`;
}

function createGeminiClient({ apiKey, model, useAiStudio, projectId, location }) {
    // Cadena de reserva ante cuota agotada (429), igual que eduaroo_enrich.php
    const models = [...new Set([model, 'gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash'])];
    let preferred = 0;

    return async function generate(prompt, { temperature = 0.7 } = {}) {
        for (let step = 0; step < models.length; step++) {
            const idx = (preferred + step) % models.length;
            const candidate = models[idx];
            const res = await fetch(buildApiUrl({ useAiStudio, projectId, location, model: candidate }), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: 'application/json', temperature },
                }),
            });

            if (res.status === 429) {
                const wait = step + 1 < models.length ? 10 : 60;
                console.log(`\x1b[33m[Cuota 429 en ${candidate}]: probando otro modelo en ${wait}s...\x1b[0m`);
                await sleep(wait * 1000);
                continue;
            }
            const body = await res.text();
            if (!res.ok) throw new Error(`API ${res.status}: ${body.slice(0, 300)}`);

            preferred = idx;
            const text = JSON.parse(body)?.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
            const json = text.trim().replace(/^```(?:json)?\s*|\s*```$/gi, '');
            return { data: JSON.parse(json), model: candidate };
        }
        throw new Error('Cuota agotada en todos los modelos');
    };
}

// -----------------------------------------------------------------------------
// ARCHIVOS DE SALIDA
// -----------------------------------------------------------------------------

const setPath = (cursoId, asignaturaId, temaId) => path.join(CONTENT_DIR, cursoId, asignaturaId, `${temaId}.json`);

function estimateMinutes(set) {
    const units = set.activities.reduce((sum, a) => sum + (a.type === 'reading' ? 3 : 1), 0);
    return Math.max(5, Math.round(units * 0.75));
}

function writeRegistry() {
    const sets = [];
    if (fs.existsSync(CONTENT_DIR)) {
        for (const cursoId of fs.readdirSync(CONTENT_DIR).sort()) {
            const cursoDir = path.join(CONTENT_DIR, cursoId);
            if (!fs.statSync(cursoDir).isDirectory()) continue;
            for (const asignaturaId of fs.readdirSync(cursoDir).sort()) {
                const asigDir = path.join(cursoDir, asignaturaId);
                if (!fs.statSync(asigDir).isDirectory()) continue;
                for (const file of fs.readdirSync(asigDir).filter((f) => f.endsWith('.json')).sort()) {
                    const set = readJson(path.join(asigDir, file));
                    sets.push({ set, rel: `./${cursoId}/${asignaturaId}/${file}` });
                }
            }
        }
    }

    const summaries = sets.map(({ set }) => ({
        key: `${set.cursoId}/${set.asignaturaId}/${set.temaId}`,
        cursoId: set.cursoId,
        asignaturaId: set.asignaturaId,
        temaId: set.temaId,
        title: set.title,
        summary: set.summary,
        activityCount: set.activities.length,
        estimatedMinutes: estimateMinutes(set),
    }));
    const loaders = sets
        .map(({ set, rel }) => `    '${set.cursoId}/${set.asignaturaId}/${set.temaId}': () =>\n        import('${rel}').then((m) => m.default as unknown as ActivitySet),`)
        .join('\n');

    const source = `// Archivo generado por scripts/generate-activities.mjs. No editar a mano.
// Regenerar con: node scripts/generate-activities.mjs --registry

import type { ActivitySet, ActivitySetSummary } from '@/lib/curriculum/types';

export const ACTIVITY_SETS: ActivitySetSummary[] = ${JSON.stringify(summaries, null, 4)};

export const ACTIVITY_LOADERS: Record<string, () => Promise<ActivitySet>> = {
${loaders}
};
`;
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
    fs.writeFileSync(path.join(CONTENT_DIR, 'registry.ts'), source);
    return summaries.length;
}

// -----------------------------------------------------------------------------
// LISTADO DE COBERTURA
// -----------------------------------------------------------------------------

function printCoverage(curriculum, args) {
    console.log('\nCobertura de temas  (✅ generado · 🛠  recursos hechos a mano · ⬜ pendiente)\n');
    for (const curso of curriculum) {
        if (args.curso && curso.id !== args.curso) continue;
        console.log(`\x1b[1m${curso.nombre}\x1b[0m`);
        for (const asignatura of curso.asignaturas) {
            if (args.asignatura && asignatura.id !== args.asignatura) continue;
            const rows = asignatura.temas.map((tema) => {
                const file = setPath(curso.id, asignatura.id, tema.id);
                if (fs.existsSync(file)) return `✅ ${tema.id} (${readJson(file).activities.length})`;
                return `${tema.recursos.length ? '🛠 ' : '⬜'} ${tema.id}`;
            });
            console.log(`  ${asignatura.id.padEnd(10)} ${rows.join('  ')}`);
        }
        console.log('');
    }
}

// -----------------------------------------------------------------------------
// MAIN
// -----------------------------------------------------------------------------

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
        const header = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0];
        console.log(header.replace(/^#!.*\n\/\*\*\n?/, '').replace(/^ \* ?/gm, ''));
        return;
    }
    loadEnv();

    if (args.registry) {
        console.log(`Índice regenerado: ${writeRegistry()} bloques.`);
        return;
    }

    const curriculum = await loadCurriculum();
    if (args.list) {
        printCoverage(curriculum, args);
        return;
    }

    if (args.asignatura && !ASIGNATURA_LOMLOE[args.asignatura]) {
        throw new Error(`Asignatura desconocida "${args.asignatura}". Usa: ${Object.keys(ASIGNATURA_LOMLOE).join(', ')}`);
    }
    if (args.force && args.append) throw new Error('Usa --force o --append, no ambos.');

    const count = Number(args.count ?? 10);
    const limit = Number(args.limit ?? Infinity);
    const delay = Number(args.delay ?? 10);

    // Selección de temas
    const targets = [];
    for (const curso of curriculum) {
        if (args.curso && curso.id !== args.curso) continue;
        for (const asignatura of curso.asignaturas) {
            if (args.asignatura && asignatura.id !== args.asignatura) continue;
            for (const tema of asignatura.temas) {
                if (args.tema && tema.id !== args.tema) continue;
                const exists = fs.existsSync(setPath(curso.id, asignatura.id, tema.id));
                if (exists && !args.force && !args.append) continue;
                if (!exists && args.append) continue;
                if (!args.tema && !args['include-covered'] && tema.recursos.length > 0) continue;
                targets.push({ curso, asignatura, tema });
            }
        }
    }
    if (targets.length === 0) {
        console.log('No hay temas pendientes con esos filtros. Prueba --list, --append, --force o --include-covered.');
        return;
    }
    const batch = targets.slice(0, limit);

    const apiKey = args['api-key'] ?? process.env.GEMINI_API_KEY;
    const model = args.model ?? process.env.GEMINI_MODEL ?? 'gemini-3.8-flash';
    if (!apiKey && !args['dry-run']) throw new Error('Falta GEMINI_API_KEY (en el entorno o en .env.local).');

    console.log('\n==============================================================================');
    console.log('  GENERADOR DE ACTIVIDADES LOMLOE - EDUAROO');
    console.log('==============================================================================');
    console.log(`- Temas en esta tanda:  ${batch.length} (de ${targets.length} candidatos)`);
    console.log(`- Actividades por tema: ${count}${args.append ? ' (modo añadir)' : ''}`);
    console.log(`- Modelo IA:            ${model}`);
    console.log('==============================================================================\n');

    const generate = createGeminiClient({
        apiKey,
        model,
        useAiStudio: Boolean(args.aistudio),
        projectId: process.env.GCP_PROJECT_ID,
        location: process.env.GCP_LOCATION || 'global',
    });

    let ok = 0;
    let errors = 0;
    for (const [i, { curso, asignatura, tema }] of batch.entries()) {
        const file = setPath(curso.id, asignatura.id, tema.id);
        const previous = args.append ? readJson(file) : null;
        const ctx = lomloeContext(asignatura.id, Number(curso.id));
        const prompt = buildPrompt({ curso, asignatura, tema, ctx, count, existing: previous?.activities });
        const useVerify = args['no-verify'] ? false : args.verify || asignatura.id === 'mates';
        const verify = createVerifier(generate, curso);

        if (args['dry-run']) {
            console.log(`\x1b[36m--- [DRY-RUN] ${curso.id}/${asignatura.id}/${tema.id} ---\x1b[0m\n${prompt}\n\x1b[36m--- [FIN DRY-RUN] ---\x1b[0m`);
            return;
        }

        console.log(`[${i + 1}/${batch.length}] ${curso.nombre} · ${asignatura.nombre} · ${tema.nombre}`);
        let set = null;
        for (let attempt = 1; attempt <= 2 && !set; attempt++) {
            try {
                const { data, model: usedModel } = await generate(prompt);
                set = await buildSet({ ai: data, curso, asignatura, tema, ctx, model: usedModel, previous, count, verify: useVerify ? verify : null });
            } catch (err) {
                console.log(`\x1b[31m  [Intento ${attempt} fallido]: ${err.message}\x1b[0m`);
            }
        }

        if (!set) {
            errors++;
        } else {
            fs.mkdirSync(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, `${JSON.stringify(set, null, 2)}\n`);
            writeRegistry();
            ok++;
            const types = [...new Set(set.activities.map((a) => a.type))].join(', ');
            console.log(`\x1b[32m  [✓] ${set.activities.length} actividades (${types}) · criterios ${set.lomloe.criteria.join(', ')} · ${path.relative(ROOT, file)}\x1b[0m`);
        }

        if (delay > 0 && i < batch.length - 1) await sleep(delay * 1000);
    }

    console.log('\n==============================================================================');
    console.log(`PROCESO FINALIZADO · generados: ${ok} · errores: ${errors}`);
    console.log('Recuerda revisar el contenido y marcar "meta.reviewed": true cuando esté validado.');
    console.log('==============================================================================\n');
}

main().catch((err) => {
    console.error(`\n\x1b[31m[Error fatal]: ${err.message}\x1b[0m\n`);
    process.exit(1);
});
