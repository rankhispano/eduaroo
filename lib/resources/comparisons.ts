export interface PlatformComparison {
    slug: string;
    name: string;
    icon: string;
    title: string;
    description: string;
    intro: string;
    verdict: string;
    rows: [string, string, string][];
    strengths: string[];
    chooseEduaroo: string[];
    chooseOther: string[];
    sections: { heading: string; text: string; source?: number }[];
    sources: { label: string; url: string }[];
    faq: [string, string][];
}
export const comparisons: PlatformComparison[] = [
    {
        slug: 'eduaroo-vs-smartick',
        name: 'Smartick',
        icon: '🧮',
        title: 'Eduaroo vs Smartick: repaso o método adaptativo',
        description:
            'Compara Eduaroo y Smartick: precio, edades, asignaturas y método. Repaso gratuito por curso frente a sesiones adaptativas, con fuentes oficiales.',
        intro: 'Eduaroo permite elegir un tema del colegio y practicar gratis. Smartick propone una rutina que ajusta la dificultad automáticamente. La elección depende de si buscas repaso libre por curso o una secuencia personalizada.',
        verdict:
            'Eduaroo encaja para reforzar temas concretos de 1º a 6º, combinar cinco asignaturas y preparar fichas sin suscripción. Smartick puede encajar si buscas sesiones adaptativas y seguimiento dentro de un servicio de pago.',
        rows: [
            [
                'Precio',
                'Gratis, sin tarjeta ni registro para practicar',
                'Suscripción; consulta la tarifa de tu región y programa',
            ],
            [
                'Etapa',
                '1º–6º de Primaria; edades orientativas de 6–12 años',
                '4–14 años en el programa de Matemáticas',
            ],
            [
                'Método',
                'Temas por curso, ideas clave y explicación tras responder',
                'Sesiones de 15 minutos con dificultad adaptada mediante IA',
            ],
            [
                'Materias',
                'Matemáticas, Lengua, Inglés, Naturales y Sociales',
                'Programas de Matemáticas, Lectura, Coding y Thinking',
            ],
            [
                'Progreso',
                'Guardado en este navegador; repaso de errores',
                'Seguimiento dentro de su servicio',
            ],
            [
                'Fichas',
                'Catálogo imprimible con solucionario opcional',
                'Revisa las opciones de tu programa',
            ],
        ],
        strengths: [
            'Dificultad adaptativa',
            'Rutina de sesiones cortas',
            'Varios programas especializados',
        ],
        chooseEduaroo: [
            'Quieres repasar el tema concreto que se está dando en clase.',
            'Buscas recursos de cinco asignaturas sin suscripción.',
            'Quieres alternar actividades online y fichas impresas.',
        ],
        chooseOther: [
            'Prefieres que el servicio seleccione y ajuste la dificultad.',
            'Buscas una rutina diaria estructurada.',
            'Te encaja el coste del programa elegido.',
        ],
        sections: [
            {
                heading: 'Repasar lo del colegio',
                text: 'En Eduaroo el curso y el tema determinan el contenido. Puedes leer la microlección, practicar y repetir los errores. La revisión reciente cubre los 238 temas y sus 2.351 actividades; es una revisión editorial documentada, sin atribuirle una certificación docente.',
            },
            {
                heading: 'Dificultad y rutina',
                text: 'Smartick describe un nivel que cambia en tiempo real y sesiones de 15 minutos. Eduaroo permite escoger el tema y repetirlo, pero no calcula un itinerario adaptativo equivalente.',
                source: 0,
            },
            {
                heading: 'Precio y condiciones',
                text: 'La tarifa de Smartick cambia con el país, la duración y el número de programas. Evitamos convertir una cuota mensual aislada en un supuesto ahorro anual. Consulta su página de planes para comparar tu caso.',
                source: 1,
            },
            {
                heading: 'Qué progreso puedes consultar',
                text: 'El progreso de Eduaroo se guarda en el navegador que utilizas. Los paneles de familias y docentes del proyecto son demostraciones; no ofrecemos informes familiares sincronizados como parte de esta comparativa.',
            },
        ],
        sources: [
            {
                label: 'Smartick: método y programas',
                url: 'https://www.smartick.es/',
            },
            {
                label: 'Smartick: planes y precios',
                url: 'https://www.smartick.es/plans-pricing.html',
            },
        ],
        faq: [
            [
                '¿Eduaroo sustituye al método de Smartick?',
                'Ofrece práctica por temas y repaso de errores. No ofrece el mismo ajuste automático de dificultad.',
            ],
            [
                '¿Cuánto cuesta Eduaroo?',
                'Las actividades, herramientas y fichas de esta web son gratuitas y se utilizan sin tarjeta.',
            ],
        ],
    },
    {
        slug: 'eduaroo-vs-khan-academy',
        name: 'Khan Academy Kids',
        icon: '🐻',
        title: 'Eduaroo vs Khan Academy Kids: edades y currículo',
        description:
            'Eduaroo y Khan Academy Kids: compara edades, currículo, idiomas y actividades gratuitas. Fuentes oficiales para elegir recursos según tu familia.',
        intro: 'Las dos propuestas permiten practicar gratis. Eduaroo se centra en el currículo español de Primaria; Khan Academy Kids está dirigido al aprendizaje inicial y combina juegos, libros y actividades creativas.',
        verdict:
            'Para repasar contenidos de 1º a 6º del colegio en España, Eduaroo ofrece un acceso directo por curso y asignatura. Para primeros aprendizajes de 2 a 8 años, Khan Academy Kids tiene una propuesta más amplia de educación temprana.',
        rows: [
            [
                'Precio',
                'Gratis para practicar e imprimir',
                'App familiar gratuita; la oferta para centros tiene condiciones propias',
            ],
            [
                'Edad y etapa',
                '1º–6º de Primaria; orientación de 6–12 años',
                '2–8 años',
            ],
            [
                'Currículo',
                'Contenidos vinculados al currículo español LOMLOE',
                'Head Start y Common Core',
            ],
            [
                'Contenido',
                'Cinco asignaturas, ideas clave, ejercicios y fichas',
                'Lectura, lenguaje, matemáticas, creatividad y desarrollo socioemocional',
            ],
            [
                'Idioma',
                'Español y versiones inglesas de los 238 temas',
                'La propuesta consultada presenta aprendizaje en inglés',
            ],
            [
                'Acceso',
                'Web en el navegador, sin registro para practicar',
                'Aplicación móvil',
            ],
        ],
        strengths: [
            'Enfoque en educación temprana',
            'Juegos, libros y actividades creativas',
            'App familiar sin anuncios ni suscripción',
        ],
        chooseEduaroo: [
            'Tu objetivo es repasar un curso de Primaria en España.',
            'Quieres trabajar Lengua Castellana y Ciencias Sociales del catálogo español.',
            'Prefieres abrir una actividad o imprimir una ficha desde el navegador.',
        ],
        chooseOther: [
            'Buscas primeros aprendizajes para un niño menor de 6 años.',
            'Te interesa aprender con contenido en inglés.',
            'Quieres una aplicación pensada para educación temprana.',
        ],
        sections: [
            {
                heading: 'Dos etapas distintas',
                text: 'Khan Academy Kids se presenta para 2–8 años. Eduaroo concentra su catálogo completo en Primaria: el juego de 5 años es una actividad introductoria, no un programa equivalente de Infantil.',
                source: 0,
            },
            {
                heading: 'El currículo importa',
                text: 'Khan Academy Kids cita Head Start y Common Core. Eduaroo conserva la organización y los referentes LOMLOE del currículo español, incluso cuando se cambia a las instrucciones en inglés.',
                source: 0,
            },
            {
                heading: 'Gratis para familias y oferta escolar',
                text: 'La app familiar de Khan Academy Kids es gratuita. Su oferta para centros se presenta por separado. En Eduaroo el catálogo de actividades se abre directamente, y los paneles de docentes y familias siguen siendo vistas de demostración.',
                source: 0,
            },
            {
                heading: 'Aprender inglés o aprender en inglés',
                text: 'Eduaroo incluye Inglés como asignatura y también tiene versiones inglesas de los temas de las demás materias. En Lengua Castellana se mantienen en español las palabras y pasajes cuyo idioma determina la solución.',
            },
        ],
        sources: [
            {
                label: 'Khan Academy Kids: edades, currículo y condiciones',
                url: 'https://www.khanacademy.org/kids',
            },
        ],
        faq: [
            [
                '¿Khan Academy Kids es lo mismo que Khan Academy?',
                'No. Esta comparativa trata la aplicación Kids. El catálogo general de Khan Academy tiene otro alcance y otras etapas.',
            ],
            [
                '¿La versión inglesa de Eduaroo cambia el currículo?',
                'No. Mantiene el currículo español y sus contextos; traduce las instrucciones y explicaciones.',
            ],
        ],
    },
    {
        slug: 'eduaroo-vs-abcmouse',
        name: 'ABCmouse',
        icon: '🐭',
        title: 'Eduaroo vs ABCmouse: alternativa para Primaria',
        description:
            'Compara Eduaroo y ABCmouse: Primaria en español, aprendizaje temprano, plan gratuito y suscripción. Consulta diferencias y fuentes oficiales.',
        intro: 'ABCmouse ofrece aprendizaje temprano con un recorrido guiado y varios formatos. Eduaroo permite repasar Primaria por curso, con contenidos en español, versiones inglesas y fichas gratuitas.',
        verdict:
            'Eduaroo puede servir si buscas repaso del currículo español durante toda la Primaria. ABCmouse puede servir para aprendizaje temprano en inglés, especialmente si buscas una biblioteca de libros, canciones y vídeos.',
        rows: [
            [
                'Edad y etapa',
                '1º–6º de Primaria; orientación de 6–12 años',
                '2–8 años',
            ],
            [
                'Precio',
                'Gratis, sin tarjeta para practicar',
                'Basic gratuito limitado y Premium de pago',
            ],
            [
                'Contenido',
                'Matemáticas, Lengua, Inglés, Naturales y Sociales',
                'Lectura, matemáticas, ciencias y otras áreas de aprendizaje temprano',
            ],
            [
                'Currículo',
                'Referencia al currículo español LOMLOE',
                'Recorrido desde toddler hasta 2nd grade; no se declara LOMLOE en la fuente consultada',
            ],
            [
                'Idioma',
                'Español; 238 temas con versión inglesa',
                'La oferta y los ejemplos consultados se presentan en inglés',
            ],
            [
                'Papel',
                'Fichas de los temas con solucionario',
                'Su catálogo también incluye imprimibles',
            ],
        ],
        strengths: [
            'Varios formatos de aprendizaje',
            'Recorrido para educación temprana',
            'Un plan Basic que permite probar parte del contenido',
        ],
        chooseEduaroo: [
            'Quieres reforzar materias del colegio en español.',
            'Buscas contenidos de 3º a 6º de Primaria.',
            'Quieres acceso gratuito al catálogo y a las fichas por tema.',
        ],
        chooseOther: [
            'Tu hijo está en la etapa de 2–8 años.',
            'Buscas una propuesta de aprendizaje temprano en inglés.',
            'Quieres valorar un catálogo con libros, canciones y vídeos.',
        ],
        sections: [
            {
                heading: 'El alcance por edades',
                text: 'ABCmouse describe un currículo de 2–8 años. Eduaroo mantiene temas de 1º a 6º de Primaria, de modo que puede seguir utilizándose cuando se avanza a los cursos superiores.',
                source: 0,
            },
            {
                heading: 'El plan gratuito también cuenta',
                text: 'ABCmouse anuncia Basic gratuito con acceso limitado y Premium con acceso más amplio. Por eso no describimos toda la plataforma como exclusivamente de pago. Comprueba la oferta y su disponibilidad en tu país.',
                source: 1,
            },
            {
                heading: 'Contenido en español',
                text: 'El objetivo de Eduaroo es practicar los contenidos del colegio en España. Los ejemplos de Lengua Castellana se conservan en español, y la versión inglesa del catálogo permite trabajar las mismas materias con instrucciones traducidas.',
            },
            {
                heading: 'Qué no hemos probado',
                text: 'La revisión utiliza la información pública del proveedor y las funciones de este proyecto. No hemos probado una cuenta Premium de ABCmouse ni evaluado resultados educativos de las dos plataformas.',
            },
        ],
        sources: [
            {
                label: 'ABCmouse: currículo y edades',
                url: 'https://www.abcmouse.com/learn/',
            },
            {
                label: 'ABCmouse: planes Basic y Premium',
                url: 'https://www.abcmouse.com/learn/program/preschool-reading-learning-program',
            },
        ],
        faq: [
            [
                '¿ABCmouse tiene una versión gratuita?',
                'Su página anuncia un plan Basic con acceso limitado y un plan Premium de pago. Revisa las condiciones vigentes de tu región.',
            ],
            [
                '¿ABCmouse ofrece un currículo LOMLOE?',
                'La página de currículo que consultamos no lo declara. Eduaroo utiliza los referentes del currículo español de Primaria.',
            ],
        ],
    },
];
export const getComparison = (slug: string) =>
    comparisons.find((item) => item.slug === slug);
