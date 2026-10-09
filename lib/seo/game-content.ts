// Texto descriptivo de cada juego (cómo se juega, qué se practica, consejos). Cada afirmación
// está comprobada contra el código del juego (app/[locale]/juegos/*, components/games).
import type { SiteLocale } from './site';
import { paths } from './urls';

export interface GameSection {
    heading: string;
    paragraphs: string[];
}

export interface GameLink {
    name: string;
    path: string;
}

interface GameContent {
    sections: GameSection[];
    /** Temas de repaso relacionados que ya existen en Eduaroo */
    related?: GameLink[];
}

type Localized = Record<SiteLocale, GameContent>;

const tema = (curso: string, asignatura: string, slug: string) => paths.tema(curso, asignatura, slug);

export const gameContent: Record<string, Localized> = {
    'astro-type': {
        es: {
            sections: [
                {
                    heading: 'Cómo se juega a Astro Type',
                    paragraphs: [
                        'Astro Type es un juego de mecanografía para aprender a escribir con el teclado sin mirarlo. Tiene dos partes. Las misiones de academia enseñan las teclas poco a poco: primero los dedos índices en la F y la J, después los dedos medios, los anulares y los meñiques, y más tarde la fila superior, la inferior, las mayúsculas, los números y los símbolos. La zona arcade lanza letras o palabras que hay que escribir antes de que lleguen abajo; empiezas con tres vidas y hay un modo de supervivencia sin final.',
                    ],
                },
                {
                    heading: 'Qué se practica',
                    paragraphs: [
                        'La colocación correcta de los dedos, la velocidad de escritura, medida en palabras por minuto, y la precisión. El juego guarda en el propio navegador la experiencia ganada y las estadísticas de las partidas.',
                    ],
                },
                {
                    heading: 'Consejos para familias y docentes',
                    paragraphs: [
                        'Funciona mejor con teclado físico. Conviene dar más importancia a la precisión que a la velocidad y repetir las primeras misiones hasta que los dedos encuentren solos las teclas. Las sesiones cortas y frecuentes dan mejor resultado que una sola larga.',
                    ],
                },
            ],
        },
        en: {
            sections: [
                {
                    heading: 'How to play Astro Type',
                    paragraphs: [
                        'Astro Type is a typing game for learning to use the keyboard without looking at it. It has two parts. The academy missions teach the keys step by step: first the index fingers on F and J, then the middle, ring and little fingers, and later the top row, the bottom row, capital letters, numbers and symbols. The arcade zone drops letters or words that you must type before they reach the bottom; you start with three lives and there is an endless survival mode.',
                    ],
                },
                {
                    heading: 'What it practises',
                    paragraphs: [
                        'Correct finger placement, typing speed measured in words per minute, and accuracy. The game saves the experience earned and your game statistics in the browser itself.',
                    ],
                },
                {
                    heading: 'Tips for families and teachers',
                    paragraphs: [
                        'It works best with a physical keyboard. Accuracy matters more than speed, so repeat the first missions until the fingers find the keys on their own. Short, frequent sessions work better than one long one.',
                    ],
                },
            ],
        },
    },

    bitblox: {
        es: {
            sections: [
                {
                    heading: 'Cómo se juega a BitBlox',
                    paragraphs: [
                        'BitBlox es un juego de pixel art con código binario. Cada nivel es una cuadrícula de 8 × 8 casillas y, junto a ella, aparece el código de cada fila: ocho cifras formadas por ceros y unos. Un 1 significa casilla pintada y un 0, casilla vacía. Pulsa las casillas para pintarlas o borrarlas hasta que cada fila coincida con su código; las filas correctas se marcan con una señal verde y, cuando el dibujo está completo, puedes pasar al siguiente nivel. Hay 21 dibujos, desde un corazón o un fantasmita hasta una corona o un robot.',
                    ],
                },
                {
                    heading: 'Qué se practica',
                    paragraphs: [
                        'La lectura de secuencias de ceros y unos, que es la base del sistema binario, la orientación en filas y columnas y la atención al detalle. También sirve para entender de forma sencilla cómo guarda un ordenador una imagen: como una tabla de píxeles encendidos y apagados.',
                    ],
                },
                {
                    heading: 'Consejos para familias y docentes',
                    paragraphs: [
                        'No hace falta saber binario para empezar: el propio juego lo enseña fila a fila. No hay tiempo límite, así que se puede jugar sin prisa y es una buena introducción al pensamiento computacional.',
                    ],
                },
            ],
        },
        en: {
            sections: [
                {
                    heading: 'How to play BitBlox',
                    paragraphs: [
                        'BitBlox is a pixel art game built on binary code. Each level is an 8 × 8 grid and, next to it, you see the code of every row: eight digits made of zeros and ones. A 1 means a painted square and a 0 means an empty one. Tap the squares to paint or erase them until each row matches its code; correct rows get a green tick and, once the drawing is complete, you can move on to the next level. There are 21 drawings, from a heart or a little ghost to a crown or a robot.',
                    ],
                },
                {
                    heading: 'What it practises',
                    paragraphs: [
                        'Reading sequences of zeros and ones, which is the basis of the binary system, finding your way around rows and columns, and attention to detail. It is also a simple way to understand how a computer stores an image: as a table of pixels that are on or off.',
                    ],
                },
                {
                    heading: 'Tips for families and teachers',
                    paragraphs: [
                        'You do not need to know binary to start: the game teaches it row by row. There is no time limit, so it can be played without rushing, and it is a good introduction to computational thinking.',
                    ],
                },
            ],
        },
    },

    'calculate-target': {
        es: {
            sections: [
                {
                    heading: 'Cómo se juega a Calcula el Objetivo',
                    paragraphs: [
                        'Cada nivel empieza con un número y con varias tarjetas numéricas. Arrastra una tarjeta hasta uno de los operadores, suma, resta, multiplicación o división, para aplicarla al número actual. Cada tarjeta se usa una sola vez y el objetivo es llegar exactamente a la cifra marcada. Si la operación no sale, por ejemplo una división que no es exacta, el movimiento se rechaza y puedes probar otra cosa o reiniciar el nivel. Hay 20 niveles: los primeros solo usan sumas, las restas llegan en el nivel 3, las multiplicaciones en el 8 y las divisiones en el 12, con más tarjetas y números más grandes a medida que avanzas.',
                    ],
                },
                {
                    heading: 'Qué se practica',
                    paragraphs: [
                        'El cálculo mental con las cuatro operaciones, el orden en que conviene aplicarlas y la idea de operaciones inversas. Como cada nivel se construye a partir del objetivo, siempre tiene solución.',
                    ],
                },
                {
                    heading: 'Consejos para familias y docentes',
                    paragraphs: [
                        'Anima a pensar hacia atrás: partir del objetivo y preguntarse qué tarjeta lo acerca. No hay tiempo límite, de modo que es un buen juego para comentar estrategias en voz alta.',
                    ],
                },
            ],
            related: [
                { name: 'Suma con llevadas (2º de Primaria)', path: tema('2', 'mates', 'suma-con-llevadas') },
                { name: 'Resta con llevadas (2º de Primaria)', path: tema('2', 'mates', 'resta-con-llevadas') },
                { name: 'Multiplicación con llevadas (3º de Primaria)', path: tema('3', 'mates', 'multiplicacion-con-llevadas') },
            ],
        },
        en: {
            sections: [
                {
                    heading: 'How to play Calculate Target',
                    paragraphs: [
                        'Every level starts with a number and several number cards. Drag a card onto one of the operators, add, subtract, multiply or divide, to apply it to the current number. Each card can be used only once and the aim is to land exactly on the target. If the operation does not work, for example a division that is not exact, the move is rejected and you can try something else or restart the level. There are 20 levels: the first ones use only additions, subtraction arrives at level 3, multiplication at level 8 and division at level 12, with more cards and bigger numbers as you go.',
                    ],
                },
                {
                    heading: 'What it practises',
                    paragraphs: [
                        'Mental calculation with the four operations, the order in which it is best to apply them, and the idea of inverse operations. Because every level is built from its target, it always has a solution.',
                    ],
                },
                {
                    heading: 'Tips for families and teachers',
                    paragraphs: [
                        'Encourage thinking backwards: start from the target and ask which card gets closer. There is no time limit, so it is a good game for talking through strategies out loud.',
                    ],
                },
            ],
            related: [
                { name: 'Addition with carrying (Primary 2)', path: tema('2', 'mates', 'suma-con-llevadas') },
                { name: 'Subtraction with borrowing (Primary 2)', path: tema('2', 'mates', 'resta-con-llevadas') },
                { name: 'Multiplication with carrying (Primary 3)', path: tema('3', 'mates', 'multiplicacion-con-llevadas') },
            ],
        },
    },

    'cyber-segments': {
        es: {
            sections: [
                {
                    heading: 'Cómo se juega a Cyber Segments',
                    paragraphs: [
                        'Cyber Segments reproduce una pantalla de siete segmentos, la que usan los relojes digitales y las calculadoras para dibujar los números. En cada ronda aparece un número del 0 al 9 y hay que formarlo encendiendo los segmentos correctos: cada pulsación enciende o apaga uno. Cuando creas que está bien, pulsa verificar el código. Si coincide, sumas puntos y aparece otro número; si no, el juego te pide que revises el patrón. Puedes mostrar u ocultar las letras que identifican cada segmento.',
                    ],
                },
                {
                    heading: 'Qué se practica',
                    paragraphs: [
                        'El reconocimiento de patrones, la forma de las cifras y el razonamiento lógico: cada segmento es como un interruptor que está encendido o apagado, una idea básica de la electrónica digital.',
                    ],
                },
                {
                    heading: 'Consejos para familias y docentes',
                    paragraphs: [
                        'Para empezar conviene dejar las etiquetas visibles y descubrir qué segmentos comparten números como el 3 y el 9. Después se pueden ocultar para un reto mayor. No hay prisa: se avanza a ritmo propio.',
                    ],
                },
            ],
        },
        en: {
            sections: [
                {
                    heading: 'How to play Cyber Segments',
                    paragraphs: [
                        'Cyber Segments reproduces a seven-segment display, the kind that digital clocks and calculators use to draw numbers. Each round shows a number from 0 to 9 and you have to form it by switching on the right segments: every tap turns one on or off. When you think it is right, press verify code. If it matches you score points and a new number appears; if not, the game asks you to check the pattern. You can show or hide the letters that identify each segment.',
                    ],
                },
                {
                    heading: 'What it practises',
                    paragraphs: [
                        'Pattern recognition, the shape of the digits and logical reasoning: every segment works like a switch that is on or off, a basic idea of digital electronics.',
                    ],
                },
                {
                    heading: 'Tips for families and teachers',
                    paragraphs: [
                        'To begin, keep the labels visible and discover which segments numbers such as 3 and 9 share. Later they can be hidden for a bigger challenge. There is no rush: you move at your own pace.',
                    ],
                },
            ],
        },
    },

    'galaxy-math-fuel': {
        es: {
            sections: [
                {
                    heading: 'Cómo se juega a Combustible Galáctico',
                    paragraphs: [
                        'Combustible Galáctico es un juego para repasar las tablas de multiplicar. Antes de despegar eliges el nivel, Cadete con velocidad baja y ayudas, Piloto con velocidad media o Comandante con velocidad alta, y la tabla que quieres practicar, del 1 al 20, o una mezcla. En pantalla aparece una multiplicación y caen tres depósitos de combustible con resultados distintos. Mueve la nave entre los tres carriles con las flechas del teclado, o con las teclas A y D, para recoger el que tiene la respuesta correcta. Empiezas con tres vidas: si recoges uno equivocado o se escapa el correcto, pierdes una y el juego te enseña la operación bien resuelta.',
                    ],
                },
                {
                    heading: 'Qué se practica',
                    paragraphs: [
                        'La memorización de las tablas de multiplicar y la rapidez del cálculo mental, con la posibilidad de centrarse en la tabla que más cuesta.',
                    ],
                },
                {
                    heading: 'Consejos para familias y docentes',
                    paragraphs: [
                        'Es mejor empezar en el nivel Cadete y con una sola tabla, y pasar a la mezcla cuando los resultados salgan con seguridad. Se juega con teclado.',
                    ],
                },
            ],
            related: [
                { name: 'Tablas del 2, 5 y 10 (2º de Primaria)', path: tema('2', 'mates', 'tablas-del-2-5-y-10') },
                { name: 'Tablas completas (3º de Primaria)', path: tema('3', 'mates', 'tablas-completas') },
            ],
        },
        en: {
            sections: [
                {
                    heading: 'How to play Galaxy Math Fuel',
                    paragraphs: [
                        'Galaxy Math Fuel is a game for revising the multiplication tables. Before take-off you choose the level, Cadet with low speed and hints, Pilot with medium speed or Commander with high speed, and the table you want to practise, from 1 to 20, or a mix. A multiplication appears on screen and three fuel tanks fall with different results. Move the ship between the three lanes with the arrow keys, or the A and D keys, to catch the one with the right answer. You start with three lives: if you catch a wrong one or the right one escapes, you lose a life and the game shows the correct operation.',
                    ],
                },
                {
                    heading: 'What it practises',
                    paragraphs: [
                        'Memorising the multiplication tables and mental calculation speed, with the option of focusing on the table that is hardest.',
                    ],
                },
                {
                    heading: 'Tips for families and teachers',
                    paragraphs: [
                        'It is better to start on Cadet level with a single table and move to the mix once the answers come with confidence. It is played with a keyboard.',
                    ],
                },
            ],
            related: [
                { name: 'Tables of 2, 5 and 10 (Primary 2)', path: tema('2', 'mates', 'tablas-del-2-5-y-10') },
                { name: 'Complete tables (Primary 3)', path: tema('3', 'mates', 'tablas-completas') },
            ],
        },
    },

    geominds: {
        es: {
            sections: [
                {
                    heading: 'Cómo se juega a GeoMinds',
                    paragraphs: [
                        'GeoMinds es un tangram digital. Cada nivel muestra una silueta, como un barco, un cohete, una casa o un pato, y hay que rellenarla con las siete piezas del tangram clásico: triángulos de distintos tamaños, un cuadrado y un paralelogramo. Arrastra una pieza hasta su sitio; si solo la tocas sin moverla, gira 45 grados. Cuando todas encajan, el nivel está completado. Hay 11 siluetas y puedes mostrar u ocultar las pistas, o reiniciar el nivel si prefieres empezar de nuevo.',
                    ],
                },
                {
                    heading: 'Qué se practica',
                    paragraphs: [
                        'El razonamiento espacial, el reconocimiento de figuras geométricas y de sus giros, y la composición y descomposición de formas, que es la base para entender el área y la simetría.',
                    ],
                },
                {
                    heading: 'Consejos para familias y docentes',
                    paragraphs: [
                        'Conviene empezar por las piezas más grandes y dejar las pequeñas para el final. Las pistas ayudan en los primeros niveles; después se pueden ocultar para resolver la silueta sin ayuda.',
                    ],
                },
            ],
            related: [
                { name: 'Figuras geométricas básicas (1º de Primaria)', path: tema('1', 'mates', 'figuras-geometricas-basicas') },
                { name: 'Figuras: lados y vértices (2º de Primaria)', path: tema('2', 'mates', 'figuras-lados-y-vertices') },
            ],
        },
        en: {
            sections: [
                {
                    heading: 'How to play GeoMinds',
                    paragraphs: [
                        'GeoMinds is a digital tangram. Every level shows a silhouette, such as a boat, a rocket, a house or a duck, and you have to fill it with the seven pieces of the classic tangram: triangles of different sizes, a square and a parallelogram. Drag a piece into place; if you only tap it without moving, it turns 45 degrees. When all the pieces fit, the level is complete. There are 11 silhouettes, and you can show or hide the hints, or restart the level if you prefer to begin again.',
                    ],
                },
                {
                    heading: 'What it practises',
                    paragraphs: [
                        'Spatial reasoning, recognising geometric shapes and their rotations, and composing and decomposing shapes, which is the basis for understanding area and symmetry.',
                    ],
                },
                {
                    heading: 'Tips for families and teachers',
                    paragraphs: [
                        'It helps to start with the biggest pieces and leave the small ones for the end. Hints are useful in the first levels; later they can be hidden to solve the silhouette unaided.',
                    ],
                },
            ],
            related: [
                { name: 'Basic geometric shapes (Primary 1)', path: tema('1', 'mates', 'figuras-geometricas-basicas') },
                { name: 'Shapes: sides and vertices (Primary 2)', path: tema('2', 'mates', 'figuras-lados-y-vertices') },
            ],
        },
    },

    'syllable-quest': {
        es: {
            sections: [
                {
                    heading: 'Cómo se juega a Syllable Quest',
                    paragraphs: [
                        'Syllable Quest, la Aventura de las Sílabas, se juega sobre una pizarra. Aparece una palabra y hay que cortarla en sílabas haciendo clic entre las letras donde termina cada una; después se pulsa comprobar. Cada palabra bien separada suma 100 puntos. Tienes cinco vidas, que se pierden con cada error, y 60 segundos de reloj. Antes de empezar puedes elegir el idioma de las palabras: español, inglés, portugués, francés o italiano. Hay palabras de una sílaba, como sol o pan, y otras de cuatro o más, como mariposa.',
                    ],
                },
                {
                    heading: 'Qué se practica',
                    paragraphs: [
                        'La conciencia silábica, que ayuda a leer y a escribir con más seguridad, y la separación de palabras en sílabas. En español refuerza lo que se trabaja en Lengua sobre sílabas y diptongos.',
                    ],
                },
                {
                    heading: 'Consejos para familias y docentes',
                    paragraphs: [
                        'Antes de cortar, conviene decir la palabra en voz alta y dar una palmada por cada sílaba. Si se agota el tiempo, la partida termina y se puede jugar otra vez enseguida.',
                    ],
                },
            ],
            related: [
                { name: 'Lectura de sílabas (1º de Primaria)', path: tema('1', 'lengua', 'lectura-de-silabas') },
                { name: 'Sílabas: diptongo (2º de Primaria)', path: tema('2', 'lengua', 'silabas-diptongo') },
            ],
        },
        en: {
            sections: [
                {
                    heading: 'How to play Syllable Quest',
                    paragraphs: [
                        'Syllable Quest, the Syllable Adventure, is played on a blackboard. A word appears and you have to cut it into syllables by clicking between the letters where each one ends, then press check. Every word split correctly scores 100 points. You have five lives, lost with each mistake, and a 60-second clock. Before starting you can choose the language of the words: Spanish, English, Portuguese, French or Italian. There are one-syllable words, such as sol or pan, and others with four or more.',
                    ],
                },
                {
                    heading: 'What it practises',
                    paragraphs: [
                        'Syllable awareness, which helps with reading and writing more confidently, and splitting words into syllables. In Spanish it reinforces what is covered in Language classes about syllables and diphthongs.',
                    ],
                },
                {
                    heading: 'Tips for families and teachers',
                    paragraphs: [
                        'Before cutting, say the word out loud and clap once for each syllable. If time runs out the game ends and you can play again straight away.',
                    ],
                },
            ],
            related: [
                { name: 'Reading syllables (Primary 1)', path: tema('1', 'lengua', 'lectura-de-silabas') },
                { name: 'Syllables: diphthongs (Primary 2)', path: tema('2', 'lengua', 'silabas-diptongo') },
            ],
        },
    },

    tictac: {
        es: {
            sections: [
                {
                    heading: 'Cómo se juega a TicTac Maestro',
                    paragraphs: [
                        'En pantalla aparece una hora en formato digital, con horas, minutos y segundos, por ejemplo 03:25:40. Tu tarea es dejar el reloj analógico exactamente a esa hora: haz clic o toca y arrastra las tres manecillas, la de las horas, la de los minutos y la de los segundos, hasta su sitio y pulsa comprobar. Cada partida tiene seis preguntas. Según lo cerca que estén las agujas de la hora pedida ganas más o menos puntos y recibes un mensaje, desde «Sigue practicando» hasta «Eres un Maestro del Tiempo».',
                    ],
                },
                {
                    heading: 'Qué se practica',
                    paragraphs: [
                        'La lectura del reloj analógico, la relación entre la hora digital y la analógica y la diferencia entre las manecillas de horas, minutos y segundos.',
                    ],
                },
                {
                    heading: 'Consejos para familias y docentes',
                    paragraphs: [
                        'Un buen truco es colocar primero la aguja pequeña, la de las horas, y después ajustar los minutos. El juego se puede repetir cuantas veces haga falta porque las horas son distintas en cada partida.',
                    ],
                },
            ],
            related: [{ name: 'Medidas de tiempo (4º de Primaria)', path: tema('4', 'mates', 'medidas-de-tiempo') }],
        },
        en: {
            sections: [
                {
                    heading: 'How to play TicTac Maestro',
                    paragraphs: [
                        'A time appears on screen in digital format, with hours, minutes and seconds, for example 03:25:40. Your task is to set the analogue clock to exactly that time: click or tap and drag the three hands, the hour hand, the minute hand and the second hand, into place and press check. Each game has six questions. Depending on how close the hands are to the requested time you earn more or fewer points and get a message, from “Keep practising” to “You are a Time Master”.',
                    ],
                },
                {
                    heading: 'What it practises',
                    paragraphs: [
                        'Reading an analogue clock, the link between digital and analogue time, and the difference between the hour, minute and second hands.',
                    ],
                },
                {
                    heading: 'Tips for families and teachers',
                    paragraphs: [
                        'A good trick is to place the small hand, the hour hand, first and then adjust the minutes. The game can be repeated as often as needed because the times are different in every game.',
                    ],
                },
            ],
            related: [{ name: 'Measures of time (Primary 4)', path: tema('4', 'mates', 'medidas-de-tiempo') }],
        },
    },

    wordsearch: {
        es: {
            sections: [
                {
                    heading: 'Cómo se juega a la Súper Sopa de Letras',
                    paragraphs: [
                        'Primero se elige un tema: animales, comida, escuela, tecnología, colores o deportes. Después aparece una cuadrícula de 12 × 10 letras con diez palabras escondidas, que pueden estar en horizontal, en vertical o en diagonal. Para marcar una palabra, arrastra el ratón o el dedo desde su primera letra hasta la última. Cada palabra encontrada suma 100 puntos y se marca en la lista. Al encontrarlas todas termina la ronda y el juego muestra la puntuación y el tiempo empleado; puedes repetir el mismo tema, con palabras y posiciones distintas, o elegir otro.',
                    ],
                },
                {
                    heading: 'Qué se practica',
                    paragraphs: [
                        'El vocabulario de cada tema, el reconocimiento de las palabras escritas y la atención visual, al recorrer la cuadrícula en varias direcciones.',
                    ],
                },
                {
                    heading: 'Consejos para familias y docentes',
                    paragraphs: [
                        'Es útil leer en voz alta la lista de palabras antes de empezar y buscar primero las más largas. Se puede jugar en pantallas táctiles y con ratón.',
                    ],
                },
            ],
        },
        en: {
            sections: [
                {
                    heading: 'How to play Super Word Search',
                    paragraphs: [
                        'First choose a topic: animals, food, school, technology, colours or sports. A grid of 12 × 10 letters then appears with ten hidden words, which can run horizontally, vertically or diagonally. To mark a word, drag the mouse or your finger from its first letter to the last. Every word found scores 100 points and is marked on the list. When you find them all the round ends and the game shows your score and the time taken; you can repeat the same topic, with different words and positions, or choose another.',
                    ],
                },
                {
                    heading: 'What it practises',
                    paragraphs: [
                        'The vocabulary of each topic, recognising written words and visual attention, by scanning the grid in several directions.',
                    ],
                },
                {
                    heading: 'Tips for families and teachers',
                    paragraphs: [
                        'It helps to read the word list out loud before starting and to look for the longest words first. It can be played on touch screens and with a mouse.',
                    ],
                },
            ],
        },
    },
};

// Otros juegos que se recomiendan desde cada página (mismas materias o ideas parecidas)
export const relatedGames: Record<string, { slug: string; name: string }[]> = {
    'astro-type': [{ slug: 'wordsearch', name: 'Súper Sopa de Letras' }, { slug: 'syllable-quest', name: 'Syllable Quest' }],
    bitblox: [{ slug: 'cyber-segments', name: 'Cyber Segments' }, { slug: 'geominds', name: 'GeoMinds' }],
    'calculate-target': [{ slug: 'galaxy-math-fuel', name: 'Combustible Galáctico' }, { slug: 'tictac', name: 'TicTac Maestro' }],
    'cyber-segments': [{ slug: 'bitblox', name: 'BitBlox' }, { slug: 'calculate-target', name: 'Calcula el Objetivo' }],
    'galaxy-math-fuel': [{ slug: 'calculate-target', name: 'Calcula el Objetivo' }, { slug: 'tictac', name: 'TicTac Maestro' }],
    geominds: [{ slug: 'bitblox', name: 'BitBlox' }, { slug: 'cyber-segments', name: 'Cyber Segments' }],
    'syllable-quest': [{ slug: 'wordsearch', name: 'Súper Sopa de Letras' }, { slug: 'astro-type', name: 'Astro Type' }],
    tictac: [{ slug: 'galaxy-math-fuel', name: 'Combustible Galáctico' }, { slug: 'calculate-target', name: 'Calcula el Objetivo' }],
    wordsearch: [{ slug: 'syllable-quest', name: 'Syllable Quest' }, { slug: 'astro-type', name: 'Astro Type' }],
};

export const getGameContent = (slug: string, locale: SiteLocale): GameContent | undefined => gameContent[slug]?.[locale];

export const countWords = (content: GameContent) =>
    content.sections.flatMap((s) => [s.heading, ...s.paragraphs]).join(' ').split(/\s+/).filter(Boolean).length;
