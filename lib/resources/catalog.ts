import type { AsignaturaId } from '@/src/types';

export const RESOURCE_UPDATED = new Date('2026-10-13T00:00:00Z');
export const resourceGroups = [
    'Matemáticas',
    'Lengua y lectura',
    'Organización y fichas',
    'Por edades',
    'Inglés y ciencias',
] as const;
export type ResourceGroup = (typeof resourceGroups)[number];
export type ResourceTool =
    | 'arithmetic'
    | 'clock'
    | 'fractions'
    | 'roman'
    | 'angles'
    | 'handwriting'
    | 'timetable'
    | 'dictation'
    | 'syllables'
    | 'verbs'
    | 'map'
    | 'preschool'
    | 'assessment'
    | 'summer';
export interface ResourceGuide {
    slug: string;
    label: string;
    title: string;
    description: string;
    intro: string;
    group: ResourceGroup;
    icon: string;
    ages: string;
    subject?: AsignaturaId;
    grades?: string[];
    match?: string;
    tool?: ResourceTool;
    steps: string[];
    example: [string, string, string];
    pitfall: string;
    faq: [string, string][];
    related: string[];
}

export const resourceGuides: ResourceGuide[] = [
    {
        slug: 'fichas-para-imprimir',
        label: 'Fichas para imprimir',
        title: 'Fichas de Primaria para imprimir con soluciones',
        description:
            'Fichas gratis de 1º a 6º de Primaria: matemáticas, lengua, inglés y ciencias. Elige un tema, imprime en A4 y consulta las soluciones explicadas.',
        intro: 'Elige curso, asignatura y tema para preparar una ficha del catálogo de Eduaroo. Los mismos ejercicios que practicas en pantalla se pueden trabajar en papel, con espacio para responder y un solucionario separado.',
        group: 'Organización y fichas',
        icon: '🖨️',
        ages: '1º–6º de Primaria',
        steps: [
            'Busca un tema que ya se haya trabajado en clase.',
            'Abre la ficha y decide si quieres incluir las ideas clave y el solucionario.',
            'Imprime en A4 o elige «Guardar como PDF» en la ventana de impresión del navegador.',
        ],
        example: [
            '¿Cómo preparo una ficha de fracciones?',
            'Filtra por Matemáticas y abre un tema de fracciones de tu curso.',
            'La ficha incluye los enunciados y, si lo activas, las respuestas con su explicación.',
        ],
        pitfall:
            'Imprime primero una ficha corta. El solucionario aparece al final para que puedas entregarlo después de la práctica.',
        faq: [
            [
                '¿Tengo que dar mi correo?',
                'No. Las fichas se abren e imprimen sin registro.',
            ],
            [
                '¿Son archivos PDF descargables?',
                'Puedes guardarlas como PDF desde la ventana de impresión de tu navegador. El contenido se prepara como una hoja A4.',
            ],
        ],
        related: [
            'generador-de-caligrafia',
            'horario-escolar-imprimible',
            'cuaderno-verano',
        ],
    },
    {
        slug: 'tablas-de-multiplicar',
        label: 'Tablas de multiplicar',
        title: 'Tablas de multiplicar: práctica del 1 al 12',
        description:
            'Aprende las tablas de multiplicar del 1 al 12 con ejercicios gratis, pistas y soluciones. Consulta cada tabla y sigue practicando por curso.',
        intro: 'Multiplicar es contar grupos iguales. Empieza por una tabla, observa sus patrones y comprueba cada respuesta. Después mezcla varias tablas y utiliza los temas del curso para aplicar lo aprendido a situaciones cotidianas.',
        group: 'Matemáticas',
        icon: '✖️',
        ages: '2º–4º de Primaria',
        subject: 'mates',
        match: 'tablas|multiplicacion',
        tool: 'arithmetic',
        steps: [
            'Construye grupos: tres bolsas con cuatro fichas son 3 × 4.',
            'Practica las tablas del 2, 5 y 10 y después amplía la selección.',
            'Relaciona las cuentas: si sabes 4 × 7, también sabes 7 × 4.',
        ],
        example: [
            '¿Cuánto es 6 × 7?',
            '42',
            'Puedes pensar en 5 × 7 = 35 y añadir otro grupo de 7: 35 + 7 = 42.',
        ],
        pitfall:
            'Recitar una tabla en orden no siempre basta. Cambia el orden de las preguntas y pide que explique un resultado con grupos o dibujos.',
        faq: [
            [
                '¿Puedo elegir una sola tabla?',
                'Sí. En la práctica selecciona una tabla del 1 al 12.',
            ],
            [
                '¿Qué hago si se atasca con el 7 o el 8?',
                'Apóyate en resultados conocidos: el doble, la tabla anterior y la propiedad conmutativa.',
            ],
        ],
        related: [
            'divisiones-para-ninos',
            'calculo-mental',
            'problemas-de-matematicas',
        ],
    },
    {
        slug: 'aprender-a-leer-el-reloj',
        label: 'Leer el reloj',
        title: 'Aprender a leer el reloj: horas y minutos',
        description:
            'Practica las horas en punto, y media, y cuarto y menos cuarto con un reloj interactivo gratis. Mueve las agujas y relaciona la hora con tu día.',
        intro: 'En un reloj de agujas, la corta marca las horas y la larga marca los minutos. Explora el reloj, cambia la hora y comprueba cómo avanza la aguja corta mientras pasan los minutos. Empieza por las horas en punto y sigue con los cuartos.',
        group: 'Matemáticas',
        icon: '🕒',
        ages: '1º–4º de Primaria',
        subject: 'mates',
        match: 'tiempo|dias-y-meses',
        tool: 'clock',
        steps: [
            'Identifica la aguja corta y la larga.',
            'Cuenta los minutos de cinco en cinco alrededor del reloj.',
            'Relaciona las horas con una rutina: entrar al colegio, merendar o acostarte.',
        ],
        example: [
            'Si son las 8:45, ¿cómo puedes decir la hora?',
            'Las nueve menos cuarto.',
            'Han pasado 45 minutos desde las ocho y faltan 15 para las nueve.',
        ],
        pitfall:
            'A las 8:45 la aguja corta está entre el 8 y el 9, cerca del 9. No permanece fija en el 8 durante toda la hora.',
        faq: [
            [
                '¿El reloj sirve para las horas digitales?',
                'Sí. La misma hora aparece en formato digital y con agujas.',
            ],
            [
                '¿Qué significa «y media»?',
                'Han pasado 30 minutos desde la hora en punto; el minutero señala el 6.',
            ],
        ],
        related: [
            'tablas-de-multiplicar',
            'sumas-y-restas',
            'horario-escolar-imprimible',
        ],
    },
    {
        slug: 'sumas-y-restas',
        label: 'Sumas y restas',
        title: 'Sumas y restas para niños, con explicación',
        description:
            'Ejercicios gratis de sumas y restas para niños: hasta 10, hasta 20 y con números de dos cifras. Comprueba respuestas y repasa las llevadas.',
        intro: 'Practica cómo juntar cantidades y cómo encontrar lo que queda o falta. Elige una dificultad que puedas explicar con objetos o dibujos y pasa a números mayores cuando entiendas el valor de las unidades y las decenas.',
        group: 'Matemáticas',
        icon: '➕',
        ages: '1º–3º de Primaria',
        subject: 'mates',
        match: 'suma|resta',
        tool: 'arithmetic',
        steps: [
            'Representa una suma juntando dos grupos.',
            'Para restar, quita objetos o cuenta la distancia entre dos números.',
            'En las cuentas escritas, coloca unidades debajo de unidades y decenas debajo de decenas.',
        ],
        example: [
            '¿Cuánto es 27 + 35?',
            '62',
            '7 + 5 son 12 unidades: una decena y dos unidades. Las decenas son 2 + 3 + 1 = 6.',
        ],
        pitfall:
            'En una resta con cambio de decena, no restes siempre la cifra pequeña a la grande: eso cambia el problema.',
        faq: [
            [
                '¿Las restas pueden dar un número negativo?',
                'La práctica inicial usa resultados iguales o mayores que cero. Los enteros negativos tienen su propio tema en 5º.',
            ],
            [
                '¿Cómo repaso las llevadas?',
                'Abre los temas de suma y resta con llevadas de 2º para practicar con explicaciones.',
            ],
        ],
        related: [
            'calculo-mental',
            'problemas-de-matematicas',
            'tablas-de-multiplicar',
        ],
    },
    {
        slug: 'divisiones-para-ninos',
        label: 'Divisiones',
        title: 'Divisiones para niños: exactas y con resto',
        description:
            'Aprende a dividir con ejercicios gratis de divisiones exactas y con resto. Practica el cociente, comprueba el resultado y sigue por curso.',
        intro: 'Dividir permite repartir una cantidad en grupos iguales o averiguar cuántos grupos caben. La práctica muestra por separado el cociente y el resto, y utiliza la multiplicación para comprobar el reparto.',
        group: 'Matemáticas',
        icon: '➗',
        ages: '3º–5º de Primaria',
        subject: 'mates',
        match: 'division',
        tool: 'arithmetic',
        steps: [
            'Identifica la cantidad total y el tamaño o número de grupos.',
            'Busca la multiplicación más cercana sin superar el total.',
            'Comprueba: divisor × cociente + resto = dividendo.',
        ],
        example: [
            'Repartes 23 cromos entre 5 personas. ¿Cuántos recibe cada una y cuántos sobran?',
            '4 cromos por persona y sobran 3.',
            '5 × 4 + 3 = 23. El resto, 3, es menor que el divisor, 5.',
        ],
        pitfall:
            'El resto siempre debe ser menor que el divisor. Si es igual o mayor, aún se puede repartir otro grupo.',
        faq: [
            [
                '¿Qué es una división exacta?',
                'Una división cuyo resto es cero.',
            ],
            [
                '¿Cómo se comprueba una división con resto?',
                'Multiplica divisor por cociente y suma el resto. Debe dar el dividendo.',
            ],
        ],
        related: [
            'tablas-de-multiplicar',
            'fracciones-para-ninos',
            'problemas-de-matematicas',
        ],
    },
    {
        slug: 'calculo-mental',
        label: 'Cálculo mental',
        title: 'Cálculo mental para niños: práctica y trucos',
        description:
            'Practica cálculo mental gratis con sumas, restas, multiplicaciones y divisiones. Usa descomposición, dobles y compensación para explicar tu respuesta.',
        intro: 'El cálculo mental también consiste en elegir una estrategia. Practica sin reloj, compara caminos y explica cómo has pensado la cuenta. La precisión y la comprensión ayudan a ganar soltura antes de buscar rapidez.',
        group: 'Matemáticas',
        icon: '⚡',
        ages: '1º–6º de Primaria',
        subject: 'mates',
        match: 'suma|resta|tablas|operaciones|porcentajes',
        tool: 'arithmetic',
        steps: [
            'Descompón los números en decenas y unidades.',
            'Usa dobles conocidos y números cercanos a una decena.',
            'Comprueba el resultado con una segunda estrategia.',
        ],
        example: [
            'Calcula 39 + 26 de cabeza.',
            '65',
            'Suma 40 + 26 = 66 y compensa quitando la unidad que añadiste: 66 − 1 = 65.',
        ],
        pitfall:
            'No conviertas cada sesión en una carrera. Si una estrategia no se entiende, vuelve a dibujos o números más pequeños.',
        faq: [
            [
                '¿Hay que responder rápido?',
                'No. Esta práctica permite pensar sin límite de tiempo.',
            ],
            [
                '¿Qué estrategia sirve para restar números próximos?',
                'Cuenta desde el menor hasta el mayor: de 57 a 62 hay 5.',
            ],
        ],
        related: [
            'sumas-y-restas',
            'tablas-de-multiplicar',
            'retos-matematicos-para-ninos',
        ],
    },
    {
        slug: 'generador-de-caligrafia',
        label: 'Generador de caligrafía',
        title: 'Generador de caligrafía gratis para imprimir',
        description:
            'Crea fichas de caligrafía con tus palabras y frases. Elige tamaño, pauta o cuadrícula, añade renglones y guarda la hoja como PDF desde el navegador.',
        intro: 'Escribe palabras o frases que tengan sentido para quien va a practicarlas. Puedes cambiar el tamaño del modelo, elegir una pauta y dejar espacio para copiar. La vista previa es la misma hoja que se prepara para imprimir.',
        group: 'Organización y fichas',
        icon: '✏️',
        ages: 'Infantil–3º de Primaria',
        subject: 'lengua',
        match: 'escritura|vocales|lectura-de-silabas',
        tool: 'handwriting',
        steps: [
            'Escribe una palabra o una frase por línea.',
            'Elige un tamaño legible y la pauta que se utiliza en clase.',
            'Añade renglones vacíos e imprime la hoja en A4.',
        ],
        example: [
            '¿Qué texto puedo usar para empezar?',
            'Una palabra conocida, como «luna», o una frase breve.',
            'Un modelo corto permite observar el tamaño, la separación y el trazado sin llenar una hoja de repeticiones.',
        ],
        pitfall:
            'La pauta y el tipo de letra dependen del método de clase. Consulta el modelo del colegio y evita forzar un cambio solo por la edad.',
        faq: [
            [
                '¿Puedo personalizar el texto?',
                'Sí. El texto se prepara en tu navegador y no se envía a un servicio de generación.',
            ],
            [
                '¿Incluye letra punteada?',
                'Esta versión ofrece modelos de imprenta y guías para copiar; no usa una fuente punteada ni cursiva escolar.',
            ],
        ],
        related: [
            'fichas-para-imprimir',
            'dictados-para-ninos',
            'separar-silabas',
        ],
    },
    {
        slug: 'horario-escolar-imprimible',
        label: 'Horario escolar para imprimir',
        title: 'Horario escolar editable para imprimir gratis',
        description:
            'Prepara un horario escolar semanal gratis: edita días, horas y asignaturas. Imprime tu plantilla en A4 o guárdala como PDF desde el navegador.',
        intro: 'Organiza las clases y las actividades de la semana con una plantilla editable. Pon las horas reales de tu colegio, añade descansos y utiliza los espacios vacíos para preparar una rutina de repaso asumible.',
        group: 'Organización y fichas',
        icon: '📅',
        ages: 'Todos los cursos',
        tool: 'timetable',
        steps: [
            'Elige cinco o siete días y el número de franjas.',
            'Escribe las horas y el contenido de cada casilla.',
            'Imprime la plantilla; usa la orientación horizontal si necesitas más espacio.',
        ],
        example: [
            '¿Dónde coloco un repaso de Lengua?',
            'En una franja libre que no quite tiempo al descanso.',
            'El horario permite acordar un momento concreto y cambiarlo cuando la semana lo necesite.',
        ],
        pitfall:
            'Una plantilla sirve para organizar, no para llenar todas las tardes. Reserva tiempo libre y ajusta la rutina al horario del centro.',
        faq: [
            [
                '¿Se guarda automáticamente?',
                'La plantilla permanece mientras la página siga abierta. Imprime o guarda el PDF para conservarla.',
            ],
            [
                '¿Puedo incluir el fin de semana?',
                'Sí. Cambia la selección de cinco a siete días.',
            ],
        ],
        related: ['vuelta-al-cole', 'repaso-verano', 'evaluacion-inicial'],
    },
    {
        slug: 'problemas-de-matematicas',
        label: 'Problemas de matemáticas',
        title: 'Problemas de matemáticas por curso con soluciones',
        description:
            'Problemas de matemáticas de 1º a 6º de Primaria, gratis y con soluciones explicadas. Lee, elige la operación, practica online o imprime una ficha.',
        intro: 'Resolver un problema empieza por comprender qué se pregunta. El catálogo reúne situaciones y explicaciones de Matemáticas por curso: cantidades, medidas, dinero, fracciones y porcentajes. Puedes practicar en pantalla o preparar una ficha.',
        group: 'Matemáticas',
        icon: '🧠',
        ages: '1º–6º de Primaria',
        subject: 'mates',
        steps: [
            'Explica la pregunta con tus propias palabras.',
            'Identifica los datos útiles y dibuja la situación si hace falta.',
            'Resuelve y revisa si la respuesta tiene sentido y lleva su unidad.',
        ],
        example: [
            'Una entrada cuesta 6 €. ¿Cuánto cuestan 4 entradas?',
            '24 €.',
            'Hay cuatro grupos de 6 euros: 4 × 6 = 24. La respuesta expresa un precio total.',
        ],
        pitfall:
            'Palabras como «más» no siempre indican una suma. Decide la operación a partir de la relación entre las cantidades.',
        faq: [
            [
                '¿Se ven las soluciones?',
                'Cada actividad explica la respuesta después de contestar. En papel puedes incluir un solucionario separado.',
            ],
            [
                '¿Cómo elijo el nivel?',
                'Selecciona el curso y empieza por un tema que se esté trabajando en clase.',
            ],
        ],
        related: [
            'sumas-y-restas',
            'divisiones-para-ninos',
            'retos-matematicos-para-ninos',
        ],
    },
    {
        slug: 'evaluacion-inicial',
        label: 'Evaluación inicial',
        title: 'Evaluación inicial de Primaria: repaso orientativo',
        description:
            'Elige el curso que vas a empezar y prueba un repaso orientativo de matemáticas y lengua. Consulta tus respuestas y encuentra temas para reforzar.',
        intro: 'Esta actividad breve ayuda a decidir por dónde empezar el repaso. Para 2º a 6º utiliza preguntas de Matemáticas y Lengua del curso anterior. Para empezar 1º ofrece una pequeña actividad de conteo y letras. El resultado orienta la práctica y no sustituye la evaluación del colegio.',
        group: 'Organización y fichas',
        icon: '📋',
        ages: 'Inicio de 1º–6º',
        tool: 'assessment',
        steps: [
            'Selecciona el curso que vas a empezar.',
            'Responde sin consultar las soluciones y sin límite de tiempo.',
            'Revisa cada explicación y abre los temas recomendados para seguir practicando.',
        ],
        example: [
            'Voy a empezar 4º. ¿Qué contenidos repaso?',
            'Una selección de Matemáticas y Lengua de 3º.',
            'El objetivo es revisar conocimientos anteriores y localizar temas que merecen otra práctica.',
        ],
        pitfall:
            'Una muestra breve no mide todo el curso. No uses el número de aciertos para etiquetar al niño ni para compararlo con otros.',
        faq: [
            [
                '¿Es una prueba oficial?',
                'No. Es un repaso orientativo para casa. La evaluación del centro usa sus propios instrumentos y observaciones.',
            ],
            [
                '¿Qué ocurre al fallar?',
                'Puedes leer la explicación y acceder al tema de origen para practicarlo con más actividades.',
            ],
        ],
        related: ['vuelta-al-cole', 'repaso-verano', 'fichas-para-imprimir'],
    },
    {
        slug: 'vuelta-al-cole',
        label: 'Vuelta al cole',
        title: 'Vuelta al cole: plan de repaso por curso',
        description:
            'Prepara la vuelta al cole con un plan gratis: revisa contenidos del curso anterior, organiza el horario y elige actividades de repaso de Primaria.',
        intro: 'Preparar el nuevo curso combina organización y repaso. Elige algunos contenidos del curso terminado, recupera una rutina flexible y deja preparado el material. Puedes empezar con la actividad orientativa y después elegir los temas que más ayuda necesiten.',
        group: 'Organización y fichas',
        icon: '🎒',
        ages: '1º–6º de Primaria',
        steps: [
            'Revisa con el niño qué le resultó fácil y qué quiere volver a practicar.',
            'Elige dos o tres temas del curso anterior, alternando Matemáticas y Lengua.',
            'Completa el horario del colegio y prepara el material que haya pedido el centro.',
        ],
        example: [
            'Empiezo 3º y quiero repasar.',
            'Prueba sumas con llevadas, lectura y tablas del 2, 5 y 10 de 2º.',
            'Elige primero los temas conocidos y ajusta la selección a lo que se haya trabajado en tu colegio.',
        ],
        pitfall:
            'Las fechas de inicio cambian según la comunidad y el centro. Consulta el calendario oficial de tu colegio antes de organizar la semana.',
        faq: [
            [
                '¿Hay que repasar todo el verano?',
                'Puedes elegir unas pocas actividades cuando resulte útil y reservar tiempo para descansar.',
            ],
            [
                '¿Qué curso selecciono?',
                'Para repasar, el que acaba de terminar; en la evaluación inicial, el que va a empezar.',
            ],
        ],
        related: [
            'evaluacion-inicial',
            'horario-escolar-imprimible',
            'repaso-verano',
        ],
    },
    {
        slug: 'dictados-para-ninos',
        label: 'Dictados',
        title: 'Dictados para niños por curso, con audio',
        description:
            'Dictados cortos gratis de 1º a 6º de Primaria. Escucha la frase, escribe y compara tu respuesta, incluidas tildes y puntuación, con el texto original.',
        intro: 'Escucha una frase original de Eduaroo, escríbela y compara tu versión con el modelo. Las frases están agrupadas por curso y aumentan en longitud. La lectura utiliza las voces disponibles en tu dispositivo; también puede leer el texto una persona adulta.',
        group: 'Lengua y lectura',
        icon: '🎧',
        ages: '1º–6º de Primaria',
        subject: 'lengua',
        match: 'dictado|ortografia|puntuacion|acentuacion',
        tool: 'dictation',
        steps: [
            'Escucha la frase completa para comprenderla.',
            'Vuelve a escucharla y escribe a tu ritmo.',
            'Compara palabra por palabra, corrige y explica una regla que hayas utilizado.',
        ],
        example: [
            'Dictado de inicio: «La luna sale de noche.»',
            'La luna sale de noche.',
            'Empieza con mayúscula, separa las palabras y termina la oración con punto.',
        ],
        pitfall:
            'La comparación automática muestra diferencias con el modelo. Una diferencia no identifica por sí sola la causa del error.',
        faq: [
            [
                '¿Por qué no escucho la voz?',
                'El audio depende de las voces del navegador o dispositivo. Si no están disponibles, muestra el modelo para que lo lea un adulto.',
            ],
            [
                '¿Se revisan las tildes?',
                'Sí. La comparación conserva tildes, mayúsculas y puntuación.',
            ],
        ],
        related: [
            'ortografia-para-ninos',
            'generador-de-caligrafia',
            'comprension-lectora',
        ],
    },
    {
        slug: 'ortografia-para-ninos',
        label: 'Ortografía (b/v, g/j, h)',
        title: 'Ortografía para niños: b, v, g, j y h',
        description:
            'Repasa ortografía de Primaria con ejercicios gratis de b/v, g/j y h, tildes y puntuación. Consulta ejemplos, explicaciones y fichas con soluciones.',
        intro: 'Algunas letras no se distinguen solo por el sonido. Practica palabras dentro de frases, observa familias y revisa la explicación de cada respuesta. Los temas incluyen b/v, g/j, h, acentuación y signos de puntuación.',
        group: 'Lengua y lectura',
        icon: '✍️',
        ages: '3º–6º de Primaria',
        subject: 'lengua',
        match: 'ortografia|acentuacion|puntuacion|coma',
        steps: [
            'Lee la frase para saber qué significa la palabra.',
            'Busca una regla o una palabra de la misma familia.',
            'Corrige y escribe una frase nueva con esa palabra.',
        ],
        example: [
            '¿Cómo se escribe «escribir»?',
            'Con b.',
            'Los verbos acabados en -bir se escriben con b, excepto hervir, servir y vivir y sus derivados.',
        ],
        pitfall:
            'Las reglas pueden tener excepciones. Memorizar una fórmula sin ejemplos puede llevar a escribir mal palabras como «vivir».',
        faq: [
            [
                '¿Qué letras se trabajan?',
                'El tema de 4º reúne b/v, h y g/j; otros temas amplían acentuación, ll/y, r/rr y c/z.',
            ],
            [
                '¿Cómo practico las tildes?',
                'Abre acentuación y distingue la sílaba tónica antes de aplicar la regla.',
            ],
        ],
        related: [
            'dictados-para-ninos',
            'separar-silabas',
            'conjugacion-de-verbos',
        ],
    },
    {
        slug: 'conjugacion-de-verbos',
        label: 'Conjugación de verbos',
        title: 'Conjugación de verbos: presente, pasado y futuro',
        description:
            'Practica la conjugación de verbos en presente, pretérito perfecto simple y futuro. Consulta tablas y ejercicios gratis de verbos regulares e irregulares.',
        intro: 'Un verbo cambia según quién realiza la acción y cuándo ocurre. Consulta los modelos de hablar, comer, vivir, ser, tener e ir y completa frases en presente, pretérito perfecto simple y futuro simple.',
        group: 'Lengua y lectura',
        icon: '💬',
        ages: '2º–6º de Primaria',
        subject: 'lengua',
        match: 'verbo|conjugacion',
        tool: 'verbs',
        steps: [
            'Identifica quién realiza la acción: yo, tú, él o ella, nosotros, vosotros, ellos.',
            'Sitúa la acción en el presente, pasado o futuro.',
            'Comprueba si el verbo sigue un modelo regular o cambia de forma.',
        ],
        example: [
            'Ayer nosotros ___ al parque. (ir)',
            'fuimos',
            '«Ayer» sitúa la acción en el pasado. En pretérito perfecto simple, «nosotros» se combina con «fuimos».',
        ],
        pitfall:
            '«Pasado» incluye varios tiempos. En esta herramienta se practica el pretérito perfecto simple, como «hablé», no todos los tiempos pasados.',
        faq: [
            [
                '¿Hay verbos irregulares?',
                'Sí: ser, tener e ir, junto con los regulares hablar, comer y vivir.',
            ],
            [
                '¿Qué variedad del español usa?',
                'Los modelos incluyen vosotros y vosotras. Otros países utilizan ustedes para esa función.',
            ],
        ],
        related: [
            'ortografia-para-ninos',
            'dictados-para-ninos',
            'comprension-lectora',
        ],
    },
    {
        slug: 'mapa-de-espana',
        label: 'Mapa de España',
        title: 'Mapa de España: comunidades y ciudades autónomas',
        description:
            'Explora el mapa de España y localiza sus 17 comunidades y 2 ciudades autónomas. Practica geografía gratis y consulta temas de Ciencias Sociales.',
        intro: 'Localiza las comunidades autónomas en un mapa y observa dónde están Ceuta y Melilla. Puedes explorar sus nombres o practicar identificando la región que se pide. Canarias aparece en un recuadro para facilitar la lectura.',
        group: 'Inglés y ciencias',
        icon: '🗺️',
        ages: '3º–6º de Primaria',
        subject: 'sociales',
        match: 'comunidades|mapas|paisajes|rios-de-espana',
        tool: 'map',
        steps: [
            'Empieza por tu comunidad y sus vecinas.',
            'Agrupa las regiones por zonas y utiliza la costa como referencia.',
            'Practica sin las etiquetas y revisa las regiones que confundas.',
        ],
        example: [
            '¿Ceuta y Melilla son comunidades autónomas?',
            'Son dos ciudades autónomas.',
            'España tiene 17 comunidades autónomas y dos ciudades autónomas; no hay que sumar las ciudades al número de comunidades.',
        ],
        pitfall:
            'Comunidad, provincia y municipio son divisiones distintas. Este mapa representa comunidades y ciudades autónomas, no las 50 provincias.',
        faq: [
            [
                '¿Por qué Canarias está en un recuadro?',
                'Es una representación desplazada para que se pueda ver con claridad junto a la península.',
            ],
            [
                '¿Se puede utilizar con teclado?',
                'Sí. Cada región se puede enfocar y seleccionar; también tienes una lista de botones con los mismos nombres.',
            ],
        ],
        related: [
            'fichas-para-imprimir',
            'retos-de-logica-para-ninos',
            'evaluacion-inicial',
        ],
    },
    {
        slug: 'separar-silabas',
        label: 'Separar sílabas',
        title: 'Separar sílabas: ejemplos y práctica para niños',
        description:
            'Aprende a separar sílabas con palabras revisadas, ejemplos de diptongos e hiatos y ejercicios gratis. Practica contando sílabas y leyendo por partes.',
        intro: 'Una sílaba es un grupo de sonidos pronunciado en un golpe de voz. Explora el banco de palabras revisadas y cuenta sus partes. La herramienta muestra ejemplos comprobados; los temas de Lengua amplían la lectura, los diptongos y la sílaba tónica.',
        group: 'Lengua y lectura',
        icon: '🔤',
        ages: '1º–4º de Primaria',
        subject: 'lengua',
        match: 'silaba|fonologica',
        tool: 'syllables',
        steps: [
            'Pronuncia la palabra completa y después más despacio.',
            'Comprueba que cada sílaba tiene una vocal o un grupo de vocales.',
            'Observa si las vocales juntas forman un diptongo o un hiato.',
        ],
        example: [
            '¿Cómo se separa «mariposa»?',
            'ma-ri-po-sa: cuatro sílabas.',
            'Cada parte contiene una vocal. La consonante entre vocales se une a la vocal siguiente.',
        ],
        pitfall:
            'Dos vocales juntas no siempre van en la misma sílaba: «aire» tiene diptongo, pero «país» contiene un hiato.',
        faq: [
            [
                '¿Separa cualquier palabra?',
                'Esta herramienta utiliza un banco de ejemplos revisados; no pretende resolver automáticamente todas las excepciones del español.',
            ],
            [
                '¿Cómo se separa «país»?',
                'pa-ís, dos sílabas. La vocal cerrada tónica con tilde rompe el diptongo.',
            ],
        ],
        related: [
            'dictados-para-ninos',
            'ortografia-para-ninos',
            'comprension-lectora',
        ],
    },
    {
        slug: 'fracciones-para-ninos',
        label: 'Fracciones',
        title: 'Fracciones para niños: dibujos y ejercicios',
        description:
            'Comprende las fracciones con un modelo visual gratis: numerador, denominador y partes iguales. Practica por curso e imprime fichas con soluciones.',
        intro: 'Una fracción puede representar partes iguales de una unidad. Cambia el denominador para dividir la barra y el numerador para colorear algunas partes. Después utiliza los temas del curso para comparar, hallar equivalencias y operar.',
        group: 'Matemáticas',
        icon: '🍕',
        ages: '2º–6º de Primaria',
        subject: 'mates',
        match: 'fracciones|racionales',
        tool: 'fractions',
        steps: [
            'Divide la unidad en partes del mismo tamaño.',
            'Cuenta todas las partes: ese número es el denominador.',
            'Cuenta las partes seleccionadas: ese número es el numerador.',
        ],
        example: [
            'Una barra tiene 8 partes iguales y coloreas 3. ¿Qué fracción es?',
            '3/8.',
            'El 8 indica en cuántas partes se divide la unidad y el 3 indica cuántas se seleccionan.',
        ],
        pitfall:
            'Para comparar dibujos de fracciones, las unidades deben tener el mismo tamaño y las partes deben ser iguales.',
        faq: [
            [
                '¿Qué representa el denominador?',
                'El número de partes iguales en que se divide la unidad.',
            ],
            [
                '¿Dónde practico equivalencias?',
                'En el tema de fracciones equivalentes de 4º; 1/2 y 2/4 representan la misma cantidad.',
            ],
        ],
        related: [
            'divisiones-para-ninos',
            'problemas-de-matematicas',
            'calculo-mental',
        ],
    },
    {
        slug: 'numeros-romanos',
        label: 'Números romanos',
        title: 'Números romanos: conversor y reglas para niños',
        description:
            'Convierte números del 1 al 3999 a números romanos y al revés. Aprende los símbolos, las reglas de suma y resta y practica con ejercicios gratis.',
        intro: 'Los números romanos combinan siete símbolos: I, V, X, L, C, D y M. El conversor permite comprobar una escritura del 1 al 3999 y detectar combinaciones que no siguen la forma convencional.',
        group: 'Matemáticas',
        icon: '🏛️',
        ages: '4º–6º de Primaria',
        subject: 'mates',
        match: 'romanos',
        tool: 'roman',
        steps: [
            'Aprende los valores de los siete símbolos.',
            'Suma los valores cuando aparecen de mayor a menor.',
            'Reconoce las parejas de resta: IV, IX, XL, XC, CD y CM.',
        ],
        example: [
            '¿Qué número es XLIV?',
            '44.',
            'XL representa 50 − 10 = 40; IV representa 5 − 1 = 4. En total, 44.',
        ],
        pitfall:
            'No todas las letras menores pueden restarse a cualquier letra mayor. 49 se escribe XLIX, no IL.',
        faq: [
            [
                '¿Hay un símbolo para el cero?',
                'El sistema romano convencional usado aquí no tiene un símbolo para el cero.',
            ],
            [
                '¿Por qué el conversor termina en 3999?',
                'Para números mayores se usan otras convenciones, como barras sobre los símbolos, que no incluye esta herramienta.',
            ],
        ],
        related: [
            'calculo-mental',
            'retos-de-logica-para-ninos',
            'matematicas-para-ninos',
        ],
    },
    {
        slug: 'tipos-de-angulos',
        label: 'Tipos de ángulos',
        title: 'Tipos de ángulos: grados y ejemplos visuales',
        description:
            'Explora ángulos agudos, rectos, obtusos, llanos, cóncavos y completos con un dibujo interactivo. Aprende sus medidas y practica geometría gratis.',
        intro: 'Un ángulo mide el giro entre dos semirrectas que comparten origen. Mueve el control para ver cómo cambia la abertura y observa cuándo pasa de agudo a recto, de obtuso a llano o de cóncavo a completo.',
        group: 'Matemáticas',
        icon: '📐',
        ages: '3º–6º de Primaria',
        subject: 'mates',
        match: 'angulos|figuras|area',
        tool: 'angles',
        steps: [
            'Localiza el vértice y los dos lados.',
            'Compara la abertura con un ángulo recto de 90°.',
            'Lee la medida y clasifica usando los límites exactos.',
        ],
        example: [
            '¿Cómo se clasifica un ángulo de 120°?',
            'Obtuso.',
            'Es mayor que 90° y menor que 180°. El ángulo recto mide exactamente 90°.',
        ],
        pitfall:
            'La longitud de los lados dibujados no determina el ángulo. Lo que se mide es la abertura o el giro.',
        faq: [
            [
                '¿Un ángulo de 180° es obtuso?',
                'No. Es un ángulo llano. Un obtuso es mayor que 90° y menor que 180°.',
            ],
            [
                '¿Qué es un ángulo cóncavo?',
                'Un ángulo mayor que 180° y menor que 360°; también se llama reflejo.',
            ],
        ],
        related: [
            'aprender-a-leer-el-reloj',
            'fracciones-para-ninos',
            'retos-matematicos-para-ninos',
        ],
    },
    {
        slug: 'retos-de-logica-para-ninos',
        label: 'Retos de lógica',
        title: 'Retos de lógica para niños con soluciones',
        description:
            'Resuelve retos de lógica gratis con series, patrones y pistas. Explica tu razonamiento, consulta soluciones y encuentra juegos educativos de Primaria.',
        intro: 'Los retos de lógica invitan a observar relaciones y probar una regla. Empieza por series y patrones, explica por qué una respuesta encaja y busca otra forma de comprobarla. También puedes abrir los juegos de lógica del catálogo.',
        group: 'Matemáticas',
        icon: '🧩',
        ages: '1º–6º de Primaria',
        subject: 'mates',
        match: 'series|algebra|probabilidad|coordenadas',
        steps: [
            'Describe qué cambia y qué se repite.',
            'Propón una regla y compruébala en cada paso.',
            'Explica la respuesta con palabras, un dibujo o una tabla.',
        ],
        example: [
            'En la serie 3, 6, 9, 12, ¿qué número sigue si añadimos siempre la misma cantidad?',
            '15.',
            'Cada paso añade 3: 12 + 3 = 15. La condición de sumar lo mismo hace explícita la regla del reto.',
        ],
        pitfall:
            'Una serie corta puede admitir varias reglas. Comprueba la condición del enunciado antes de afirmar que solo hay una respuesta.',
        faq: [
            [
                '¿Necesito saber calcular rápido?',
                'No. Puedes usar papel, dibujos o fichas para pensar.',
            ],
            [
                '¿Qué hago si no encuentro la regla?',
                'Compara dos pasos seguidos y anota qué cambia. Después prueba tu idea en toda la serie.',
            ],
        ],
        related: [
            'retos-matematicos-para-ninos',
            'matematicas-para-ninos',
            'numeros-romanos',
        ],
    },
    {
        slug: 'retos-matematicos-para-ninos',
        label: 'Retos matemáticos por curso',
        title: 'Retos matemáticos por curso, de 1º a 6º',
        description:
            'Retos matemáticos gratis por curso de Primaria con soluciones explicadas. Practica patrones, operaciones, fracciones y razonamiento en situaciones reales.',
        intro: 'Elige un reto acorde con los contenidos que conoces y piensa cómo justificarlo. En 1º puedes explorar series; en cursos posteriores, combinar operaciones, fracciones o porcentajes. La explicación importa tanto como el resultado.',
        group: 'Matemáticas',
        icon: '🎯',
        ages: '1º–6º de Primaria',
        subject: 'mates',
        steps: [
            'Lee las condiciones del reto y separa los datos.',
            'Prueba un caso sencillo o representa la situación.',
            'Comprueba todas las condiciones antes de dar la solución.',
        ],
        example: [
            'Pienso un número. Su doble más 4 es 18. ¿Cuál es?',
            '7.',
            'Quita 4 a 18: queda 14. La mitad es 7. Comprueba: 2 × 7 + 4 = 18.',
        ],
        pitfall:
            'Llegar al resultado por ensayo sirve para explorar. Después explica por qué cumple todas las condiciones.',
        faq: [
            [
                '¿Hay retos para todos los cursos?',
                'Sí. Los enlaces se organizan con los temas publicados de Matemáticas de 1º a 6º.',
            ],
            [
                '¿Puedo imprimirlos?',
                'Cada tema tiene una ficha imprimible con solucionario opcional.',
            ],
        ],
        related: [
            'retos-de-logica-para-ninos',
            'problemas-de-matematicas',
            'calculo-mental',
        ],
    },
    {
        slug: 'comprension-lectora',
        label: 'Comprensión lectora',
        title: 'Comprensión lectora: textos y preguntas por curso',
        description:
            'Practica comprensión lectora de Primaria con textos y preguntas gratis. Localiza información, explica tus respuestas y consulta soluciones por curso.',
        intro: 'Leer con comprensión significa relacionar lo que dice el texto con las preguntas. Los temas de Lengua incluyen lecturas y actividades: puedes volver al pasaje, buscar una pista y comprobar la explicación de cada respuesta.',
        group: 'Lengua y lectura',
        icon: '📖',
        ages: '1º–6º de Primaria',
        subject: 'lengua',
        match: 'comprension|lectura|texto|cuento|personajes|generos|quijote',
        steps: [
            'Lee para entender de qué trata el texto.',
            'Busca la parte que ayuda a responder cada pregunta.',
            'Distingue lo que el texto dice de lo que tú supones.',
        ],
        example: [
            '«A Leo se le rompió el paraguas y llegó con el abrigo mojado». ¿Qué dato aparece en el texto?',
            'El abrigo de Leo estaba mojado.',
            'Podemos inferir que estuvo expuesto al agua, pero no inventar dónde ocurrió ni cuánto tiempo llovió.',
        ],
        pitfall:
            'Leer deprisa no garantiza entender. Permite volver al texto y pide que señale la frase que sostiene su respuesta.',
        faq: [
            [
                '¿Puedo volver a leer?',
                'Sí. Volver al texto forma parte de la actividad de comprensión.',
            ],
            [
                '¿Hay fichas con las lecturas?',
                'Sí. Las fichas conservan el pasaje, sus preguntas y las soluciones explicadas.',
            ],
        ],
        related: [
            'dictados-para-ninos',
            'separar-silabas',
            'ortografia-para-ninos',
        ],
    },
    {
        slug: 'ingles-para-ninos',
        label: 'Inglés para niños',
        title: 'Inglés para niños: vocabulario y práctica por curso',
        description:
            'Actividades de inglés gratis de 1º a 6º de Primaria: colores, números, vocabulario y gramática. Practica con corrección y explicaciones por curso.',
        intro: 'Empieza con palabras de tu entorno y sigue con frases que puedas usar. Eduaroo organiza Inglés de 1º a 6º: vocabulario, preguntas, descripciones y estructuras gramaticales. Las actividades ofrecen corrección y lectura en voz alta cuando el dispositivo tiene una voz disponible.',
        group: 'Inglés y ciencias',
        icon: '🌍',
        ages: '1º–6º de Primaria',
        subject: 'ingles',
        steps: [
            'Elige un tema de tu curso.',
            'Relaciona las palabras con objetos y situaciones conocidas.',
            'Construye una frase breve y comprueba el significado.',
        ],
        example: [
            '¿Cómo dices «Tengo un gato»?',
            'I have a cat.',
            '«I» es el sujeto, «have» expresa tener y «a cat» significa un gato.',
        ],
        pitfall:
            'La traducción palabra por palabra puede cambiar el orden o el sentido de la frase. Observa el modelo completo.',
        faq: [
            [
                '¿Todo Eduaroo está traducido al inglés?',
                'Los 238 temas tienen versión inglesa. Lengua Castellana conserva los ejemplos en español que determinan las respuestas.',
            ],
            [
                '¿El contenido sigue un currículo británico?',
                'No. La versión inglesa conserva los cursos y contenidos del currículo español, con inglés británico en las instrucciones.',
            ],
        ],
        related: [
            'comprension-lectora',
            'fichas-para-imprimir',
            'evaluacion-inicial',
        ],
    },
    {
        slug: 'matematicas-para-ninos',
        label: 'Matemáticas por edades',
        title: 'Matemáticas para niños por edades y cursos',
        description:
            'Encuentra matemáticas gratis por edad y curso: números, sumas, tablas, divisiones, fracciones y geometría. Actividades de Primaria con explicación.',
        intro: 'Utiliza el curso como punto de partida y ajusta la elección a lo que el niño ya entiende. Eduaroo reúne números, operaciones, medidas, geometría, estadística y probabilidad. Las edades son orientativas: el aprendizaje no cambia de golpe al cumplir años.',
        group: 'Matemáticas',
        icon: '🔢',
        ages: '5–12 años',
        subject: 'mates',
        steps: [
            'Elige el curso o una habilidad concreta.',
            'Empieza con una actividad conocida para observar el punto de partida.',
            'Avanza cuando puedas explicar la respuesta, y vuelve atrás cuando haga falta.',
        ],
        example: [
            '¿Qué suele practicar un niño de 8 años en Eduaroo?',
            'Los temas de Matemáticas de 3º, como tablas, reparto y fracciones.',
            'La edad ayuda a orientarse, pero el curso real y lo trabajado en clase son las referencias para elegir.',
        ],
        pitfall:
            'Una lista por edades es una orientación, no una exigencia de que todos dominen lo mismo el mismo día.',
        faq: [
            [
                '¿Hay actividades antes de Primaria?',
                'El juego de 5 años ofrece un pequeño inicio de conteo y formas. El catálogo curricular completo va de 1º a 6º.',
            ],
            [
                '¿Qué hago si el curso resulta difícil?',
                'Prueba un tema previo que sirva de apoyo y revisa la idea clave antes de responder.',
            ],
        ],
        related: [
            'sumas-y-restas',
            'tablas-de-multiplicar',
            'fracciones-para-ninos',
        ],
    },
    ...[
        {
            age: 6,
            grade: '1',
            focus: 'conteo, sumas sencillas, sonidos y primeras palabras',
            example: [
                'Junta 4 fichas y otras 3. ¿Cuántas tienes?',
                '7 fichas.',
                'Cuenta los dos grupos y vuelve a contar el total.',
            ],
            plan: [
                'Cuenta objetos de casa y compara cantidades.',
                'Lee sílabas y palabras conocidas con ayuda.',
                'Alterna una actividad breve con un juego sin pantalla.',
            ],
        },
        {
            age: 7,
            grade: '2',
            focus: 'sumas con llevadas, lectura breve y tablas del 2, 5 y 10',
            example: [
                'Tienes 28 cromos y consigues 15 más. ¿Cuántos son?',
                '43 cromos.',
                '28 + 10 = 38; 38 + 5 = 43.',
            ],
            plan: [
                'Repasa unidades y decenas antes de las llevadas.',
                'Lee un texto breve y busca una respuesta en él.',
                'Construye grupos iguales para iniciar la multiplicación.',
            ],
        },
        {
            age: 8,
            grade: '3',
            focus: 'tablas completas, división, fracciones y descripción de textos',
            example: [
                'Reparte 24 fichas en 6 grupos iguales.',
                '4 fichas por grupo.',
                '6 × 4 = 24, por eso 24 ÷ 6 = 4.',
            ],
            plan: [
                'Relaciona cada división con una tabla.',
                'Representa las fracciones con partes iguales.',
                'Explica el resultado de un problema con una frase.',
            ],
        },
        {
            age: 9,
            grade: '4',
            focus: 'división por dos cifras, equivalencias y ortografía',
            example: [
                '¿Representan lo mismo 1/2 y 2/4?',
                'Sí.',
                'Dos cuartos cubren la misma parte de una unidad que un medio.',
            ],
            plan: [
                'Comprueba las divisiones mediante la multiplicación.',
                'Compara fracciones con dibujos de la misma unidad.',
                'Revisa tildes y letras dentro de frases completas.',
            ],
        },
    ].map(
        ({ age, grade, focus, example, plan }): ResourceGuide => ({
            slug: `actividades-para-ninos-de-${age}-anos`,
            label: `Actividades ${age} años`,
            title: `Actividades para niños de ${age} años (${grade}º de Primaria)`,
            description: `Actividades gratis para niños de ${age} años: matemáticas, lengua, inglés y ciencias de ${grade}º de Primaria. Practica con explicaciones e imprime fichas.`,
            intro: `A los ${age} años, ${grade}º de Primaria suele servir como referencia para elegir actividades. En este curso Eduaroo trabaja ${focus}. Aquí tienes los temas reales del catálogo, con ideas clave, corrección y una versión para papel. Ajusta la selección al curso que realiza el niño.`,
            group: 'Por edades',
            icon: ['🌱', '🌿', '🚀', '⭐'][age - 6],
            ages: `${age}–${age + 1} años · ${grade}º`,
            grades: [grade],
            steps: plan,
            example: example as [string, string, string],
            pitfall:
                'El curso asociado a la edad es orientativo. Si un tema aún no se ha trabajado en clase, elige otro o utiliza contenidos de apoyo del curso anterior.',
            faq: [
                [
                    `¿Todas las actividades son para ${age} años?`,
                    `La selección utiliza ${grade}º de Primaria como referencia y reúne sus cinco asignaturas. El nivel se adapta escogiendo el tema.`,
                ],
                [
                    '¿Cómo organizo el repaso?',
                    'Elige un objetivo concreto, alterna actividades y termina al notar cansancio. Puedes combinar papel y pantalla.',
                ],
            ],
            related: [
                'fichas-para-imprimir',
                'matematicas-para-ninos',
                'comprension-lectora',
            ],
        }),
    ),
    {
        slug: 'juegos-para-ninos-de-5-anos',
        label: 'Juegos para 5 años',
        title: 'Juegos para niños de 5 años: contar y formas',
        description:
            'Juegos gratis para niños de 5 años: cuenta objetos y reconoce formas con ayuda de una persona adulta. Actividades sencillas sin registro ni descargas.',
        intro: 'Cuenta los objetos del dibujo, reconoce formas y conversa sobre lo que ves. Este pequeño juego sirve como inicio acompañado; el catálogo completo de Eduaroo empieza en Primaria. Puedes continuar contando juguetes o buscando formas en casa.',
        group: 'Por edades',
        icon: '🐣',
        ages: '5 años · acompañado',
        tool: 'preschool',
        grades: ['1'],
        subject: 'mates',
        match: 'numeros|figuras|series',
        steps: [
            'Lee la consigna con una persona adulta.',
            'Señala y cuenta cada objeto una sola vez.',
            'Busca después una cantidad o forma parecida fuera de la pantalla.',
        ],
        example: [
            'Ves tres estrellas y aparece una más. ¿Cuántas hay?',
            'Cuatro.',
            'Cuenta las estrellas señalando cada una y compara el grupo antes y después.',
        ],
        pitfall:
            'No hace falta anticipar las operaciones de Primaria. El juego puede quedarse en observar, contar y nombrar.',
        faq: [
            [
                '¿Necesita saber leer?',
                'La persona adulta puede leer la consigna; las cantidades se muestran con dibujos.',
            ],
            [
                '¿Es un programa completo de Infantil?',
                'No. Es una actividad inicial de conteo y formas; Eduaroo se centra en el repaso de Primaria.',
            ],
        ],
        related: [
            'actividades-para-ninos-de-6-anos',
            'generador-de-caligrafia',
            'matematicas-para-ninos',
        ],
    },
    {
        slug: 'cuaderno-verano',
        label: 'Cuaderno de verano',
        title: 'Cuaderno de verano gratis por curso para imprimir',
        description:
            'Prepara un cuaderno de verano gratis de 1º a 6º de Primaria. Elige tu curso, combina matemáticas y lengua e imprime actividades con soluciones.',
        intro: 'Prepara un cuaderno con actividades del curso que acaba de terminar. El generador selecciona Matemáticas y Lengua del catálogo revisado, conserva las ideas clave y permite incluir el solucionario. Puedes imprimir solo lo que vayas a utilizar.',
        group: 'Organización y fichas',
        icon: '☀️',
        ages: '1º–6º de Primaria',
        tool: 'summer',
        steps: [
            'Selecciona el curso terminado y revisa los cuatro temas incluidos.',
            'Revisa el cuaderno y decide si imprimes el solucionario.',
            'Alterna las hojas con lectura, juegos y actividades al aire libre.',
        ],
        example: [
            'He terminado 2º. ¿Qué cuaderno preparo?',
            'Elige 2º y una selección de Matemáticas y Lengua.',
            'Repasar el curso completado ayuda a reutilizar contenidos conocidos sin adelantar automáticamente el siguiente.',
        ],
        pitfall:
            'No prometemos un número fijo de páginas: depende de los temas, las lecturas y las opciones que elijas.',
        faq: [
            [
                '¿Tiene algún coste?',
                'No. La selección y la impresión son gratuitas, sin correo ni tarjeta.',
            ],
            [
                '¿Cómo descargo el PDF?',
                'Pulsa imprimir y selecciona «Guardar como PDF» en el navegador.',
            ],
        ],
        related: [
            'repaso-verano',
            'fichas-para-imprimir',
            'horario-escolar-imprimible',
        ],
    },
    {
        slug: 'repaso-verano',
        label: 'Repaso de verano',
        title: 'Repaso de verano de Primaria: plan por curso',
        description:
            'Organiza el repaso de verano de 1º a 6º de Primaria con actividades gratis. Sigue un plan flexible de cuatro semanas y combina lectura, juegos y fichas.',
        intro: 'Elige el curso terminado y utiliza un plan flexible de cuatro semanas. Cada semana combina un tema de Matemáticas, una lectura o actividad de Lengua y una propuesta sin pantalla. Repite lo que necesites y deja espacio para descansar.',
        group: 'Organización y fichas',
        icon: '🏖️',
        ages: '1º–6º de Primaria',
        steps: [
            'Semana 1: números y lectura de un texto conocido.',
            'Semana 2: operaciones y escritura de frases. Semana 3: medidas o geometría y vocabulario.',
            'Semana 4: un reto, un texto nuevo y revisión de lo que quieras volver a practicar.',
        ],
        example: [
            '¿Cómo combino papel y pantalla?',
            'Practica un tema online y prepara su ficha para otro día.',
            'La actividad digital ofrece feedback inmediato; la hoja permite explicar y dibujar el razonamiento.',
        ],
        pitfall:
            'El plan es una propuesta flexible. Si una semana no encaja, cambia el orden y el número de sesiones.',
        faq: [
            [
                '¿Qué curso debo seleccionar?',
                'El que se acaba de terminar, para repasar lo ya trabajado.',
            ],
            [
                '¿Puedo hacer un cuaderno?',
                'Sí. El generador del cuaderno de verano reúne una selección imprimible con soluciones opcionales.',
            ],
        ],
        related: ['cuaderno-verano', 'evaluacion-inicial', 'vuelta-al-cole'],
    },
];

export const getResourceGuide = (slug: string) =>
    resourceGuides.find((guide) => guide.slug === slug);
export const isSpanishResourcePath = (path: string) =>
    path === '/recursos' ||
    path.startsWith('/comparar') ||
    path.startsWith('/fichas-para-imprimir/') ||
    resourceGuides.some((guide) => path === `/${guide.slug}`);
