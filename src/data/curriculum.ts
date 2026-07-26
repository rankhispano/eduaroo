import type { Asignatura, Curso, Recurso, Tema } from '@/src/types';

const recursosVacios = (): [] => []; // TODO: añadir recursos

const recurso = (
  id: string,
  titulo: string,
  tipo: Recurso['tipo'],
  url: string,
  descripcion?: string,
  duracion?: string,
): Recurso => ({ id, titulo, tipo, url, descripcion, duracion });

const crearTemas = (
  nombres: string[],
  recursosPorTema: Record<string, Recurso[]> = {},
): Tema[] =>
  nombres.map((nombre) => ({
    id: nombre
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
    nombre,
    recursos: recursosPorTema[nombre] ?? recursosVacios(), // TODO: añadir recursos
  }));

const asignaturasBase = {
  lengua: {
    id: 'lengua',
    nombre: 'Lengua Castellana',
    color: '#3B82F6',
    icono: 'BookOpen',
  },
  mates: {
    id: 'mates',
    nombre: 'Matemáticas',
    color: '#8B5CF6',
    icono: 'Calculator',
  },
  naturales: {
    id: 'naturales',
    nombre: 'Ciencias Naturales',
    color: '#22C55E',
    icono: 'Leaf',
  },
  sociales: {
    id: 'sociales',
    nombre: 'Ciencias Sociales',
    color: '#F59E0B',
    icono: 'Globe',
  },
  ingles: {
    id: 'ingles',
    nombre: 'Inglés',
    color: '#EF4444',
    icono: 'Languages',
  },
} satisfies Record<string, Omit<Asignatura, 'temas'>>;

const asignatura = (
  id: keyof typeof asignaturasBase,
  temas: string[],
  recursosPorTema?: Record<string, Recurso[]>,
): Asignatura => ({
  ...asignaturasBase[id],
  temas: crearTemas(temas, recursosPorTema),
});

const mathResources = {
  grade1: {
    'Números del 0 al 99': [
      recurso('g1-numeracion', 'Practicar numeración 0-99', 'ejercicio', '/es/learning/math/grade1/numeration', 'Conteo, orden y valor de los números.', '10 min'),
    ],
    'Suma sin llevadas': [
      recurso('g1-operaciones-suma', 'Sumas y restas básicas', 'ejercicio', '/es/learning/math/grade1/operations', 'Operaciones sencillas con apoyo visual.', '10 min'),
      recurso('g1-galaxy', 'Galaxy Math Fuel', 'juego', '/es/games/galaxy-math-fuel', 'Juego para practicar cálculo mental.', '8 min'),
    ],
    'Resta sin llevadas': [
      recurso('g1-operaciones-resta', 'Sumas y restas básicas', 'ejercicio', '/es/learning/math/grade1/operations', 'Operaciones sencillas con apoyo visual.', '10 min'),
    ],
    'Figuras geométricas básicas': [
      recurso('g1-geometria', 'Formas y líneas', 'ejercicio', '/es/learning/math/grade1/geometry', 'Reconocer figuras planas y líneas.', '10 min'),
      recurso('g1-geominds', 'GeoMinds', 'juego', '/es/games/geominds', 'Juego visual de formas geométricas.', '8 min'),
    ],
    'Medidas: grande/pequeño': [
      recurso('g1-medicion', 'Medición, reloj y monedas', 'ejercicio', '/es/learning/math/grade1/measurement', 'Comparar tamaños, tiempo y dinero.', '10 min'),
    ],
    'Días y meses': [
      recurso('g1-medicion-tiempo', 'Medición, reloj y calendario', 'ejercicio', '/es/learning/math/grade1/measurement', 'Repaso de tiempo y calendario.', '10 min'),
    ],
    'Monedas y billetes': [
      recurso('g1-medicion-dinero', 'Monedas y cantidades', 'ejercicio', '/es/learning/math/grade1/measurement', 'Repaso de dinero con ejemplos visuales.', '10 min'),
    ],
  },
  grade2: {
    'Números hasta 999': [
      recurso('g2-numeracion', 'Centenas, decenas y unidades', 'ejercicio', '/es/learning/math/grade2/numeration', 'Representar números hasta 999.', '10 min'),
    ],
    'Suma con llevadas': [
      recurso('g2-operaciones-suma', 'Operaciones con llevadas', 'ejercicio', '/es/learning/math/grade2/operations', 'Suma, resta e inicio de multiplicación.', '10 min'),
    ],
    'Resta con llevadas': [
      recurso('g2-operaciones-resta', 'Operaciones con llevadas', 'ejercicio', '/es/learning/math/grade2/operations', 'Suma, resta e inicio de multiplicación.', '10 min'),
    ],
    'Tablas del 2, 5 y 10': [
      recurso('g2-operaciones-tablas', 'Primeras multiplicaciones', 'ejercicio', '/es/learning/math/grade2/operations', 'Grupos iguales y tablas sencillas.', '10 min'),
      recurso('g2-galaxy', 'Galaxy Math Fuel', 'juego', '/es/games/galaxy-math-fuel', 'Cálculo mental en formato juego.', '8 min'),
    ],
    'Longitud: cm y m': [
      recurso('g2-medicion', 'Medidas y calendario', 'ejercicio', '/es/learning/math/grade2/measurement', 'Longitud, capacidad y tiempo.', '10 min'),
    ],
    'El euro': [
      recurso('g2-medicion-dinero', 'Problemas con medidas', 'ejercicio', '/es/learning/math/grade2/measurement', 'Situaciones con unidades cotidianas.', '10 min'),
    ],
    'Figuras: lados y vértices': [
      recurso('g2-geometria', 'Geometría y simetría', 'ejercicio', '/es/learning/math/grade2/geometry', 'Cuerpos, figuras y simetría.', '10 min'),
      recurso('g2-geominds', 'GeoMinds', 'juego', '/es/games/geominds', 'Juego de pensamiento geométrico.', '8 min'),
    ],
    'Fracciones: mitad y cuarta parte': [
      recurso('g2-fracciones', 'Mitades y cuartos', 'ejercicio', '/es/learning/math/grade2/fractions', 'Introducción visual a fracciones.', '10 min'),
    ],
  },
  grade3: {
    'Números hasta 9.999': [
      recurso('g3-numeracion', 'Números grandes', 'ejercicio', '/es/learning/math/grade3/numeration', 'Lectura y comparación de números.', '10 min'),
    ],
    'Multiplicación con llevadas': [
      recurso('g3-operaciones-mult', 'Multiplicación y división', 'ejercicio', '/es/learning/math/grade3/operations', 'Tablas, multiplicaciones y repartos.', '12 min'),
    ],
    'División exacta e inexacta': [
      recurso('g3-operaciones-div', 'División en problemas', 'ejercicio', '/es/learning/math/grade3/operations', 'Repartos exactos e inexactos.', '12 min'),
    ],
    'Tablas completas': [
      recurso('g3-galaxy', 'Galaxy Math Fuel', 'juego', '/es/games/galaxy-math-fuel', 'Práctica de cálculo mental.', '8 min'),
    ],
    'Fracciones': [
      recurso('g3-fracciones', 'Fracciones y decimales', 'ejercicio', '/es/learning/math/grade3/fractions', 'Partes de la unidad y primeras equivalencias.', '12 min'),
    ],
    'Decimales: décimas': [
      recurso('g3-decimales', 'Fracciones y decimales', 'ejercicio', '/es/learning/math/grade3/fractions', 'Relacionar fracciones y decimales iniciales.', '12 min'),
    ],
    'Masa: kg y g': [
      recurso('g3-medicion', 'Problemas reales', 'ejercicio', '/es/learning/math/grade3/measurement', 'Dinero, tiempo, masa y datos.', '12 min'),
    ],
    'Perímetro': [
      recurso('g3-geometria', 'Geometría avanzada', 'ejercicio', '/es/learning/math/grade3/geometry', 'Polígonos, círculos y propiedades.', '10 min'),
      recurso('g3-geominds', 'GeoMinds', 'juego', '/es/games/geominds', 'Juego de geometría.', '8 min'),
    ],
  },
  grade4: {
    'Números hasta 999.999': [
      recurso('g4-calculate', 'Calculate Target', 'juego', '/es/games/calculate-target', 'Juego de cálculo y estrategia con números.', '8 min'),
    ],
    'Multiplicación por dos cifras': [
      recurso('g4-multiplication', 'Multiplicación de varios dígitos', 'ejercicio', '/es/learning/math/grade4/multiplication', 'Practica multiplicaciones paso a paso.', '12 min'),
      recurso('g4-galaxy', 'Galaxy Math Fuel', 'juego', '/es/games/galaxy-math-fuel', 'Cálculo mental con operaciones.', '8 min'),
    ],
    'División por dos cifras': [
      recurso('g4-division', 'División con y sin resto', 'ejercicio', '/es/learning/math/grade4/division', 'Resuelve divisiones e interpreta el resto.', '12 min'),
    ],
    'Decimales: décimas y centésimas': [
      recurso('g4-decimals', 'Decimales', 'ejercicio', '/es/learning/math/grade4/decimals', 'Lectura, comparación y conversión de decimales.', '12 min'),
    ],
    'Fracciones equivalentes': [
      recurso('g4-fractions', 'Fracciones visuales', 'ejercicio', '/es/learning/math/grade4/fractions', 'Representar, nombrar y operar con fracciones.', '12 min'),
      recurso('g4-fraction-problems', 'Problemas con fracciones', 'ejercicio', '/es/learning/math/grade4/fractions/problems', 'Problemas de la vida real con fracciones.', '15 min'),
    ],
    'Área de figuras': [
      recurso('g4-geometry', 'Líneas, ángulos y figuras', 'ejercicio', '/es/learning/math/grade4/geometry', 'Geometría de 4º con actividades visuales.', '12 min'),
      recurso('g4-geominds', 'GeoMinds', 'juego', '/es/games/geominds', 'Juego de geometría y razonamiento espacial.', '8 min'),
    ],
    'Medidas de tiempo': [
      recurso('g4-measurement', 'Unidades y conversiones', 'ejercicio', '/es/learning/math/grade4/measurement', 'Medidas, tiempo y conversiones.', '12 min'),
    ],
    'Estadística: tablas y gráficos': [
      recurso('g4-calculate-target', 'Calculate Target', 'juego', '/es/games/calculate-target', 'Juego para entrenar decisiones numéricas.', '8 min'),
    ],
  },
  grade5: {
    'Números enteros negativos': [
      recurso('g5-arithmetic', 'Operaciones avanzadas', 'ejercicio', '/es/learning/math/grade5/arithmetic', 'Primos, divisibilidad y cálculo.', '12 min'),
    ],
    'Operaciones con paréntesis': [
      recurso('g5-arithmetic-parentesis', 'Operaciones avanzadas', 'ejercicio', '/es/learning/math/grade5/arithmetic', 'Cálculo combinado y razonamiento.', '12 min'),
      recurso('g5-calculate', 'Calculate Target', 'juego', '/es/games/calculate-target', 'Juego de operaciones con objetivo.', '8 min'),
    ],
    'Suma y resta de fracciones': [
      recurso('g5-fractions', 'Fracciones', 'ejercicio', '/es/learning/math/grade5/fractions', 'Equivalencias, comparación y operaciones.', '12 min'),
    ],
    'Ángulos y tipos': [
      recurso('g5-sexagesimal', 'Sistema sexagesimal', 'ejercicio', '/es/learning/math/grade5/sexagesimal', 'Tiempo, ángulos y conversiones.', '12 min'),
    ],
    'Perímetro y área de figuras compuestas': [
      recurso('g5-geometry', 'Áreas y poliedros', 'ejercicio', '/es/learning/math/grade5/geometry', 'Cálculo de áreas y figuras.', '12 min'),
      recurso('g5-geominds', 'GeoMinds', 'juego', '/es/games/geominds', 'Juego de geometría.', '8 min'),
    ],
    'Estadística: media y moda': [
      recurso('g5-calculate-stats', 'Calculate Target', 'juego', '/es/games/calculate-target', 'Entrena cálculo numérico.', '8 min'),
    ],
  },
  grade6: {
    'Números racionales': [
      recurso('g6-integers', 'Números enteros y potencias', 'ejercicio', '/es/learning/math/grade6/integers', 'Negativos, potencias y operaciones.', '12 min'),
    ],
    'Proporcionalidad directa e inversa': [
      recurso('g6-proportionality', 'Proporcionalidad', 'ejercicio', '/es/learning/math/grade6/proportionality', 'Regla de tres y situaciones proporcionales.', '12 min'),
    ],
    'Porcentajes: cálculo y aplicaciones': [
      recurso('g6-percentages', 'Porcentajes y proporcionalidad', 'ejercicio', '/es/learning/math/grade6/proportionality', 'Aplicaciones de porcentajes.', '12 min'),
    ],
    'Cuerpos geométricos': [
      recurso('g6-volume', 'Volumen y cuerpos 3D', 'ejercicio', '/es/learning/math/grade6/volume', 'Cálculo de volumen y visualización 3D.', '12 min'),
      recurso('g6-geominds', 'GeoMinds', 'juego', '/es/games/geominds', 'Juego de geometría.', '8 min'),
    ],
    'Probabilidad': [
      recurso('g6-stats-prob', 'Estadística', 'ejercicio', '/es/learning/math/grade6/stats', 'Datos, medidas y probabilidad básica.', '12 min'),
    ],
    'Estadística: diagramas de sectores': [
      recurso('g6-stats', 'Estadística', 'ejercicio', '/es/learning/math/grade6/stats', 'Media, mediana, moda y gráficos.', '12 min'),
    ],
  },
};

const languageResources = {
  grade4: {
    'Texto instructivo y periodístico': [
      recurso('g4-language-communication', 'Comunicación y gramática', 'ejercicio', '/es/learning/language/grade4/communication-grammar', 'Clasifica textos, reconoce prefijos y analiza palabras.', '15 min'),
    ],
    'Prefijos y sufijos': [
      recurso('g4-language-prefixes', 'Prefijos y sufijos', 'ejercicio', '/es/learning/language/grade4/communication-grammar', 'Forma palabras nuevas y reconoce su significado.', '12 min'),
    ],
    'Conjugación: presente, pasado, futuro': [
      recurso('g4-language-grammar', 'Gramática de 4º', 'ejercicio', '/es/learning/language/grade4/communication-grammar', 'Repaso de pronombres, demostrativos y análisis gramatical.', '12 min'),
    ],
    'Sujeto y predicado': [
      recurso('g4-language-subject-predicate', 'Sujeto y predicado', 'ejercicio', '/es/learning/language/grade4/subject-predicate', 'Identifica sujeto, predicado y completa oraciones nuevas.', '12 min'),
    ],
    'La obra de teatro': [
      recurso('g4-language-theatre', 'Teatro: comprender y crear escenas', 'ejercicio', '/es/learning/language/grade4/theatre', 'Comprensión teatral, representación y escritura de una escena.', '15 min'),
    ],
    'Ortografía: b/v, h, g/j': [
      recurso('g4-wordsearch', 'Sopa de letras', 'juego', '/es/games/wordsearch', 'Juego de vocabulario y atención visual.', '8 min'),
    ],
  },
};

export const curriculum: Curso[] = [
  {
    id: '1',
    nombre: '1º de Primaria',
    asignaturas: [
      asignatura('lengua', [
        'Conciencia fonológica y fonema-grafema',
        'Vocales y consonantes',
        'Lectura de sílabas',
        'Escritura de palabras',
        'El nombre: género y número',
        'Mayúsculas y signos de puntuación',
        'Comprensión de textos orales',
        'Dictado',
      ]),
      asignatura('mates', [
        'Números del 0 al 99',
        'Suma sin llevadas',
        'Resta sin llevadas',
        'Figuras geométricas básicas',
        'Medidas: grande/pequeño',
        'Días y meses',
        'Monedas y billetes',
        'Series numéricas',
      ], mathResources.grade1),
      asignatura('naturales', [
        'Partes del cuerpo',
        'Los sentidos',
        'Los animales',
        'Las plantas (raíz, tallo, hoja, flor)',
        'El tiempo atmosférico',
        'Alimentación saludable',
        'Hábitos de higiene',
      ]),
      asignatura('sociales', [
        'La familia',
        'La casa',
        'El colegio',
        'El barrio y municipio',
        'Normas de convivencia',
        'Medios de transporte',
        'Oficios y profesiones',
      ]),
      asignatura('ingles', [
        'Saludos y despedidas',
        'Presentaciones',
        'Los colores',
        'Números 1-20',
        'Vocabulario del aula',
        'Partes del cuerpo',
        'Animales domésticos',
        'Órdenes sencillas',
      ]),
    ],
  },
  {
    id: '2',
    nombre: '2º de Primaria',
    asignaturas: [
      asignatura('lengua', [
        'Grupos consonánticos',
        'Lectura comprensiva de textos breves',
        'El artículo',
        'El adjetivo calificativo',
        'El verbo: acción',
        'Sílabas: diptongo',
        'Coma y punto',
        'Tipos de textos: cuento, poema, noticia',
      ]),
      asignatura('mates', [
        'Números hasta 999',
        'Suma con llevadas',
        'Resta con llevadas',
        'Tablas del 2, 5 y 10',
        'Longitud: cm y m',
        'El euro',
        'Figuras: lados y vértices',
        'Fracciones: mitad y cuarta parte',
      ], mathResources.grade2),
      asignatura('naturales', [
        'Órganos del cuerpo',
        'Ciclo de vida de animales',
        'Vertebrados e invertebrados',
        'Las plantas: reproducción',
        'Los materiales',
        'El aire y el agua',
        'Hábitos saludables',
      ]),
      asignatura('sociales', [
        'Municipio rural y urbano',
        'Planos y mapas',
        'El paisaje',
        'Las estaciones',
        'Antes y ahora',
        'Medios de comunicación',
        'Derechos de los niños',
      ]),
      asignatura('ingles', [
        'La familia',
        'Los alimentos',
        'La casa',
        'Números hasta 100',
        'Preguntas con What/Where',
        'El tiempo atmosférico',
        'Días y meses',
        'Verbo to be',
      ]),
    ],
  },
  {
    id: '3',
    nombre: '3º de Primaria',
    asignaturas: [
      asignatura('lengua', [
        'Sílaba tónica y átona',
        'Acentuación',
        'Nombre propio/común/concreto/abstracto',
        'Adjetivo: comparativo y superlativo',
        'El verbo: persona, número, tiempo',
        'Tipos de oraciones',
        'El cuento y la leyenda',
        'El texto descriptivo',
      ]),
      asignatura('mates', [
        'Números hasta 9.999',
        'Multiplicación con llevadas',
        'División exacta e inexacta',
        'Tablas completas',
        'Fracciones',
        'Decimales: décimas',
        'Masa: kg y g',
        'Perímetro',
      ], mathResources.grade3),
      asignatura('naturales', [
        'Sistema digestivo',
        'Sistema respiratorio',
        'Sistema circulatorio',
        'Los ecosistemas',
        'Rocas y minerales',
        'El ciclo del agua',
        'Fuentes de energía',
        'Nutrición en plantas y animales',
      ]),
      asignatura('sociales', [
        'El relieve: montañas, ríos, costas',
        'Mapas físicos de España',
        'Comunidades autónomas',
        'La población',
        'Sector primario',
        'Instituciones locales',
        'Siglos y décadas',
      ]),
      asignatura('ingles', [
        'Las profesiones',
        'La ropa',
        'Las tiendas',
        'Presente simple',
        'Adverbios de frecuencia',
        'Descripciones físicas',
        'Medios de transporte',
        'Hobbies',
      ]),
    ],
  },
  {
    id: '4',
    nombre: '4º de Primaria',
    asignaturas: [
      asignatura('lengua', [
        'Acentuación: agudas, llanas, esdrújulas',
        'Prefijos y sufijos',
        'Conjugación: presente, pasado, futuro',
        'Sujeto y predicado',
        'Sinónimos y antónimos',
        'Texto instructivo y periodístico',
        'Personajes, espacio y tiempo',
        'La obra de teatro',
        'Ortografía: b/v, h, g/j',
      ], languageResources.grade4),
      asignatura('mates', [
        'Números hasta 999.999',
        'Multiplicación por dos cifras',
        'División por dos cifras',
        'Decimales: décimas y centésimas',
        'Fracciones equivalentes',
        'Área de figuras',
        'Medidas de tiempo',
        'Estadística: tablas y gráficos',
      ], mathResources.grade4),
      asignatura('naturales', [
        'Sistema nervioso',
        'Huesos y músculos',
        'Los sentidos',
        'Reproducción en animales y plantas',
        'Clasificación de seres vivos',
        'Energías renovables y no renovables',
        'El reciclaje',
        'La contaminación',
      ]),
      asignatura('sociales', [
        'Ríos de España y Europa',
        'Climas de España',
        'La Unión Europea',
        'Demografía española',
        'Sector secundario',
        'Instituciones del Estado',
        'Prehistoria y Edad Antigua',
        'Patrimonio cultural',
      ]),
      asignatura('ingles', [
        'La ciudad y los edificios',
        'Indicaciones (directions)',
        'Pasado simple: regulares e irregulares',
        'Comparativos y superlativos',
        'Cuerpo y enfermedades',
        'Animales y medioambiente',
        'De compras',
        'Will: predicciones',
      ]),
    ],
  },
  {
    id: '5',
    nombre: '5º de Primaria',
    asignaturas: [
      asignatura('lengua', [
        'Determinantes: posesivos, demostrativos, numerales',
        'Complemento directo e indirecto',
        'Oraciones compuestas coordinadas',
        'Recursos literarios básicos',
        'Texto argumentativo y expositivo',
        'Uso del diccionario',
        'Ortografía: ll/y, r/rr, c/z',
        'Las clases de palabras',
      ]),
      asignatura('mates', [
        'Números enteros negativos',
        'Operaciones con paréntesis',
        'Suma y resta de fracciones',
        'Porcentajes',
        'Ángulos y tipos',
        'Perímetro y área de figuras compuestas',
        'Volumen (introducción)',
        'Estadística: media y moda',
      ], mathResources.grade5),
      asignatura('naturales', [
        'El universo y el sistema solar',
        'La Tierra: movimientos',
        'La atmósfera',
        'La hidrosfera',
        'La litosfera',
        'Las fuerzas y el movimiento',
        'La luz y el sonido',
        'Las máquinas simples',
      ]),
      asignatura('sociales', [
        'Paisajes de España y Europa',
        'La economía: producción y consumo',
        'Sector terciario',
        'La Edad Media: Al-Ándalus y reinos',
        'La Edad Moderna: América',
        'Monarquía y democracia',
        'Derechos humanos',
        'La globalización',
      ]),
      asignatura('ingles', [
        'Medios de comunicación y tecnología',
        'Pasado simple y continuo',
        'Going to vs will',
        'Condicional tipo 1',
        'Conectores discursivos',
        'Cartas, correos, noticias',
        'Medioambiente global',
        'Cultura anglófona',
      ]),
    ],
  },
  {
    id: '6',
    nombre: '6º de Primaria',
    asignaturas: [
      asignatura('lengua', [
        'Oraciones subordinadas',
        'El texto argumentativo: tesis y argumentos',
        'Figuras retóricas: metáfora, símil, personificación',
        'Comunicación verbal y no verbal',
        'Géneros literarios',
        'El Quijote',
        'Variedades del español',
        'Ortografía completa',
      ]),
      asignatura('mates', [
        'Números racionales',
        'Proporcionalidad directa e inversa',
        'Porcentajes: cálculo y aplicaciones',
        'Álgebra: la incógnita',
        'Cuerpos geométricos',
        'Coordenadas cartesianas',
        'Probabilidad',
        'Estadística: diagramas de sectores',
      ], mathResources.grade6),
      asignatura('naturales', [
        'Sistemas del cuerpo humano integrados',
        'La reproducción humana y la pubertad',
        'La célula',
        'Cadenas y redes tróficas',
        'Impacto humano en el medioambiente',
        'Electricidad y magnetismo',
        'Reacciones químicas',
        'Ciencia y tecnología',
      ]),
      asignatura('sociales', [
        'Revolución Francesa e Industrial',
        'España en el siglo XIX y XX',
        'La Guerra Civil y el franquismo',
        'La Constitución de 1978',
        'La UE: historia e instituciones',
        'Problemas actuales del mundo',
        'Desarrollo sostenible y Agenda 2030',
        'Ciudadanía digital',
      ]),
      asignatura('ingles', [
        'Presente perfecto',
        'La voz pasiva',
        'Estilo indirecto',
        'Cohesión textual',
        'Debate y expresión de opinión',
        'Textos literarios adaptados',
        'Variedades del inglés',
        'Presentación oral final',
      ]),
    ],
  },
];

export function getCurso(cursoId: string) {
  return curriculum.find((curso) => curso.id === cursoId);
}

export function getAsignatura(cursoId: string, asignaturaId: string) {
  return getCurso(cursoId)?.asignaturas.find(
    (asignatura) => asignatura.id === asignaturaId,
  );
}
