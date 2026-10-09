// Catálogo de juegos publicados (slug de la ruta) con la fecha real de su último cambio.
export const games = [
    'astro-type',
    'bitblox',
    'calculate-target',
    'cyber-segments',
    'galaxy-math-fuel',
    'geominds',
    'syllable-quest',
    'tictac',
    'wordsearch',
] as const;

export type GameSlug = (typeof games)[number];

export const GAMES_LAST_MODIFIED = new Date('2026-02-18T13:27:42+01:00');
