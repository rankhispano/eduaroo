<?php
/**
 * ==============================================================================
 * ENRIQUECEDOR DE PREGUNTAS CURRICULARES CON IA - EDUAROO
 * Adaptado de traficotest_enrich.php para el currículo educativo (LOMLOE)
 * ==============================================================================
 *
 * Modelo predeterminado: gemini-2.5-flash / gemini-3.8-flash
 * Plataforma: Google AI Studio / Google Cloud Vertex AI
 *
 * Uso:
 *   php scripts/eduaroo_enrich.php --subject math --limit 5
 *   php scripts/eduaroo_enrich.php -s ciencias -l 10
 *   php scripts/eduaroo_enrich.php -s ortografia -l 5
 *   php scripts/eduaroo_enrich.php -s ingles -l 5
 *   php scripts/eduaroo_enrich.php --list
 *   php scripts/eduaroo_enrich.php --help
 */

declare(strict_types=1);

mb_internal_encoding('UTF-8');

// -----------------------------------------------------------------------------
// MAPA DE ASIGNATURAS, ARCHIVOS SQL Y TEMARIOS LOMLOE
// -----------------------------------------------------------------------------

$SUBJECTS = [
    'math' => [
        'code' => 'math',
        'name' => 'Matemáticas (Primaria y ESO)',
        'slug' => 'matematicas',
        'isBilingual' => true, // Español + Inglés (CLIL)
        'languageOnly' => false,
        'files' => [
            'Math+Grade+1_+6+Year+Olds_1.0.55_APKPure.sql' => ['grade' => 1, 'cycle' => 1],
            'Math+Games+for+2nd+Grade_+7yo_1.0.74_APKPure.sql' => ['grade' => 2, 'cycle' => 1],
            'Math+Games+for+Kids_+Grade+3_1.0.57_APKPure.sql' => ['grade' => 3, 'cycle' => 2],
            'Math+for+9-Year-Olds_1.0.56_APKPure.sql' => ['grade' => 4, 'cycle' => 2],
            'Math+Games_+5th+Grade+Math_1.0.55_APKPure.sql' => ['grade' => 5, 'cycle' => 3],
            'Math+Games+6th+Grade+11+Years_1.0.60_APKPure.sql' => ['grade' => 6, 'cycle' => 3],
            'Math+Games_+7th+Grade+-+12+yo_1.0.57_APKPure.sql' => ['grade' => 7, 'cycle' => 4], // 1º ESO
            'Math+Games_+8th+Grade+&+13yo_1.0.53_APKPure.sql' => ['grade' => 8, 'cycle' => 4], // 2º ESO
        ],
        'temario' => [
            "Sentido numérico y valor posicional",
            "Operaciones básicas y cálculo mental",
            "Resolución de problemas de la vida cotidiana",
            "Fracciones y números decimales",
            "Potencias y números enteros",
            "Proporcionalidad y porcentajes",
            "Geometría y figuras planas",
            "Cuerpos geométricos y visión espacial",
            "Medida: longitud, masa, capacidad, tiempo y dinero",
            "Perímetros, áreas y volúmenes",
            "Estadística, gráficos y probabilidad"
        ]
    ],
    'ciencias' => [
        'code' => 'ciencias',
        'name' => 'Ciencias de la Naturaleza y Sociedad (Conocimiento del Medio)',
        'slug' => 'ciencias',
        'isBilingual' => true, // Español + Inglés (CLIL Science)
        'languageOnly' => false,
        'files' => [
            'Elementary+Games+in+Spanish_1.0.56_APKPure.sql' => ['grade' => 3, 'cycle' => 2],
            'Spanish+Trivia_+Learn+&+Play_1.0.89_APKPure.sql' => ['grade' => 5, 'cycle' => 3],
        ],
        'temario' => [
            "El cuerpo humano: órganos, aparatos y salud",
            "Los seres vivos: reino animal y vegetal",
            "Ecosistemas, biodiversidad y medio ambiente",
            "Materia, energía, calor y luz",
            "Fuerzas, máquinas y avances tecnológicos",
            "El planeta Tierra, el relieve y el universo",
            "Geografía física y política de España y Europa",
            "Historia: Prehistoria, Edad Antigua, Media y Moderna",
            "Sociedad, medios de comunicación y convivencia"
        ]
    ],
    'lengua' => [
        'code' => 'lengua',
        'name' => 'Lengua Castellana y Literatura',
        'slug' => 'lengua',
        'isBilingual' => false, // Específico de idioma español
        'languageOnly' => true,
        'files' => [
            'Spanish+for+Kids_+Age+6_1.0.36_APKPure.sql' => ['grade' => 1, 'cycle' => 1],
            'Spanish+for+Kids_+7+Years_1.0.66_APKPure.sql' => ['grade' => 2, 'cycle' => 1],
            'Learn+Spanish_+4th+Grade+Kids_1.0.54_APKPure.sql' => ['grade' => 4, 'cycle' => 2],
            'Spanish+Language_+Age+10_1.0.60_APKPure.sql' => ['grade' => 5, 'cycle' => 3],
            'Spanish+6th+Grade+Learn+&+Play_1.0.53_APKPure.sql' => ['grade' => 6, 'cycle' => 3],
            'Spanish+Language+Grade+7_1.0.53_APKPure.sql' => ['grade' => 7, 'cycle' => 4], // 1º ESO
            'Spanish+Grammar+13+yrs_1.0.54_APKPure.sql' => ['grade' => 8, 'cycle' => 4], // 2º ESO
            'Learn+Spanish_+Speak+&+Play_1.0.31_APKPure.sql' => ['grade' => 3, 'cycle' => 2],
        ],
        'temario' => [
            "Vocabulario, sinónimos, antónimos y campos semánticos",
            "Clases de palabras: sustantivos, adjetivos, artículos y pronombres",
            "El verbo: tiempos verbales, conjugación y personas",
            "Adverbios, preposiciones y conjunciones",
            "Estructura de la oración: sujeto y predicado",
            "Comprensión lectora y tipos de texto",
            "Literatura, figuras retóricas, poesía y narrativa"
        ]
    ],
    'ortografia' => [
        'code' => 'ortografia',
        'name' => 'Laboratorio de Ortografía RAE',
        'slug' => 'ortografia',
        'isBilingual' => false, // Específico de idioma español
        'languageOnly' => true,
        'files' => [
            'El+gran+juego+de+Ortografía_1.0.40_APKPure.sql' => ['grade' => 4, 'cycle' => 2],
        ],
        'temario' => [
            "Reglas de uso de B y V",
            "Reglas de uso de C, Z, Q y K",
            "Reglas de uso de G y J",
            "Reglas de uso de la letra H",
            "Reglas de uso de Y y LL",
            "Reglas de uso de R y RR",
            "Reglas de acentuación: palabras agudas, llanas y esdrújulas",
            "Diptongos, triptongos e hiatos",
            "Tilde diacrítica en monosílabos e interrogativos",
            "Uso de mayúsculas y minúsculas",
            "Signos de puntuación: punto, coma, dos puntos e interrogación",
            "Palabras homófonas y parónimas dudosas"
        ]
    ],
    'ingles' => [
        'code' => 'ingles',
        'name' => 'Lengua Extranjera: Inglés',
        'slug' => 'ingles',
        'isBilingual' => false, // Idioma objeto de estudio
        'languageOnly' => true,
        'files' => [
            'English+3rd+Grade_+Age+8_24.0_APKPure.sql' => ['grade' => 3, 'cycle' => 2],
            'Learn+English+9+years+old_24.0_APKPure.sql' => ['grade' => 4, 'cycle' => 2],
            'English+Vocabulary_+5th+Grade_13.0_APKPure.sql' => ['grade' => 5, 'cycle' => 3],
            'Learn+English+11+years_12.0_APKPure.sql' => ['grade' => 6, 'cycle' => 3],
            'Learn+English+12+years_18.0_APKPure.sql' => ['grade' => 7, 'cycle' => 4],
            'Learn+English+13+years_14.0_APKPure.sql' => ['grade' => 8, 'cycle' => 4],
            'Learn+English_+Word+Games_1.0.59_APKPure.sql' => ['grade' => 5, 'cycle' => 3],
            'English_+Exercises+&+Tests_1.0.39_APKPure.sql' => ['grade' => 6, 'cycle' => 3], // Descartamos duplicado
        ],
        'temario' => [
            "Vocabulary: Everyday life, family, school & nature",
            "Present Simple & Present Continuous",
            "Past Simple: Regular & Irregular verbs",
            "Future tenses: Will & Going to",
            "Prepositions of place, time and movement",
            "Pronouns, possessives and determiners",
            "Adjectives, comparative and superlative forms",
            "Modal verbs: Can, must, should, would",
            "Sentence structure, questions and negatives",
            "Reading comprehension and conversational phrases"
        ]
    ],
    'portugues' => [
        'code' => 'portugues',
        'name' => 'Segunda Lengua Extranjera: Portugués',
        'slug' => 'portugues',
        'isBilingual' => false,
        'languageOnly' => true,
        'files' => [
            'Learn+Portuguese+with+Games_1.0.26_APKPure.sql' => ['grade' => 5, 'cycle' => 3],
        ],
        'temario' => [
            "Vocabulário básico e expressões cotidianas",
            "Artigos, substantivos e adjetivos",
            "Verbos fundamentais e conjugação no presente",
            "Pronomes e preposições essenciais"
        ]
    ]
];

$testDir = realpath(__DIR__ . '/../test');
if (!$testDir || !is_dir($testDir)) {
    $testDir = __DIR__ . '/../test';
}

$dataDir = realpath(__DIR__ . '/../data');
if (!$dataDir || !is_dir($dataDir)) {
    $dataDir = __DIR__ . '/../data';
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0777, true);
    }
}

// -----------------------------------------------------------------------------
// FUNCIONES AUXILIARES
// -----------------------------------------------------------------------------

function imprimirAyuda(): void {
    echo <<<HELP

==============================================================================
  ENRIQUECEDOR DE PREGUNTAS EDUAROO CON IA (GEMINI) - LOMLOE
==============================================================================

Uso:
  php scripts/eduaroo_enrich.php [opciones]

Opciones:
  -s, --subject <código>   Asignatura a procesar (math, ciencias, lengua, ortografia, ingles, portugues). [Defecto: math]
  -g, --grade <curso>      Filtra por curso escolar específico (1 a 8)
  -l, --limit <n>          Límite de preguntas a procesar en esta tanda
  --id <id_pregunta>       Procesa únicamente la pregunta con el ID indicado
  -o, --output <archivo>   Archivo JSON de salida (por defecto: data/<subject>/questions-enriched.json)
  -f, --force              Fuerza el reprocesamiento de preguntas que ya estén en el archivo de salida
  -d, --delay <segundos>   Tiempo de espera entre llamadas en segundos [Defecto: 15]
  -m, --model <nombre>     Modelo Gemini a utilizar [Defecto: gemini-3.8-flash (fallback: 3.7, 3.6, 3.5)]
  --api-key <clave>        Clave API de Gemini (o variable GEMINI_API_KEY)
  --aistudio               Utilizar endpoint directo de Google AI Studio [Defecto: true]
  --list                   Muestra estadísticas completas de preguntas disponibles por asignatura
  -h, --help               Muestra esta ayuda

Ejemplos:
  php scripts/eduaroo_enrich.php --subject math --limit 5
  php scripts/eduaroo_enrich.php -s ciencias -l 10
  php scripts/eduaroo_enrich.php -s ortografia -l 5
  php scripts/eduaroo_enrich.php -s ingles --grade 4 -l 5
  php scripts/eduaroo_enrich.php --list

HELP;
}

function resolverAsignatura(string $input, array $subjects): string {
    $clean = strtolower(trim($input));
    if (isset($subjects[$clean])) return $clean;
    foreach ($subjects as $code => $info) {
        if (strcasecmp($clean, $info['slug']) === 0 || strcasecmp($clean, $code) === 0) {
            return $code;
        }
    }
    return 'math';
}

function limpiarTextoHtml(string $text): string {
    $text = preg_replace('/<br\s*\/?>/i', "\n", $text);
    $text = strip_tags($text);
    return trim($text);
}

function limpiarSlugSeo(string $slug): string {
    $limpio = strtolower(trim($slug));
    $limpio = preg_replace('/[^a-z0-9\-]/', '-', $limpio);
    $limpio = preg_replace('/-+/', '-', $limpio);
    return trim($limpio, '-');
}

/**
 * Carga preguntas limpias directamente de los archivos SQL de una asignatura
 */
function cargarPreguntasDesdeSql(array $subjectInfo, string $testDir, ?int $filterGrade = null): array {
    $allQuestions = [];

    foreach ($subjectInfo['files'] as $fileName => $meta) {
        if ($filterGrade !== null && $meta['grade'] !== $filterGrade) {
            continue;
        }

        $filePath = $testDir . '/' . $fileName;
        if (!file_exists($filePath)) {
            continue;
        }

        // Crear base de datos SQLite en memoria para procesar el dump
        $db = new PDO('sqlite::memory:');
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Extraer columnas dinámicas del primer INSERT del archivo
        $handle = fopen($filePath, 'r');
        $firstInsert = '';
        while (($line = fgets($handle)) !== false) {
            if (str_starts_with(trim($line), 'INSERT INTO')) {
                $firstInsert = trim($line);
                break;
            }
        }
        fclose($handle);

        if (!$firstInsert || !preg_match('/INSERT INTO\s+"?Preguntas"?\s*\(([^)]+)\)\s*VALUES/i', $firstInsert, $mCols)) {
            continue;
        }

        $cols = array_map(fn($c) => trim($c, " \n\r\t\"`"), explode(',', $mCols[1]));
        $colDefs = array_map(fn($c) => '"' . $c . '" TEXT', $cols);
        $db->exec('CREATE TABLE "Preguntas" (' . implode(', ', $colDefs) . ');');

        if (!in_array('pregunta2', $cols)) {
            $db->exec('ALTER TABLE "Preguntas" ADD COLUMN "pregunta2" TEXT;');
        }
        if (!in_array('explicacion', $cols)) {
            $db->exec('ALTER TABLE "Preguntas" ADD COLUMN "explicacion" TEXT;');
        }

        // Cargar todo el SQL en memoria
        $sqlContent = file_get_contents($filePath);
        try {
            $db->exec($sqlContent);
        } catch (Exception $e) {
            // Si falla en bloque por alguna comilla rara, insertar sentencia a sentencia
            foreach (explode(";\n", $sqlContent) as $stmt) {
                $stmt = trim($stmt);
                if (!empty($stmt)) {
                    try { $db->exec($stmt); } catch (Exception $ex) {}
                }
            }
        }

        // Descartar opciones dependientes de imágenes o preguntas vacías
        $query = "
            SELECT idPregunta, pregunta, pregunta2, respuestaA, respuestaB, respuestaC, respuestaD, respuesta, tema, explicacion
            FROM \"Preguntas\"
            WHERE (respuestaA IS NOT NULL AND respuestaA NOT LIKE '%imagen_%')
              AND (respuestaB IS NULL OR respuestaB NOT LIKE '%imagen_%')
              AND (respuestaC IS NULL OR respuestaC NOT LIKE '%imagen_%')
              AND (respuestaD IS NULL OR respuestaD NOT LIKE '%imagen_%')
              AND NOT (TRIM(COALESCE(pregunta, '')) = '' AND TRIM(COALESCE(pregunta2, '')) = '')
              AND NOT (pregunta LIKE '%siguiente imagen%' OR pregunta LIKE '%esta imagen%')
        ";

        $stmt = $db->query($query);
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $pId = (string) $row['idPregunta'];
            $fullId = $subjectInfo['code'] . '_g' . $meta['grade'] . '_' . $pId;

            // Formar array de opciones originales
            $options = [];
            $correctLetter = strtolower(trim($row['respuesta'] ?? 'a'));

            if (!empty(trim($row['respuestaA'] ?? ''))) {
                $options[] = ['key' => 'A', 'text' => limpiarTextoHtml($row['respuestaA']), 'isCorrect' => ($correctLetter === 'a')];
            }
            if (!empty(trim($row['respuestaB'] ?? ''))) {
                $options[] = ['key' => 'B', 'text' => limpiarTextoHtml($row['respuestaB']), 'isCorrect' => ($correctLetter === 'b')];
            }
            if (!empty(trim($row['respuestaC'] ?? ''))) {
                $options[] = ['key' => 'C', 'text' => limpiarTextoHtml($row['respuestaC']), 'isCorrect' => ($correctLetter === 'c')];
            }
            if (!empty(trim($row['respuestaD'] ?? ''))) {
                $options[] = ['key' => 'D', 'text' => limpiarTextoHtml($row['respuestaD']), 'isCorrect' => ($correctLetter === 'd')];
            }

            // Si ninguna coincide exactamente con 'a','b','c','d', buscar por texto
            $hasCorrect = false;
            foreach ($options as $opt) {
                if ($opt['isCorrect']) {
                    $hasCorrect = true;
                    break;
                }
            }
            if (!$hasCorrect && !empty($options)) {
                $options[0]['isCorrect'] = true; // Por defecto la primera en estos datasets
            }

            $allQuestions[] = [
                'id' => $fullId,
                'rawId' => $pId,
                'sourceFile' => $fileName,
                'grade' => $meta['grade'],
                'cycle' => $meta['cycle'],
                'pregunta' => limpiarTextoHtml($row['pregunta'] ?? ''),
                'pregunta2' => limpiarTextoHtml($row['pregunta2'] ?? ''),
                'explicacionOriginal' => limpiarTextoHtml($row['explicacion'] ?? ''),
                'options' => $options
            ];
        }
    }

    return $allQuestions;
}

function listarEstadisticas(array $subjects, string $testDir, string $dataDir): void {
    echo "\n==============================================================================\n";
    echo "  ESTADÍSTICAS DEL CATÁLOGO DE PREGUNTAS POR ASIGNATURA (EDUAROO)\n";
    echo "==============================================================================\n";

    foreach ($subjects as $code => $info) {
        $subjectDir = $dataDir . '/' . $info['slug'];
        $jsonEnriched = $subjectDir . '/questions-enriched.json';

        $enrichedCount = 0;
        if (file_exists($jsonEnriched)) {
            $data = json_decode(file_get_contents($jsonEnriched), true);
            $enrichedCount = is_array($data) ? count($data) : 0;
        }

        // Contar preguntas utilizables
        $cleanQuestions = cargarPreguntasDesdeSql($info, $testDir);
        $totalClean = count($cleanQuestions);

        $codeStr = str_pad("[$code]", 14);
        $nameStr = str_pad($info['name'], 48);
        $bilStr = $info['isBilingual'] ? '[Bilingüe ES/EN]' : '[Monolingüe]';
        echo "- $codeStr $nameStr -> Listas: " . str_pad((string)$totalClean, 5) . " | Enriquecidas: " . str_pad((string)$enrichedCount, 4) . " $bilStr\n";
    }

    echo "\nEjecuta: php scripts/eduaroo_enrich.php --subject <CODIGO> --limit <N>\n\n";
}

// -----------------------------------------------------------------------------
// PROCESAMIENTO DE PARÁMETROS CLI
// -----------------------------------------------------------------------------

$shortopts = "s:g:l:m:o:fd:h";
$longopts = [
    "subject:",
    "grade:",
    "limit:",
    "id:",
    "model:",
    "project-id:",
    "location:",
    "output:",
    "force",
    "dry-run",
    "api-key:",
    "delay:",
    "aistudio",
    "list",
    "help"
];

$cliArgs = getopt($shortopts, $longopts);
$dryRun = isset($cliArgs['dry-run']);

if (isset($cliArgs['h']) || isset($cliArgs['help'])) {
    imprimirAyuda();
    exit(0);
}

if (isset($cliArgs['list'])) {
    listarEstadisticas($SUBJECTS, $testDir, $dataDir);
    exit(0);
}

$subjectCode = resolverAsignatura($cliArgs['s'] ?? ($cliArgs['subject'] ?? 'math'), $SUBJECTS);
$subjectInfo = $SUBJECTS[$subjectCode];

$filterGrade = isset($cliArgs['g']) ? (int) $cliArgs['g'] : (isset($cliArgs['grade']) ? (int) $cliArgs['grade'] : null);
$limit = isset($cliArgs['l']) ? (int) $cliArgs['l'] : (isset($cliArgs['limit']) ? (int) $cliArgs['limit'] : PHP_INT_MAX);
$filterId = $cliArgs['id'] ?? null;
$force = isset($cliArgs['f']) || isset($cliArgs['force']);
$delaySeconds = isset($cliArgs['d']) ? (int) $cliArgs['d'] : (isset($cliArgs['delay']) ? (int) $cliArgs['delay'] : 15);
$apiKey = getenv('GOOGLE_API_KEY') ?: die("Missing GOOGLE_API_KEY\n");
$projectId = $cliArgs['project-id'] ?? (getenv('GCP_PROJECT_ID') ?: 'project-3c35a0de-6bcc-40c9-877');
$location = $cliArgs['location'] ?? (getenv('GCP_LOCATION') ?: 'global');
$modelId = $cliArgs['m'] ?? ($cliArgs['model'] ?? (getenv('GEMINI_MODEL') ?: 'gemini-3.8-flash'));

$useAiStudio = isset($cliArgs['aistudio']);

function buildApiUrl(bool $useAiStudio, string $projectId, string $location, string $modelId, string $apiKey): string {
    if ($useAiStudio) {
        return "https://generativelanguage.googleapis.com/v1beta/models/{$modelId}:generateContent?key={$apiKey}";
    }
    $host = ($location === 'global') ? 'aiplatform.googleapis.com' : "{$location}-aiplatform.googleapis.com";
    return "https://{$host}/v1/projects/{$projectId}/locations/{$location}/publishers/google/models/{$modelId}:generateContent?key={$apiKey}";
}

$apiUrl = buildApiUrl($useAiStudio, $projectId, $location, $modelId, $apiKey);

// Cadena de fallback exclusiva de serie 3.x (3.8 -> 3.7 -> 3.6 -> 3.5)
$fallbackModels = array_values(array_unique([
    $modelId,
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
]));

// Rutas de archivos de salida
$subjectDir = $dataDir . '/' . $subjectInfo['slug'];
if (!is_dir($subjectDir)) {
    mkdir($subjectDir, 0777, true);
}
$outputJsonPath = $cliArgs['o'] ?? ($cliArgs['output'] ?? ($subjectDir . '/questions-enriched.json'));

// Cargar preguntas enriquecidas existentes para saltar o actualizar
$existingEnrichedMap = [];
if (file_exists($outputJsonPath)) {
    $rawExisting = file_get_contents($outputJsonPath);
    $existingArray = json_decode($rawExisting, true);
    if (is_array($existingArray)) {
        foreach ($existingArray as $item) {
            $eId = $item['id'] ?? ($item['slug'] ?? null);
            if ($eId) {
                $existingEnrichedMap[$eId] = $item;
            }
        }
    }
}

// Cargar dataset de preguntas limpias
echo "Cargando y filtrando preguntas para '{$subjectInfo['name']}'...\n";
$questions = cargarPreguntasDesdeSql($subjectInfo, $testDir, $filterGrade);

if (empty($questions)) {
    die("\n[Error fatal]: No se encontraron preguntas válidas para la asignatura seleccionada.\n\n");
}

// -----------------------------------------------------------------------------
// CABECERA DE INICIO
// -----------------------------------------------------------------------------

echo "\n==============================================================================\n";
echo "  ENRIQUECEDOR DE PREGUNTAS CON IA (GEMINI) - EDUAROO\n";
echo "==============================================================================\n";
echo "- Asignatura:           {$subjectInfo['name']} ({$subjectInfo['code']})\n";
echo "- Modo Bilingüe:        " . ($subjectInfo['isBilingual'] ? 'Sí (Español e Inglés)' : 'No (Monolingüe)') . "\n";
echo "- Curso filtrado:       " . ($filterGrade ? "$filterGrade º" : 'Todos los cursos') . "\n";
echo "- Archivo de salida:    $outputJsonPath\n";
echo "- Total preguntas disp: " . count($questions) . "\n";
echo "- Ya enriquecidas:      " . count($existingEnrichedMap) . "\n";
echo "- Modelo IA:            $modelId\n";
echo "- Límite a procesar:    " . ($limit === PHP_INT_MAX ? 'Todas las pendientes' : $limit) . "\n";
echo "- Filtro ID:            " . ($filterId ?: 'Ninguno') . "\n";
echo "- Pausa entre llamadas: {$delaySeconds}s\n";
echo "==============================================================================\n\n";

$processedCount = 0;
$skippedCount = 0;
$errorCount = 0;

$temarioJson = json_encode($subjectInfo['temario'], JSON_UNESCAPED_UNICODE);

foreach ($questions as $index => $item) {
    if ($processedCount >= $limit) {
        echo "[Fin] Se alcanzó el límite configurado de $limit preguntas.\n";
        break;
    }

    $qId = $item['id'];
    if (!empty($filterId) && $filterId !== $qId && $filterId !== $item['rawId']) {
        continue;
    }

    if (isset($existingEnrichedMap[$qId]) && !$force) {
        $skippedCount++;
        continue;
    }

    // Formatear opciones para el prompt
    $optionsFormatted = [];
    $correctAnswerText = '';
    foreach ($item['options'] as $opt) {
        $key = $opt['key'];
        $text = $opt['text'];
        $isCorr = !empty($opt['isCorrect']) ? ' [CORRECTA]' : '';
        $optionsFormatted[] = "Opción $key: $text$isCorr";
        if (!empty($opt['isCorrect'])) {
            $correctAnswerText = $text;
        }
    }
    $optionsBlock = implode("\n", $optionsFormatted);

    $preguntaCompleta = $item['pregunta'];
    if (!empty($item['pregunta2'])) {
        $preguntaCompleta .= " | Datos/Contexto: " . $item['pregunta2'];
    }

    echo "[$index] Procesando [Curso {$item['grade']}º] ID: $qId (" . substr($preguntaCompleta, 0, 60) . "...)\n";

    // -------------------------------------------------------------------------
    // CONSTRUCCIÓN DEL PROMPT PEDAGÓGICO
    // -------------------------------------------------------------------------

    $bilingualInstructions = "";
    if ($subjectInfo['isBilingual']) {
        $bilingualInstructions = <<<BILINGUAL
2. **questionEN**: Traduce y adapta con precisión didáctica y naturalidad el enunciado al inglés para un entorno educativo CLIL / bilingüe de Primaria/Secundaria.
5. **options[*].textEN**: Traduce y redacta cada opción en inglés con rigor.
7. **descriptionEN**: Escribe la explicación completa y didáctica en inglés con el mismo nivel de detalle formativo.
9. **descriptionShortEN**: Escribe el resumen conciso de 1-2 frases en inglés (TEXTO PLANO).
12. **seoTitleEN**: Título temático limpio en inglés sin coletillas.
13. **seoSlugEN**: Slug URL limpio en inglés con guiones.
BILINGUAL;
    } else {
        $bilingualInstructions = <<<MONOLINGUAL
NOTA DE IDIOMA: Esta asignatura es de aprendizaje de lengua específica ({$subjectInfo['name']}).
- Mantén el contenido enfocado según la materia. Si es Ortografía, las preguntas y explicaciones son 100% en Español. Si es Inglés, las preguntas/opciones están en Inglés y las explicaciones didácticas en Español (o bilingüe) para guiar al estudiante hispanohablante.
- En los campos *EN puedes dejarlos vacíos o con la versión en inglés cuando aplique.
MONOLINGUAL;
    }

    $prompt = <<<PROMPT
Actúa como un maestro y pedagogo experto en educación Primaria y Secundaria (ESO) en España según el currículo oficial LOMLOE (Real Decreto 157/2022), y redactor de contenidos educativos interactivos.
Tu misión es transformar una pregunta escolar en un ejercicio interactivo, 100% ORIGINAL, didáctico, motivador y adaptado a la edad del curso escolar indicado, libre de cualquier plagio o copia literal.

DATOS DE LA PREGUNTA ORIGINAL:
- Asignatura: {$subjectInfo['name']}
- Curso escolar estimado: {$item['grade']}º de Educación Básica (Ciclo LOMLOE: {$item['cycle']})
- Pregunta / Enunciado original: "{$item['pregunta']}"
- Datos adicionales / Problema secundario: "{$item['pregunta2']}"
- Opciones de Respuesta originales:
$optionsBlock
- Respuesta Correcta: "$correctAnswerText"
- Explicación de Referencia original: "{$item['explicacionOriginal']}"

BLOQUES TEMÁTICOS OFICIALES DE LA ASIGNATURA:
$temarioJson

INSTRUCCIONES CLAVE:
1. **question**: Reescribe el enunciado de forma 100% original, integrando fluidamente los datos o contexto de forma clara, amigable y motivadora para la edad del alumno. Evita la copia literal, pero mantén EXACTAMENTE el mismo concepto pedagógico.
$bilingualInstructions
3. **options**: Devuelve un array de objetos con las opciones reescritas:
   [{"key": "A", "text": "...", "textEN": "..."}, ...]
   REGLAS DE ORO VITALES:
   - La opción correcta DEBE seguir siendo indiscutiblemente la correcta tras reescribirla.
   - Las opciones incorrectas (distractores) DEBEN representar errores pedagógicos típicos (confusiones comunes de los alumnos en ese tema), nunca respuestas absurdas.
   - Si la pregunta original cuenta con pocas opciones (o solo la respuesta correcta), GENERA TÚ MISMO 2 o 3 opciones distractoras plausibles y educativas adicionales para que el ejercicio tenga siempre 3 o 4 opciones bien balanceadas.
4. **description**: Escribe una explicación pedagógica completa, formativa y motivadora en Español. Explica con claridad el razonamiento paso a paso, felicitando el buen razonamiento y explicando por qué la opción correcta es la adecuada y en qué fallan los distractores.
6. **descriptionShort**: Genera un resumen directo y conciso de la explicación en Español (máximo 2 frases, directo al grano, en TEXTO PLANO sin negritas, asteriscos ni markdown) para mostrar como feedback inmediato en el juego.
8. **gradeLevel**: Confirma o ajusta el curso escolar más adecuado (número entero de 1 a 8).
9. **difficulty**: Evalúa la dificultad pedagógica relativa como "facil", "medio" o "dificil".
10. **tema**: Elige obligatoriamente el tema más adecuado de la lista de BLOQUES TEMÁTICOS proporcionada arriba.
11. **seoTitle**: Título conciso, descriptivo y directo en Español (ej. "Cómo descomponer números en centenas y decenas", "Uso de la B antes de consonante"). NUNCA añadas coletillas como "- Test", "- Eduaroo", "- Primaria".
12. **seoSlug**: Slug URL limpio con guiones (ej. "como-descomponer-numeros-centenas-decenas").

FORMATO DE SALIDA ESTRICTO (JSON VÁLIDO):
Devuelve ÚNICAMENTE un objeto JSON con la siguiente estructura:
{
  "question": "...",
  "questionEN": "...",
  "options": [
    { "key": "A", "text": "...", "textEN": "...", "isCorrect": true },
    { "key": "B", "text": "...", "textEN": "...", "isCorrect": false },
    { "key": "C", "text": "...", "textEN": "...", "isCorrect": false }
  ],
  "description": "...",
  "descriptionEN": "...",
  "descriptionShort": "...",
  "descriptionShortEN": "...",
  "gradeLevel": {$item['grade']},
  "difficulty": "facil" | "medio" | "dificil",
  "tema": "...",
  "seoTitle": "...",
  "seoSlug": "...",
  "seoTitleEN": "...",
  "seoSlugEN": "..."
}
PROMPT;

    $requestBody = [
        'contents' => [
            [
                'role' => 'user',
                'parts' => [
                    ['text' => $prompt]
                ]
            ]
        ],
        'generationConfig' => [
            'responseMimeType' => 'application/json',
            'temperature' => 0.2
        ]
    ];

    if ($dryRun) {
        echo "\n\x1b[36m--- [DRY-RUN PROMPT GENERADO] ---\x1b[0m\n";
        echo $prompt . "\n";
        echo "\x1b[36m--- [FIN DRY-RUN] ---\x1b[0m\n\n";
        $processedCount++;
        continue;
    }

    // Llamada con rotación de fallback entre modelos Gemini 3.8 -> 3.7 -> 3.6 -> 3.5 ante 429
    static $preferredModelIdx = 0;
    static $questionsSincePrimaryCheck = 0;

    if ($preferredModelIdx > 0 && ++$questionsSincePrimaryCheck >= 25) {
        $preferredModelIdx = 0; // Reintentar gemini-3.8-flash cada 25 preguntas por si se liberó cuota
        $questionsSincePrimaryCheck = 0;
    }

    $totalModels = count($fallbackModels);
    $response = null;
    $httpCode = 0;
    $curlError = null;
    $usedModel = $fallbackModels[$preferredModelIdx];

    for ($step = 0; $step < $totalModels; $step++) {
        $mIdx = ($preferredModelIdx + $step) % $totalModels;
        $candidateModel = $fallbackModels[$mIdx];
        $candidateUrl = buildApiUrl($useAiStudio, $projectId, $location, $candidateModel, $apiKey);

        $ch = curl_init($candidateUrl);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($requestBody),
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'x-goog-api-key: ' . $apiKey
            ]
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            echo "[Error cURL]: $curlError.\n";
            break;
        }

        if ($httpCode === 429) {
            $nextIdx = ($mIdx + 1) % $totalModels;
            $nextModel = $fallbackModels[$nextIdx];
            $waitSeconds = ($step + 1 < $totalModels) ? 10 : 60;
            echo "\x1b[33m[Cuota 429 en $candidateModel]: Pasando a fallback $nextModel (esperando {$waitSeconds}s)...\x1b[0m\n";
            sleep($waitSeconds);
            continue;
        }

        // Éxito: recordar este modelo como activo para no golpear innecesariamente uno agotado
        $preferredModelIdx = $mIdx;
        $usedModel = $candidateModel;
        break;
    }

    if ($curlError || $httpCode >= 400 || empty($response)) {
        echo "\x1b[31m[Error API $httpCode]:\x1b[0m " . substr((string)$response, 0, 200) . "\n";
        $errorCount++;
        continue;
    }

    $responseData = json_decode($response, true);
    $generatedText = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? '';
    $cleanedJsonText = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', trim($generatedText));
    $aiData = json_decode($cleanedJsonText, true);

    if (!is_array($aiData) || empty($aiData['descriptionShort'])) {
        echo "[Error]: No se pudo decodificar el JSON de la IA. Saltando.\n";
        $errorCount++;
        continue;
    }

    // Procesar opciones enriquecidas por la IA
    $enrichedOptions = [];
    $possibleAnswers = [];
    $possibleAnswersEN = [];
    $correctAnswers = [];
    $correctAnswersEN = [];

    if (!empty($aiData['options']) && is_array($aiData['options'])) {
        foreach ($aiData['options'] as $idx => $optAI) {
            $k = strtoupper(trim((string)($optAI['key'] ?? chr(65 + $idx))));
            $txt = trim((string)($optAI['text'] ?? ''));
            $txtEN = trim((string)($optAI['textEN'] ?? ''));
            // Si la IA especificó isCorrect usarlo, o si es la clave de la correcta
            $isC = isset($optAI['isCorrect']) ? (bool)$optAI['isCorrect'] : ($k === 'A');

            $enrichedOptions[] = [
                'key' => $k,
                'text' => $txt,
                'textEN' => $txtEN,
                'isCorrect' => $isC
            ];
            $possibleAnswers[] = $txt;
            if (!empty($txtEN)) {
                $possibleAnswersEN[] = $txtEN;
            }
            if ($isC) {
                $correctAnswers[] = $txt;
                if (!empty($txtEN)) {
                    $correctAnswersEN[] = $txtEN;
                }
            }
        }
    } else {
        // Fallback a las opciones originales si no vinieron de la IA
        foreach ($item['options'] as $opt) {
            $k = $opt['key'];
            $txt = $opt['text'];
            $isC = !empty($opt['isCorrect']);

            $enrichedOptions[] = [
                'key' => $k,
                'text' => $txt,
                'textEN' => '',
                'isCorrect' => $isC
            ];
            $possibleAnswers[] = $txt;
            if ($isC) {
                $correctAnswers[] = $txt;
            }
        }
    }

    $gradeRes = isset($aiData['gradeLevel']) ? (int)$aiData['gradeLevel'] : $item['grade'];
    $cycleRes = ($gradeRes <= 2) ? 1 : (($gradeRes <= 4) ? 2 : (($gradeRes <= 6) ? 3 : 4));

    $enrichedItem = [
        'id' => $qId,
        'subject' => $subjectCode,
        'subjectName' => $subjectInfo['name'],
        'grade' => $gradeRes,
        'lomloeCycle' => $cycleRes,
        'tema' => $aiData['tema'] ?? $subjectInfo['temario'][0],
        'difficulty' => $aiData['difficulty'] ?? 'medio',

        // Preguntas
        'question' => !empty($aiData['question']) ? trim($aiData['question']) : $item['pregunta'],
        'questionEN' => $aiData['questionEN'] ?? '',

        // Trazabilidad
        'questionOriginal' => $item['pregunta'],
        'pregunta2Original' => $item['pregunta2'],
        'sourceFile' => $item['sourceFile'],
        'optionsOriginal' => $item['options'],

        // Opciones y respuestas
        'options' => $enrichedOptions,
        'possibleAnswers' => $possibleAnswers,
        'possibleAnswersEN' => $possibleAnswersEN,
        'correctAnswers' => $correctAnswers,
        'correctAnswersEN' => $correctAnswersEN,

        // Explicaciones
        'description' => $aiData['description'] ?? '',
        'descriptionEN' => $aiData['descriptionEN'] ?? '',
        'descriptionShort' => $aiData['descriptionShort'] ?? '',
        'descriptionShortEN' => $aiData['descriptionShortEN'] ?? '',

        // SEO y slugs
        'seoTitle' => $aiData['seoTitle'] ?? '',
        'seoSlug' => limpiarSlugSeo($aiData['seoSlug'] ?? $qId),
        'seoTitleEN' => $aiData['seoTitleEN'] ?? '',
        'seoSlugEN' => limpiarSlugSeo($aiData['seoSlugEN'] ?? ''),

        'enrichedAt' => date('c')
    ];

    $existingEnrichedMap[$qId] = $enrichedItem;
    $processedCount++;

    // Guardar progresivamente el archivo JSON
    file_put_contents(
        $outputJsonPath,
        json_encode(array_values($existingEnrichedMap), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
    );

    echo "\x1b[32m[✓ Enriquecida con éxito ($usedModel)]\x1b[0m\n";
    echo "  -> Tema LOMLOE:    " . $enrichedItem['tema'] . " (Curso: {$enrichedItem['grade']}º)\n";
    echo "  -> Dificultad:      " . $enrichedItem['difficulty'] . "\n";
    echo "  -> Short ES:        " . substr($enrichedItem['descriptionShort'], 0, 75) . "...\n";
    if ($subjectInfo['isBilingual'] && !empty($enrichedItem['questionEN'])) {
        echo "  -> Pregunta (EN):   " . substr($enrichedItem['questionEN'], 0, 65) . "...\n";
    }

    if ($delaySeconds > 0 && $processedCount < $limit) {
        sleep($delaySeconds);
    }
}

echo "\n==============================================================================\n";
echo "PROCESO FINALIZADO\n";
echo "- Preguntas enriquecidas en esta sesión: $processedCount\n";
echo "- Preguntas omitidas (ya procesadas):    $skippedCount\n";
echo "- Errores:                              $errorCount\n";
echo "- Total acumulado en archivo enriquecido: " . count($existingEnrichedMap) . "\n";
echo "- Archivo resultante:                   $outputJsonPath\n";
echo "==============================================================================\n\n";
