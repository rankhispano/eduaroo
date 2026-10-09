#!/usr/bin/env node
// Genera el set de iconos a partir de app/icon.png (258×260). Ejecutar solo si cambia el icono.
//   node scripts/seo/generate-icons.mjs
// El icono origen es pequeño: pedir al equipo un maestro ≥1024 px para nitidez en 512.
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SRC = 'app/icon.png';
const BG = { r: 125, g: 211, b: 252, alpha: 1 }; // cielo del icono (#7DD3FC)

const square = (size, inner = 1, background = { r: 0, g: 0, b: 0, alpha: 0 }) =>
    sharp(SRC)
        .resize(Math.round(size * inner), Math.round(size * inner), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .extend({
            top: Math.floor((size - Math.round(size * inner)) / 2),
            bottom: Math.ceil((size - Math.round(size * inner)) / 2),
            left: Math.floor((size - Math.round(size * inner)) / 2),
            right: Math.ceil((size - Math.round(size * inner)) / 2),
            background,
        })
        .png();

await square(180, 1, BG).toFile('app/apple-icon.png');
await square(192).toFile('public/icons/icon-192.png');
await square(512).toFile('public/icons/icon-512.png');
// Maskable: contenido dentro del 80 % central sobre fondo opaco
await square(512, 0.8, BG).toFile('public/icons/icon-maskable-512.png');

// favicon.ico con PNG de 32×32 incrustado
const png32 = await square(32).toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6); header.writeUInt8(32, 7); header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
header.writeUInt32LE(png32.length, 14); header.writeUInt32LE(22, 18);
writeFileSync('app/favicon.ico', Buffer.concat([header, png32]));
await square(32).toFile('public/icons/favicon-32.png');
console.log('Iconos generados');
