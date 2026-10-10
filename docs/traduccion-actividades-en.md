# Actividades en inglés para colegios bilingües

Estado a 9 de octubre de 2026: **238 de 238 JSON traducidos y revisados; 2351 de 2351 actividades. Quedan 0 JSON**. La revisión pedagógica de los originales está terminada y se documenta en [el informe general](revision-pedagogica-actividades.md).

## Criterio de traducción

La versión inglesa permite preparar las mismas asignaturas de Primaria del currículo español LOMLOE. Conserva los cursos, contextos de España, fechas, instituciones, unidades métricas, euros y notación numérica española. Se emplea inglés británico y vocabulario adecuado al ciclo. No se adapta el temario a programas escolares del Reino Unido o Estados Unidos.

Se traducen títulos, microlecciones, instrucciones, pistas, explicaciones, lecturas y respuestas mostradas. En Lengua Castellana, los ejemplos, palabras y textos cuya forma en español determina la respuesta deben conservarse en español: la asignatura sigue enseñando español aunque las instrucciones se presenten en inglés. La lectura en voz alta distingue el idioma de las instrucciones y el del pasaje o frase de estudio.

Las referencias y etiquetas oficiales `lomloe` se conservan literalmente en español, junto con sus identificadores. El desplegable para familias y docentes explica esta decisión en la versión inglesa. No son una traducción jurídica del currículo.

## Traducciones realizadas localmente

Todos los bloques contabilizados se han traducido aquí y comprobado frente a su original. La tabla se actualiza desde el registro de revisión; cada celda indica temas terminados y total de temas.

<!-- progress:start -->
| Curso | Naturales | Sociales | Matemáticas | Lengua | Inglés |
| --- | --- | --- | --- | --- | --- |
| 1.º | 7/7 | 7/7 | 8/8 | 8/8 | 8/8 |
| 2.º | 7/7 | 7/7 | 8/8 | 8/8 | 8/8 |
| 3.º | 8/8 | 7/7 | 8/8 | 8/8 | 8/8 |
| 4.º | 8/8 | 8/8 | 8/8 | 9/9 | 8/8 |
| 5.º | 8/8 | 8/8 | 10/10 | 8/8 | 8/8 |
| 6.º | 8/8 | 8/8 | 8/8 | 8/8 | 8/8 |
<!-- progress:end -->

Guerra Civil y franquismo conserva el golpe de julio de 1936, el fin de la guerra en abril de 1939, la extensión de la dictadura, las restricciones de derechos, el exilio y la Transición posterior a 1975. Reproducción y pubertad conserva los distintos ritmos de desarrollo, la maduración de óvulos, la producción de espermatozoides, la división celular anterior a la implantación, la función de la placenta y el respeto a la intimidad.

## Archivos y aplicación

Los originales siguen en `content/activities/<curso>/<asignatura>/<tema>.json`. Las traducciones se guardan en `content/activities/en/<curso>/<asignatura>/<tema>.json`. Ambos idiomas usan los mismos identificadores de actividades y claves de progreso; cambiar el idioma conserva estrellas y referencias a errores.

El registro generado contiene los 238 temas en cada idioma y selecciona su versión inglesa cuando el idioma activo es inglés. Conserva una reserva al original español para futuras incorporaciones aún sin traducir, con aviso de idioma. La cobertura inglesa real se puede consultar en `ACTIVITY_SETS_BY_LOCALE.en`; ese acceso con reserva no cuenta como traducción.

Lecciones, selección de temas, exámenes, repaso de errores, buscador, mapa, álbum y navegación usan el idioma activo. Los títulos de recursos antiguos hechos a mano pueden seguir en español: son recursos distintos de los 238 JSON y quedan fuera de este catálogo traducido.

`meta.translation` registra procedencia, fecha y SHA-256 de la representación JSON del original. `meta.reviewed` permanece en `false`, pues indica revisión por un docente, que no sustituye esta revisión realizada en el chat.

El [registro de revisión](traduccion-actividades-en.json) contiene los 238 temas terminados y las notas de cada tanda. Guarda las huellas del original y de la traducción: si uno cambia, el tema deja de contar como terminado hasta que se vuelva a revisar. Su estado `completed` corresponde a esta revisión de traducción; no acredita revisión docente.

## Validación final

```sh
node scripts/generate-activities.mjs --registry
node scripts/validate-translations.mjs
node --test scripts/validate-translations.test.mjs scripts/activity-speech.test.mjs
npx tsc --noEmit
```

El validador exige que coincidan identificadores, número de ejercicios, soluciones, índices de categorías, estructura y referencias LOMLOE. Detecta traducciones obsoletas, opciones repetidas, huecos inválidos, campos vacíos y lecturas excesivamente largas. También obliga a conservar los pasajes de Lengua Castellana. Estas comprobaciones estructurales necesitan complementarse con revisión del significado y de la respuesta correcta; no demuestran por sí solas la calidad de la traducción.

Comprobaciones realizadas en esta entrega:

- Catálogo completo: 238 JSON ingleses, 2.351 actividades, cero pendientes y cero errores; el validador termina con código 0. Las soluciones, identificadores y referencias LOMLOE coinciden con los originales actuales.
- Las 15 pruebas pasan: 11 de validación/importación y 4 de selección del idioma de voz. Cubren soluciones alteradas, opciones duplicadas, originales modificados, pistas omitidas, cambios curriculares y ejemplos españoles dentro de instrucciones inglesas.
- TypeScript, lint de los 27 archivos de código modificados o nuevos y `git diff --check` pasan. Las 238 huellas del informe pedagógico corresponden a los originales actuales; el registro contiene los 238 bloques de cada idioma.
- La compilación de producción (`npm run build`) pasa. Para esta comprobación se usó una caché SWC temporal escribible y acceso de red para que Next.js descargara la fuente Nunito de Google Fonts; no se modificaron dependencias ni la configuración del proyecto.
- En el navegador se comprobó la lección de pubertad en ambos idiomas, la conservación de su primera respuesta correcta y su explicación, la selección de ese tema en un examen inglés y el aviso de un tema aún disponible solo en español.

## Trabajo por tandas en este chat

Por indicación del usuario, las traducciones se escriben y revisan aquí. `scripts/translate-activities.mjs` es una herramienta local de importación e inventario: no usa credenciales, llamadas de red ni servicios externos de traducción.

La revisión se realizó en tandas pequeñas, habitualmente de 2 a 5 JSON:

1. Leer los originales completos y comprobar qué conceptos y ejemplos deben conservarse.
2. Traducir todos los textos visibles con inglés adecuado al curso, manteniendo el contexto español y las referencias LOMLOE.
3. Resolver los ejercicios traducidos y comparar respuestas, alternativas, relaciones, categorías, secuencias y preguntas de lectura con el original. La conservación automática de índices no basta para esta comprobación.
4. Importar y validar la tanda, regenerar el registro de la aplicación y registrar los temas revisados con notas concretas.
5. Actualizar este informe y consultar el inventario antes de la siguiente tanda.

El importador exige todas las traducciones, incluidas las pistas, y rechaza cambios en soluciones, cantidades, identidad y alineación curricular antes de escribir. El registro solo marca un tema como terminado cuando se declara expresamente que se ha revisado su significado y sus respuestas.

```sh
node scripts/translate-activities.mjs --status
node scripts/translate-activities.mjs --next 4
node scripts/translate-activities.mjs --read 6/sociales/ciudadania-digital
# Una tanda preparada y revisada contiene { sets, notes }:
node scripts/translate-activities.mjs --import /tmp/tanda-revisada.json
node scripts/generate-activities.mjs --registry
```

El objetivo acordado se ha completado: todos los originales tienen versión inglesa revisada. Se priorizaron Naturales y Sociales y se continuó con las demás asignaturas. El registro permite detectar cambios posteriores y revisar únicamente los temas afectados.

Durante la traducción se corrigió una alternativa contradictoria del ejercicio de sombras de Naturales de 5.º en ambos idiomas. La solución se conserva y la corrección consta también en el registro de revisión pedagógica.

En reciclaje de 4.º se aclararon dos pistas: la resta corresponde al total de una misma semana y el contenedor verde recoge envases de vidrio, no todos los objetos hechos de vidrio. Los originales y sus huellas de revisión se actualizaron junto con la traducción.

La composición actual de la UE usada en Sociales de 4.º se contrastó con la [lista oficial de países miembros](https://european-union.europa.eu/principles-countries-history/eu-countries_en) y [EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=legissum%3Amember_states): 27 países, con España, Francia, Italia y Alemania; Reino Unido y Suiza no pertenecen a la UE.

En el ciclo animal de 2.º se ajustaron dos explicaciones de lectura que añadían detalles ausentes del pasaje: Aisha observa una oruga que come hojas, sin alimentarla, y la mariposa que sale de la crisálida no se describe como brillante. La corrección consta en ambos idiomas y en el informe pedagógico.

En hábitos saludables de 2.º, el hueco sobre higiene bucal identifica restos tras una comida. La explicación recomienda cepillado dos veces al día con pasta con flúor, incluida una antes de dormir, conforme a la [guía infantil del NHS](https://www.nhs.uk/Live-well/healthy-teeth-and-gums/taking-care-of-childrens-teeth/), y conserva la solución original.

La microlección de higiene de 1.º usa la misma recomendación de cepillado que la de 2.º; el ajuste afecta al resumen de ideas, conserva todos los ejercicios y figura en el informe pedagógico.

En Lengua Castellana, los ejemplos españoles incluidos dentro de instrucciones inglesas se marcan con comillas angulares («...»). El reproductor cambia a voz española para esos fragmentos, para las frases con huecos y para los pasajes; las preguntas e instrucciones usan voz inglesa. Cuatro pruebas cubren esa separación y su conservación en las preguntas de lectura.

En Inglés de 2.º se aclaró que brother también puede ser un hermano adulto y que la terminación -ty corresponde a las decenas de 20 a 90, sin incluir ten. En descripciones físicas de 3.º, las parejas se presentan como rasgos que contrastan, sin afirmar que todos son antónimos ni reducir los colores y formas del pelo a dos posibilidades. Los originales y sus huellas pedagógicas se actualizaron; las soluciones permanecen iguales.

En Lengua de 3.º se afinó la explicación de una contradicción descriptiva: se refiere a una misma superficie seca y cubierta de agua, sin afirmar que los desiertos nunca tengan lagos. El ejercicio de sílaba tónica usa una lista de palabras en lugar de un pareado, porque león y pared no riman. Ambos ajustes están en los dos idiomas y mantienen las soluciones.

Durante la traducción de Lengua de 4.º se han afinado tres actividades del original español, manteniendo las soluciones: la clasificación de prefijos/sufijos identifica expresamente los afijos estudiados; «asustado»/«aliviado» se presenta como contraste contextual del relato; la regla sobre el verbo en el predicado se delimita a una oración sencilla.

En Inglés de 4.º, el umbral de fiebre y la búsqueda de ayuda dental se contrastaron con las páginas del NHS sobre [fiebre infantil](https://www.nhs.uk/symptoms/fever-in-children/) y [dolor dental](https://www.nhs.uk/symptoms/toothache/). La libra y su división en peniques se comprobaron con la [Royal Mint](https://www.royalmintmuseum.org.uk/learning/learning-zone/going-decimal/). Se consultaron fuentes públicas para verificar hechos, sin enviar actividades a servicios de traducción.

En Inglés de 5.º se ha añadido el sujeto explícito de una pregunta sobre «be going to» y se han ajustado dos explicaciones de la lectura medioambiental a lo que realmente cuenta el texto, manteniendo las soluciones. Se contrastaron las fechas de Thanksgiving con [USAGov](https://www.usa.gov/es/dia-accion-gracias) y [Canada.ca](https://www.canada.ca/en/library-archives/services/public/visit/holiday-closures.html), la comparación ambiental tren/avión con la [Agencia Europea de Medio Ambiente](https://www.eea.europa.eu/en/analysis/publications/transport-and-environment-report-2020) y el descanso de pantallas antes de dormir con [NHS Healthier Together, 5–12 años](https://www.healthiertogether.nhs.uk/child-under-12-years/healthy-sleep). Las noticias escolares usadas como lectura son relatos inventados, no resultados de estudios reales.

En Lengua de 5.º se ha aclarado que el brote de la lectura procede de un bancal sembrado días antes; se han diferenciado las funciones de conjunción/preposición con ejemplos; y la clasificación del diccionario se centra en la forma del lema, reconociendo que algunos buscadores aceptan formas flexionadas. Se conservan las soluciones y la lengua castellana de los textos y ejemplos que se analizan.

En Matemáticas de 5.º se han afinado los límites del ángulo obtuso, eliminado la descripción «suave» de una rampa de 40° y sustituido un distractor que podía explicar también el error de redondeo. La traducción mantiene la notación numérica española y las unidades; el ejemplo de aniversario conserva 2024 como año hipotético del problema.

En la última fase se alineó la explicación de fracciones de 5.º con la operación presentada. En Lengua de 6.º se eliminó una incoherencia entre mayo e invierno en una lectura, se precisó la regla de los adverbios en -mente y una pista de j, y se corrigieron los nombres intercambiados de Nerea y Carlos. En estadística se aclaró que el 75 % corresponde a caminar y bicicleta, sin excluir al autobús como transporte sostenible. Todos estos cambios se reflejan en los originales, sus traducciones y el anexo pedagógico, sin cambiar soluciones.

Las comprobaciones finales contrastaron la [actividad física para niños y adolescentes de la OMS](https://www.who.int/europe/news-room/fact-sheets/item/physical-activity), la [protección del casco según la DGT](https://revista.dgt.es/es/noticias/nacional/2021/04ABRIL/0423ninos-en-bici-seguros.shtml), la [altura del Teide según el IGN](https://educativo.ign.es/atlas-didactico/relieve-eso/el_relieve_insular.html), la [acentuación de adverbios en -mente según FundéuRAE](https://www.fundeu.es/recomendacion/acentuacion-casos-especiales/) y el [origen de papa explicado por la Academia Mexicana de la Lengua](https://academia.org.mx/consultas/obras-de-consulta-en-linea/diccionario-minucias-del-lenguaje/item/papa-patata).

El anexo registra, además de la revisión amplia inicial, ajustes posteriores detectados al traducir en 25 archivos y 28 actividades, más una microlección. No se suman esos recuentos a los de la revisión inicial porque puede haber actividades intervenidas en ambas fases.
