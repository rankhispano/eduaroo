---
name: Creador de Habilidades
description: Habilidad para crear nuevas habilidades (skills) en español siguiendo el formato estándar de Antigravity
---

# Creador de Habilidades

Esta habilidad te guía para crear nuevas habilidades (skills) que extiendan las capacidades del asistente de IA.

## ¿Qué es una Habilidad?

Una habilidad es una carpeta con instrucciones, scripts y recursos que extienden las capacidades del agente para tareas especializadas. Cada carpeta de habilidad contiene:

- **SKILL.md** (obligatorio): El archivo principal de instrucciones con frontmatter YAML e instrucciones detalladas en markdown
- **scripts/** (opcional): Scripts auxiliares y utilidades
- **examples/** (opcional): Implementaciones de referencia y patrones de uso
- **resources/** (opcional): Archivos adicionales, plantillas o assets

## Estructura del Archivo SKILL.md

```markdown
---
name: [Nombre de la Habilidad]
description: [Descripción breve de qué hace la habilidad]
---

# [Nombre de la Habilidad]

[Descripción detallada del propósito de la habilidad]

## Cuándo Usar Esta Habilidad

[Lista de situaciones o triggers para usar esta habilidad]

## Instrucciones

[Pasos detallados y claros de cómo ejecutar la habilidad]

## Ejemplos

[Ejemplos prácticos de uso si aplica]

## Notas Adicionales

[Consideraciones especiales, limitaciones, etc.]
```

## Pasos para Crear una Nueva Habilidad

### 1. Identificar el Propósito
- Define claramente qué problema resuelve la habilidad
- Identifica los casos de uso principales
- Determina si necesita recursos adicionales (scripts, ejemplos, etc.)

### 2. Crear la Estructura de Carpetas

```
.agent/skills/[nombre-habilidad]/
├── SKILL.md           # Archivo principal (obligatorio)
├── scripts/           # Scripts auxiliares (opcional)
├── examples/          # Ejemplos de uso (opcional)
└── resources/         # Recursos adicionales (opcional)
```

### 3. Escribir el Archivo SKILL.md

El archivo debe incluir:

1. **Frontmatter YAML**:
   - `name`: Nombre corto y descriptivo
   - `description`: Una línea que describe la funcionalidad

2. **Contenido en Markdown**:
   - Título principal coincidente con el nombre
   - Descripción detallada del propósito
   - Lista de situaciones donde aplicar la habilidad
   - Instrucciones paso a paso claras y específicas
   - Ejemplos prácticos cuando sea útil

### 4. Mejores Prácticas

- **Sé específico**: Evita instrucciones vagas, sé preciso sobre qué hacer
- **Define condiciones de parada**: Indica claramente cuándo la habilidad ha terminado
- **Incluye contexto necesario**: Proporciona toda la información que el agente necesita
- **Usa formato markdown**: Aprovecha listas, código, tablas para mayor claridad
- **Escribe en español**: Mantén todas las instrucciones en español para este workspace

## Ejemplo de Habilidad Simple

```markdown
---
name: Deploy a Producción
description: Pasos para desplegar la aplicación a producción de forma segura
---

# Deploy a Producción

Esta habilidad guía el proceso de despliegue seguro a producción.

## Cuándo Usar

- El usuario solicita un deploy a producción
- Se necesita publicar cambios en el entorno live

## Instrucciones

1. Verificar que todos los tests pasen:
   ```bash
   npm run test
   ```

2. Crear build de producción:
   ```bash
   npm run build
   ```

3. Verificar que no hay errores de TypeScript:
   ```bash
   npm run type-check
   ```

4. Ejecutar deploy:
   ```bash
   npm run deploy
   ```

5. Verificar que la aplicación funciona correctamente en producción

## Notas

- Siempre hacer backup antes de un deploy mayor
- Notificar al equipo antes de desplegar
```

## Ubicación de las Habilidades

Las habilidades deben crearse en:
```
/Users/nik/Projects/random/eduaroo/.agent/skills/[nombre-habilidad]/SKILL.md
```

## Comandos Útiles

Para crear una nueva habilidad rápidamente:
1. Crear la carpeta: `mkdir -p .agent/skills/[nombre-habilidad]`
2. Crear el archivo: Escribir `SKILL.md` siguiendo la plantilla de arriba
