// Catálogo de juegos publicados: slug de la ruta, textos SEO y fecha real de último cambio.
import type { SiteLocale } from './site';

export const GAMES_LAST_MODIFIED = new Date('2026-02-18T13:27:42+01:00');

// Fecha de redacción de las páginas Sobre Eduaroo y Contacto. Actualizar al editarlas.
export const INFO_PAGES_LAST_MODIFIED = new Date('2026-10-09T12:00:00+02:00');

interface GameSeo {
    slug: string;
    es: { title: string; description: string };
    en: { title: string; description: string };
}

export const gameCatalog: GameSeo[] = [
    {
        slug: 'astro-type',
        es: {
            title: 'Astro Type: juego de mecanografía para niños',
            description:
                'Destruye asteroides con tu teclado y aprende mecanografía en una aventura espacial. Juego educativo gratis para practicar las letras en Primaria.',
        },
        en: {
            title: 'Astro Type: a typing game for kids',
            description:
                'Destroy asteroids with your keyboard and learn to type in a space adventure. A free educational game to practise letters in primary school.',
        },
    },
    {
        slug: 'bitblox',
        es: {
            title: 'BitBlox: pixel art con código binario',
            description:
                'Pinta dibujos de pixel art convirtiendo ceros y unos en colores. Un juego educativo gratis para descubrir cómo representa un ordenador las imágenes.',
        },
        en: {
            title: 'BitBlox: pixel art with binary code',
            description:
                'Paint pixel art by turning zeros and ones into colours. A free educational game to discover how a computer represents images.',
        },
    },
    {
        slug: 'calculate-target',
        es: {
            title: 'Calcula el Objetivo: puzle de cálculo mental',
            description:
                'Combina números y operaciones para alcanzar el valor objetivo. Un puzle matemático gratis para practicar el cálculo mental en Primaria.',
        },
        en: {
            title: 'Calculate Target: a mental maths puzzle',
            description:
                'Combine numbers and operations to reach the target value. A free maths puzzle to practise mental calculation in primary school.',
        },
    },
    {
        slug: 'cyber-segments',
        es: {
            title: 'Cyber Segments: reconoce números de 7 segmentos',
            description:
                'Descifra el código digital: reconoce y forma números con siete segmentos, como en un reloj digital. Juego de patrones gratis para niños de Primaria.',
        },
        en: {
            title: 'Cyber Segments: spot 7-segment numbers',
            description:
                'Crack the digital code: recognise and build numbers from seven segments, like on a digital clock. A free pattern game for primary school children.',
        },
    },
    {
        slug: 'galaxy-math-fuel',
        es: {
            title: 'Combustible Galáctico: juego de operaciones',
            description:
                'Ayuda a la nave a conseguir combustible resolviendo operaciones matemáticas antes de que se agote el tiempo. Juego de cálculo gratis para Primaria.',
        },
        en: {
            title: 'Galaxy Math Fuel: an operations game',
            description:
                'Help the spaceship get fuel by solving maths operations before time runs out. A free calculation game for primary school.',
        },
    },
    {
        slug: 'geominds',
        es: {
            title: 'GeoMinds: puzle de formas geométricas',
            description:
                'Resuelve tangrams: encaja las formas geométricas en el área objetivo en este juego de razonamiento espacial. Gratis y pensado para niños de Primaria.',
        },
        en: {
            title: 'GeoMinds: a geometric shapes puzzle',
            description: 'Solve tangrams: fit the geometric shapes into the target area in this spatial reasoning game. Free and designed for primary school children.',
        },
    },
    {
        slug: 'syllable-quest',
        es: {
            title: 'Syllable Quest: aprende a leer con sílabas',
            description:
                'Separa palabras en sílabas y derrota monstruos en este juego de lectoescritura. Practica la lectura en Primaria, gratis y sin registro.',
        },
        en: {
            title: 'Syllable Quest: learn to read with syllables',
            description:
                'Split words into syllables and defeat monsters in this reading and writing game. Practise reading in primary school, free and with no sign-up.',
        },
    },
    {
        slug: 'tictac',
        es: {
            title: 'TicTac Maestro: aprende la hora en el reloj',
            description:
                'Practica poniendo la hora en un reloj analógico a partir de la hora digital. Un juego gratis para aprender a leer el reloj en Primaria.',
        },
        en: {
            title: 'TicTac Maestro: learn to tell the time',
            description:
                'Practise setting an analogue clock from the digital time. A free game to learn how to read the clock in primary school.',
        },
    },
    {
        slug: 'wordsearch',
        es: {
            title: 'Sopa de letras educativa: vocabulario de Primaria',
            description:
                'Elige un tema (animales, comida, escuela, tecnología, colores o deportes) y encuentra las palabras ocultas. Sopa de letras gratis para ampliar vocabulario.',
        },
        en: {
            title: 'Educational word search: primary vocabulary',
            description:
                'Pick a topic (animals, food, school, technology, colours or sports) and find the hidden words. A free word search to build vocabulary in primary school.',
        },
    },
];

export const games = gameCatalog.map((g) => g.slug);

export const getGameSeo = (slug: string, locale: SiteLocale) => gameCatalog.find((g) => g.slug === slug)?.[locale];
