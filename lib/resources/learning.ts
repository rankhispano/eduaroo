export type Operation = 'sum' | 'subtract' | 'multiply' | 'divide';
export interface ArithmeticQuestion {
    a: number;
    b: number;
    operation: Operation;
    answer: number;
    remainder: number;
    explanation: string;
}
export function makeArithmetic(
    operation: Operation,
    level: number,
    table: number,
    random = Math.random,
): ArithmeticQuestion {
    const integer = (max: number) =>
        Math.min(max - 1, Math.floor(random() * max));
    let a = integer(level === 1 ? 10 : level === 2 ? 20 : 90) + 1;
    let b = integer(level === 1 ? 10 : level === 2 ? 20 : 90) + 1;
    let answer = 0;
    let remainder = 0;
    let explanation = '';
    if (operation === 'sum') {
        answer = a + b;
        explanation = `${a} + ${b} = ${answer}. Separa ${b} en ${Math.floor(b / 10) * 10} y ${b % 10}: suma las decenas y después las unidades.`;
    } else if (operation === 'subtract') {
        if (b > a) [a, b] = [b, a];
        answer = a - b;
        explanation = `${a} − ${b} = ${answer}. Comprueba sumando: ${b} + ${answer} = ${a}.`;
    } else if (operation === 'multiply') {
        const factors = table ? 12 : [5, 10, 12][level - 1];
        a = table || integer(factors) + 1;
        b = integer(factors) + 1;
        answer = a * b;
        explanation = `${a} × ${b} = ${answer}: ${a} grupos de ${b}. También puedes calcular ${b} × ${a}.`;
    } else {
        b = integer(level === 1 ? 4 : 9) + 2;
        answer = integer(level === 3 ? 20 : 10) + 1;
        remainder = level === 1 ? 0 : integer(b);
        a = b * answer + remainder;
        explanation = `${a} ÷ ${b}: cociente ${answer}, resto ${remainder}. Comprobación: ${b} × ${answer} + ${remainder} = ${a}.`;
    }
    return { a, b, operation, answer, remainder, explanation };
}

const romanPairs = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
] as const;
export function toRoman(n: number): string | undefined {
    if (!Number.isInteger(n) || n < 1 || n > 3999) return;
    let output = '';
    for (const [value, symbol] of romanPairs)
        while (n >= value) {
            output += symbol;
            n -= value;
        }
    return output;
}
export function fromRoman(input: string): number | undefined {
    const normalized = input.trim().toUpperCase();
    if (!normalized || !/^[IVXLCDM]+$/.test(normalized)) return;
    const values: Record<string, number> = {
        I: 1,
        V: 5,
        X: 10,
        L: 50,
        C: 100,
        D: 500,
        M: 1000,
    };
    const total = [...normalized].reduce(
        (sum, char, index) =>
            sum +
            (values[char] < (values[normalized[index + 1]] ?? 0)
                ? -values[char]
                : values[char]),
        0,
    );
    return toRoman(total) === normalized ? total : undefined;
}
export function angleName(degrees: number): string {
    if (degrees === 0) return 'Nulo';
    if (degrees < 90) return 'Agudo';
    if (degrees === 90) return 'Recto';
    if (degrees < 180) return 'Obtuso';
    if (degrees === 180) return 'Llano';
    if (degrees < 360) return 'Cóncavo';
    return 'Completo';
}
export const syllableBank: Record<string, string[]> = {
    casa: ['ca', 'sa'],
    luna: ['lu', 'na'],
    sol: ['sol'],
    mariposa: ['ma', 'ri', 'po', 'sa'],
    elefante: ['e', 'le', 'fan', 'te'],
    chocolate: ['cho', 'co', 'la', 'te'],
    perro: ['pe', 'rro'],
    lluvia: ['llu', 'via'],
    libro: ['li', 'bro'],
    carta: ['car', 'ta'],
    aire: ['ai', 're'],
    país: ['pa', 'ís'],
    río: ['rí', 'o'],
    león: ['le', 'ón'],
    familia: ['fa', 'mi', 'lia'],
    siempre: ['siem', 'pre'],
    escuela: ['es', 'cue', 'la'],
    también: ['tam', 'bién'],
    cuando: ['cuan', 'do'],
    una: ['u', 'na'],
    bueno: ['bue', 'no'],
    huevo: ['hue', 'vo'],
    árbol: ['ár', 'bol'],
    música: ['mú', 'si', 'ca'],
    océano: ['o', 'cé', 'a', 'no'],
    maíz: ['ma', 'íz'],
    ciudad: ['ciu', 'dad'],
    cielo: ['cie', 'lo'],
    montaña: ['mon', 'ta', 'ña'],
    juguete: ['ju', 'gue', 'te'],
    pingüino: ['pin', 'güi', 'no'],
};
export const pronouns = [
    'yo',
    'tú',
    'él / ella',
    'nosotros / nosotras',
    'vosotros / vosotras',
    'ellos / ellas',
];
export const verbModels: Record<string, Record<string, string[]>> = {
    hablar: {
        presente: ['hablo', 'hablas', 'habla', 'hablamos', 'habláis', 'hablan'],
        preterito: [
            'hablé',
            'hablaste',
            'habló',
            'hablamos',
            'hablasteis',
            'hablaron',
        ],
        futuro: [
            'hablaré',
            'hablarás',
            'hablará',
            'hablaremos',
            'hablaréis',
            'hablarán',
        ],
    },
    comer: {
        presente: ['como', 'comes', 'come', 'comemos', 'coméis', 'comen'],
        preterito: [
            'comí',
            'comiste',
            'comió',
            'comimos',
            'comisteis',
            'comieron',
        ],
        futuro: [
            'comeré',
            'comerás',
            'comerá',
            'comeremos',
            'comeréis',
            'comerán',
        ],
    },
    vivir: {
        presente: ['vivo', 'vives', 'vive', 'vivimos', 'vivís', 'viven'],
        preterito: [
            'viví',
            'viviste',
            'vivió',
            'vivimos',
            'vivisteis',
            'vivieron',
        ],
        futuro: [
            'viviré',
            'vivirás',
            'vivirá',
            'viviremos',
            'viviréis',
            'vivirán',
        ],
    },
    ser: {
        presente: ['soy', 'eres', 'es', 'somos', 'sois', 'son'],
        preterito: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
        futuro: ['seré', 'serás', 'será', 'seremos', 'seréis', 'serán'],
    },
    tener: {
        presente: ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen'],
        preterito: [
            'tuve',
            'tuviste',
            'tuvo',
            'tuvimos',
            'tuvisteis',
            'tuvieron',
        ],
        futuro: [
            'tendré',
            'tendrás',
            'tendrá',
            'tendremos',
            'tendréis',
            'tendrán',
        ],
    },
    ir: {
        presente: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'],
        preterito: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
        futuro: ['iré', 'irás', 'irá', 'iremos', 'iréis', 'irán'],
    },
};
export const dictationTexts: Record<string, string[]> = {
    '1': [
        'La luna sale de noche.',
        'Mi gato mira la pelota.',
        'En la mesa hay un libro.',
    ],
    '2': [
        'El perro juega debajo del árbol.',
        'Hoy hemos visto una mariposa azul.',
        'Mi amiga lleva un lápiz en la mochila.',
    ],
    '3': [
        'La biblioteca abre por la mañana y cierra por la tarde.',
        'Bruno encontró una llave junto al banco del parque.',
        'Ayer recogimos hojas secas y dibujamos sus formas.',
    ],
    '4': [
        'Había una jirafa junto al árbol, pero nadie sabía de dónde venía.',
        'El sábado visitamos un pueblo pequeño y compramos verduras.',
        'Cuando terminó la lluvia, las nubes dejaron ver el arcoíris.',
    ],
    '5': [
        'Aunque el camino parecía difícil, Inés continuó hasta llegar al refugio.',
        'El bibliotecario nos recomendó una historia sobre un viaje extraordinario.',
        '¿Por qué cambian las sombras cuando el Sol se mueve por el cielo?',
    ],
    '6': [
        'La científica explicó que una hipótesis debe contrastarse con observaciones.',
        'Si hubiéramos salido antes, habríamos llegado a tiempo a la representación.',
        'Después de revisar sus argumentos, el equipo escribió una conclusión breve y precisa.',
    ],
};
export function compareDictation(expected: string, written: string) {
    const tokens = (value: string) =>
        value.trim().normalize('NFC').split(/\s+/).filter(Boolean);
    const model = tokens(expected);
    const answer = tokens(written);
    return {
        model,
        answer,
        exact:
            model.length === answer.length &&
            model.every((word, i) => word === answer[i]),
        matches: model.map((word, i) => word === answer[i]),
    };
}
