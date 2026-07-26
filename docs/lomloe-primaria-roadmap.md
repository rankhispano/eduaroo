# Roadmap LOMLOE para Primaria

Documento de trabajo para ordenar Eduaroo por asignatura, curso y unidad didactica segun el enfoque LOMLOE en Espana.

Fuentes base consultadas:

- Real Decreto 157/2022, de 1 de marzo, por el que se establecen la ordenacion y las ensenanzas minimas de Educacion Primaria.
- Portal Educagob del Ministerio de Educacion, Formacion Profesional y Deportes: curriculo LOMLOE de Educacion Primaria.

Nota importante: el Real Decreto estatal fija las ensenanzas minimas. Para cerrar una programacion totalmente oficial por comunidad autonoma hay que mapear despues el decreto/orden autonomica correspondiente.

## 1. Estado actual del contenido

### Matemáticas

Es el area mas avanzada del proyecto. Hay rutas y componentes interactivos para 1º a 6º:

- 1º: numeracion, operaciones, geometria, medicion.
- 2º: numeracion, operaciones, fracciones, geometria, medicion.
- 3º: numeracion, operaciones, fracciones/decimales, geometria, medicion/problemas.
- 4º: multiplicacion, division, fracciones, problemas con fracciones, decimales, geometria, medicion.
- 5º: operaciones avanzadas, sistema sexagesimal, geometria/areas, fracciones.
- 6º: proporcionalidad, enteros, estadistica, volumen.

La estructura de unidades esta centralizada en `lib/learning/sampleUnits.ts`, aunque el nombre ya se ha quedado corto porque contiene todos los cursos de matematicas. 4º es el curso mas cuidado: tiene mas unidades y en fracciones ya existe una progresion de microlecciones especifica.

Riesgo principal: las unidades existen como temas sueltos, pero no estan todavia etiquetadas con competencias especificas, criterios de evaluacion, saberes basicos por ciclo ni situaciones de aprendizaje.

### Lengua Castellana y Literatura

Hay una unidad de 4º en `lib/learning/languageUnits.ts`:

- 4º: comunicacion y gramatica, con ejercicios sobre tipos de texto, prefijos/sufijos, pronombres y demostrativos.

Es buen punto de partida, pero falta cubrir comprension oral/escrita, expresion, lectura literaria, alfabetizacion informacional y escritura guiada.

### Programacion y juegos

Existe un bloque propio de programacion y varios juegos. Esto puede funcionar como area transversal de competencia digital y pensamiento computacional, pero no debe sustituir a las areas oficiales de Primaria. Conviene integrarlo como recurso dentro de situaciones de aprendizaje.

### Areas prioritarias del roadmap

El foco del proyecto queda acotado a estas asignaturas:

- Lengua Castellana y Literatura.
- Matematicas.
- Ciencias Naturales.
- Ciencias Sociales.
- Ingles.

En LOMLOE estatal, Ciencias Naturales y Ciencias Sociales aparecen integradas dentro de Conocimiento del Medio Natural, Social y Cultural, aunque se pueden desdoblar. Para Eduaroo conviene trabajarlas como dos asignaturas separadas porque ayuda a ordenar rutas, unidades y ejercicios.

Quedan fuera del plan actual Educacion Artistica, Educacion Fisica, Valores Civicos y Eticos, segunda lengua extranjera, lengua cooficial y posibles areas transversales autonomicas.

## 2. Marco LOMLOE que debe guiar la estructura

Primaria son seis cursos organizados en tres ciclos:

- Primer ciclo: 1º y 2º.
- Segundo ciclo: 3º y 4º.
- Tercer ciclo: 5º y 6º.

Las unidades no deberian planificarse solo como "temas". En LOMLOE conviene guardar estos campos por unidad:

- Area.
- Curso y ciclo.
- Titulo de unidad.
- Saberes basicos trabajados.
- Competencias especificas del area.
- Criterios de evaluacion asociados.
- Situacion de aprendizaje.
- Producto o reto final.
- Actividades guiadas, practica autonoma y reto.
- Instrumentos de evaluacion: rubrica, autoevaluacion, prueba corta, observacion o portfolio.
- Medidas DUA: apoyo visual, audio, manipulativos virtuales, niveles de dificultad y refuerzo.
- Conexion transversal: lectura, expresion oral/escrita, competencia digital, creatividad, sostenibilidad, igualdad, convivencia y salud.

## 3. Propuesta de unidades por curso y asignatura

### Matemáticas

#### 1º Primaria

1. Numeros hasta 99 y conteo en contextos cercanos.
2. Sumas y restas sin llevadas con apoyo visual.
3. Problemas de una operacion.
4. Formas planas, posicion y orientacion.
5. Medida inicial: longitud, masa, tiempo y dinero.
6. Datos sencillos: clasificar, contar y representar.

#### 2º Primaria

1. Numeros hasta 999 y valor posicional.
2. Sumas y restas con llevadas.
3. Inicio de la multiplicacion como suma repetida.
4. Fracciones sencillas: mitad, tercio y cuarto.
5. Cuerpos geometricos, simetria y patrones.
6. Calendario, reloj, monedas y problemas de medida.

#### 3º Primaria

1. Numeros hasta cinco cifras y comparacion.
2. Multiplicacion y division en situaciones de reparto.
3. Fracciones como parte de la unidad y de una cantidad.
4. Decimales iniciales ligados a dinero y medida.
5. Poligonos, circunferencia y elementos geometricos.
6. Tablas, graficos y resolucion de problemas reales.

#### 4º Primaria

1. Multiplicacion de varios digitos y estimacion.
2. Division con y sin resto, interpretando el resultado.
3. Fracciones: representacion, equivalencias iniciales y comparacion.
4. Problemas con fracciones en contextos cotidianos.
5. Decimales: lectura, comparacion y relacion con fracciones/medida.
6. Rectas, angulos, poligonos y simetria.
7. Sistema metrico: conversiones y problemas.
8. Datos: tablas, graficos, media intuitiva y probabilidad cualitativa.

#### 5º Primaria

1. Numeros grandes, divisibilidad, multiplos y divisores.
2. Fracciones equivalentes, comparacion y operaciones sencillas.
3. Decimales y porcentajes en compras, descuentos y medidas.
4. Sistema sexagesimal: tiempo y angulos.
5. Perimetros, areas de figuras planas y escalas.
6. Estadistica: media, moda, rango y graficos.

#### 6º Primaria

1. Proporcionalidad, regla de tres y porcentajes.
2. Numeros enteros, potencias y raices sencillas.
3. Fracciones, decimales y porcentajes integrados.
4. Geometria 3D: cuerpos, volumen y desarrollo.
5. Estadistica y probabilidad con toma de decisiones.
6. Proyecto de transicion a ESO: resolver un problema complejo con varias estrategias.

Prioridad tecnica: renombrar `sampleUnits.ts` a una estructura curricular real, por ejemplo `curriculum/mathUnits.ts`, y anadir metadatos LOMLOE.

### Lengua Castellana y Literatura

#### 1º Primaria

1. Conciencia fonologica, letras y silabas.
2. Lectura de palabras, frases y textos breves.
3. Escritura de palabras y oraciones.
4. Comprension oral: escuchar, responder y contar.
5. Vocabulario del entorno cercano.
6. Primer contacto con cuentos, poemas y biblioteca de aula.

#### 2º Primaria

1. Fluidez lectora y comprension literal.
2. Escritura de frases y parrafos breves.
3. Ortografia natural y signos basicos.
4. Tipos de texto cotidianos: nota, invitacion, descripcion.
5. Vocabulario, familias de palabras y sinonimos/antonimos.
6. Lectura literaria guiada.

#### 3º Primaria

1. Comprension lectora: idea principal y detalles.
2. Produccion escrita: descripcion, narracion y dialogo.
3. Gramatica inicial: sustantivo, adjetivo, verbo.
4. Ortografia: b/v, g/j, h, mayusculas y puntuacion.
5. Comunicacion oral: exposiciones breves.
6. Busqueda guiada de informacion y lectura literaria.

#### 4º Primaria

1. Textos personales y funcionales: cartas, diario, instrucciones.
2. Prefijos, sufijos y formacion de palabras.
3. Pronombres, demostrativos y concordancia.
4. Comprension inferencial y resumen.
5. Escritura planificada: borrador, revision y publicacion.
6. Literatura: narracion, poesia, teatro y recursos basicos.

#### 5º Primaria

1. Comprension critica de textos informativos y literarios.
2. Escritura de textos expositivos, narrativos y argumentativos sencillos.
3. Morfologia y sintaxis: determinantes, pronombres, verbos y grupos de palabras.
4. Ortografia avanzada y puntuacion.
5. Alfabetizacion mediatica: buscar, seleccionar y citar informacion.
6. Lectura autonoma y tertulia literaria.

#### 6º Primaria

1. Lectura critica y comparacion de fuentes.
2. Escritura extensa: proyecto, informe, relato o articulo.
3. Analisis gramatical funcional para mejorar textos.
4. Comunicacion oral formal: debate, presentacion y entrevista.
5. Literatura y patrimonio cultural.
6. Portfolio final de comunicacion para transicion a ESO.

Prioridad tecnica: crear `curriculum/languageUnits.ts` con 1º a 6º y convertir la pagina actual de 4º en una unidad dentro de una progresion mas amplia.

### Ciencias Naturales

#### 1º Primaria

1. Mi cuerpo, sentidos y habitos saludables.
2. Seres vivos cercanos: animales y plantas.
3. El tiempo atmosferico y las estaciones.
4. Materiales cotidianos: observar, tocar, comparar.
5. Habitos de higiene, descanso y alimentacion.
6. Primeros experimentos: observar, comparar y registrar.

#### 2º Primaria

1. Cuerpo humano, alimentacion e higiene.
2. Animales, plantas y ecosistemas proximos.
3. Materiales, energia y cambios sencillos.
4. Agua, aire y cuidado del entorno.
5. Salud y prevencion en la vida diaria.
6. Investigamos la naturaleza del patio, casa o barrio.

#### 3º Primaria

1. Funcionamiento del cuerpo y salud.
2. Ecosistemas, relaciones y sostenibilidad.
3. Materia, maquinas simples y energia.
4. Metodo cientifico: pregunta, hipotesis, prueba y conclusion.
5. Fuerzas y movimiento en situaciones cercanas.
6. Proyecto: cuidar un ecosistema cercano.

#### 4º Primaria

1. Nutricion, relacion y reproduccion en seres vivos.
2. Ecosistemas y equilibrio ambiental.
3. Fuerzas, energia, electricidad y tecnologia cotidiana.
4. Mezclas, materiales y cambios.
5. Consumo responsable, residuos y sostenibilidad.
6. Proyecto: disenar una solucion cientifica para un problema cotidiano.

#### 5º Primaria

1. Cuerpo humano: sistemas, salud y prevencion.
2. Biodiversidad, cambio climatico y accion local.
3. Materia, energia, maquinas y metodo cientifico.
4. Electricidad, magnetismo y tecnologia.
5. Tierra, atmosfera y riesgos ambientales.
6. Proyecto experimental con datos y conclusiones.

#### 6º Primaria

1. Salud integral, bienestar y educacion afectivo-social.
2. Ecosistemas globales y sostenibilidad.
3. Tecnologia, digitalizacion y pensamiento cientifico.
4. Materia, energia y transformaciones.
5. Ciencia, tecnologia y sociedad.
6. Proyecto final: investigar un reto ambiental o de salud y proponer mejoras.

### Ciencias Sociales

#### 1º Primaria

1. Familia, escuela y convivencia.
2. Mi casa, mi calle y mi localidad.
3. Normas, seguridad y cuidado de espacios comunes.
4. Tiempo personal: antes, ahora y despues.
5. Oficios cercanos y servicios de la comunidad.
6. Primer mapa: recorridos y lugares importantes.

#### 2º Primaria

1. Barrio, pueblo o ciudad.
2. Paisajes naturales y humanizados.
3. Medios de transporte y comunicacion.
4. Calendario, fiestas y tradiciones.
5. Oficios, consumo y uso responsable del dinero.
6. Linea del tiempo personal y familiar.

#### 3º Primaria

1. Municipio, ayuntamiento y participacion.
2. Mapas, orientacion, relieve y rios.
3. Comunidad autonoma: territorio, simbolos y cultura.
4. Sectores economicos y profesiones.
5. Fuentes historicas y cambios en el tiempo.
6. Proyecto: investigar la localidad.

#### 4º Primaria

1. Espana fisica: relieve, rios, climas y paisajes.
2. Espana politica: comunidades, provincias y organizacion.
3. Poblacion, migraciones y diversidad.
4. Economia, consumo responsable y servicios publicos.
5. Historia: edades, patrimonio y vida cotidiana.
6. Proyecto: guia social e historica de un territorio.

#### 5º Primaria

1. Europa fisica y politica.
2. Espana y Europa: instituciones y ciudadania.
3. Poblacion, urbanizacion y actividades economicas.
4. Historia antigua y medieval en la peninsula iberica.
5. Patrimonio cultural y fuentes historicas.
6. Proyecto: museo digital o atlas comentado.

#### 6º Primaria

1. Mundo contemporaneo: globalizacion, derechos y retos.
2. Historia moderna y contemporanea de Espana.
3. Democracia, Constitucion y participacion ciudadana.
4. Geografia mundial basica y organismos internacionales.
5. Desarrollo sostenible y desigualdades.
6. Proyecto ciudadano: investigar un problema social local y proponer mejoras.

### Inglés

La progresion debe priorizar comprension, expresion e interaccion oral, especialmente en los primeros cursos.

#### 1º-2º Primaria

1. Greetings, classroom language and routines.
2. Colours, numbers, family and school objects.
3. Songs, chants and stories.
4. Basic questions and answers.
5. Festivals and cultural awareness.

#### 3º-4º Primaria

1. Daily routines and time.
2. Food, shopping and preferences.
3. Places, directions and local area.
4. Describing people, animals and objects.
5. Short reading and writing: cards, messages and mini stories.

#### 5º-6º Primaria

1. Past experiences and future plans.
2. Projects: environment, health, culture and technology.
3. Reading for information.
4. Writing short structured texts.
5. Oral presentations, interviews and collaborative tasks.

## 4. Plantilla recomendada de unidad didactica

Cada unidad deberia tener esta forma:

```ts
type CurriculumUnit = {
  id: string;
  subjectId: 'math' | 'language' | 'natural-science' | 'social-science' | 'english';
  gradeLevel: 1 | 2 | 3 | 4 | 5 | 6;
  cycle: 1 | 2 | 3;
  order: number;
  titleKey: string;
  descriptionKey: string;
  lomloe: {
    area: string;
    competencies: string[];
    evaluationCriteria: string[];
    basicKnowledge: string[];
  };
  learningSituation: {
    context: string;
    challenge: string;
    finalProduct: string;
  };
  lessons: CurriculumLesson[];
  assessment: string[];
  duaSupports: string[];
  prerequisites: string[];
  slug: string;
};
```

Lecciones recomendadas dentro de cada unidad:

1. Diagnostico rapido.
2. Microleccion explicativa.
3. Practica guiada.
4. Practica autonoma adaptativa.
5. Problema o tarea competencial.
6. Reto final con feedback.
7. Repaso espaciado.

## 5. Orden de trabajo recomendado

### Fase 1: consolidar el modelo curricular

1. Crear una carpeta `lib/curriculum`.
2. Mover las unidades de matematicas desde `sampleUnits.ts` a `lib/curriculum/math.ts`.
3. Crear `lib/curriculum/types.ts`.
4. Anadir campos LOMLOE sin romper las pantallas actuales.
5. Crear un indice por area y curso.

### Fase 2: cerrar Matemáticas

1. Completar huecos de 4º: datos/estadistica y una unidad final competencial.
2. Revisar 1º-3º para que cubran datos, medida y resolucion de problemas de forma explicita.
3. Revisar 5º-6º para integrar porcentajes, probabilidad, escalas y proyecto de transicion.
4. Etiquetar cada unidad con saberes basicos por ciclo.

### Fase 3: expandir Lengua

1. Crear el mapa completo 1º-6º.
2. Reutilizar la unidad actual de 4º como "Comunicacion y gramatica".
3. Anadir comprension lectora, escritura guiada, oralidad y literatura.
4. Incorporar audio/lectura en voz alta y ejercicios de revision de textos.

### Fase 4: crear Ciencias Naturales y Ciencias Sociales

1. Empezar por 3º-4º, porque encaja bien con el nivel ya trabajado.
2. Crear `naturalScienceUnits.ts` y `socialScienceUnits.ts`, aunque ambos puedan mapearse a Conocimiento del Medio en LOMLOE.
3. En Naturales priorizar observacion, experimentos, salud, seres vivos, energia y sostenibilidad.
4. En Sociales priorizar mapas, tiempo historico, territorio, economia, ciudadania y patrimonio.
5. Usar mapas, lineas de tiempo, experimentos virtuales y mini-proyectos.

### Fase 5: crear Inglés

1. Crear el mapa de Ingles por ciclos y despues concretarlo por curso.
2. Priorizar comprension oral, vocabulario funcional, rutinas y conversacion en 1º-2º.
3. Anadir lectura y escritura breve en 3º-4º.
4. Preparar proyectos orales y textos estructurados en 5º-6º.

## 6. Decision clave pendiente

Antes de convertir todo esto en contenido definitivo hay que elegir una comunidad autonoma de referencia. El minimo estatal vale para estructurar el producto, pero los criterios y saberes concretos pueden variar en nomenclatura, secuenciacion y carga horaria.

Si no se elige comunidad todavia, la mejor estrategia es:

1. Construir con base estatal LOMLOE.
2. Guardar campos para `region`.
3. Permitir despues adaptar textos y criterios a Andalucia, Madrid, Catalunya, Comunitat Valenciana, Galicia, Euskadi, etc.
