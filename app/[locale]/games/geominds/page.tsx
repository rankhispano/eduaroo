'use client';

import * as React from 'react';
import {
    RefreshCw, Trophy, ChevronRight, ChevronLeft,
    Lightbulb, Grid
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const { useState, useEffect, useRef } = React;

// --- CONSTANTES ---
const SIZE = 60; // Unidad base

// Definición geométrica base de las piezas (Centradas en 0,0 para rotación)
const PIECES_DEF = {
    bigTri: {
        id: 'bt',
        // Base 240, Altura 120. (Hipotenusa abajo en rotación 0)
        points: [{ x: -2 * SIZE, y: -SIZE }, { x: 2 * SIZE, y: -SIZE }, { x: 0, y: SIZE }],
        path: `M ${-2 * SIZE},${-SIZE} L ${2 * SIZE},${-SIZE} L ${0},${SIZE} Z`,
        areaWeight: 4
    },
    midTri: {
        id: 'mt',
        // Catetos 120. (Esquina recta abajo-izq en rotación 0)
        points: [{ x: -SIZE, y: -SIZE }, { x: SIZE, y: SIZE }, { x: -SIZE, y: SIZE }],
        path: `M ${-SIZE},${-SIZE} L ${SIZE},${SIZE} L ${-SIZE},${SIZE} Z`,
        areaWeight: 2
    },
    smallTri: {
        id: 'st',
        // Base 120, Altura 60.
        points: [{ x: -SIZE, y: -0.5 * SIZE }, { x: SIZE, y: -0.5 * SIZE }, { x: 0, y: 0.5 * SIZE }],
        path: `M ${-SIZE},${-0.5 * SIZE} L ${SIZE},${-0.5 * SIZE} L ${0},${0.5 * SIZE} Z`,
        areaWeight: 1
    },
    square: {
        id: 'sq',
        // Diagonal 120. Lado ~85.
        points: [{ x: 0, y: -SIZE }, { x: SIZE, y: 0 }, { x: 0, y: SIZE }, { x: -SIZE, y: 0 }],
        path: `M ${0},${-SIZE} L ${SIZE},${0} L ${0},${SIZE} L ${-SIZE},${0} Z`,
        areaWeight: 2
    },
    rhombus: {
        id: 'rh',
        // Paralelogramo
        points: [{ x: -1.5 * SIZE, y: 0.5 * SIZE }, { x: -0.5 * SIZE, y: -0.5 * SIZE }, { x: 1.5 * SIZE, y: -0.5 * SIZE }, { x: 0.5 * SIZE, y: 0.5 * SIZE }],
        path: `M ${-1.5 * SIZE},${0.5 * SIZE} L ${-0.5 * SIZE},${-0.5 * SIZE} L ${1.5 * SIZE},${-0.5 * SIZE} L ${0.5 * SIZE},${0.5 * SIZE} Z`,
        areaWeight: 2
    }
};

// --- CONFIGURACIÓN DEL CUADRADO INICIAL (Geometría Standard) ---
// Coordenadas calculadas para formar un cuadrado de 240x240 (4*SIZE)
const X0 = 100;
const Y0 = 100;

const PERFECT_SQUARE_PIECES = [
    // Triángulo Grande 1 (Izquierda vertical)
    { ...PIECES_DEF.bigTri, id: 'p1', color: '#3B82F6', x: X0 + 60, y: Y0 + 120, rotation: 270 },
    // Triángulo Grande 2 (Arriba horizontal)
    { ...PIECES_DEF.bigTri, id: 'p2', color: '#EF4444', x: X0 + 120, y: Y0 + 60, rotation: 0 },
    // Triángulo Mediano (Esquina inferior derecha)
    { ...PIECES_DEF.midTri, id: 'p3', color: '#EAB308', x: X0 + 180, y: Y0 + 180, rotation: 0 },
    // Triángulo Pequeño 1 (Centro arriba)
    { ...PIECES_DEF.smallTri, id: 'p4', color: '#10B981', x: X0 + 180, y: Y0 + 90, rotation: 270 },
    // Triángulo Pequeño 2 (Centro derecha)
    { ...PIECES_DEF.smallTri, id: 'p5', color: '#8B5CF6', x: X0 + 150, y: Y0 + 120, rotation: 0 },
    // Cuadrado (Centro inclinado)
    { ...PIECES_DEF.square, id: 'p6', color: '#F97316', x: X0 + 180, y: Y0 + 120, rotation: 45 }, // Ojo: 45 grados para encajar
    // Romboide (Esquina inferior izquierda)
    { ...PIECES_DEF.rhombus, id: 'p7', color: '#06B6D4', x: X0 + 60, y: Y0 + 180, rotation: 90 }
];

// --- NIVELES
const RAW_LEVELS = [
    { id: "boat", shapes: [{ points: [{ x: 250, y: 450 }, { x: 280, y: 420 }, { x: 310, y: 390 }, { x: 340, y: 360 }, { x: 370, y: 330 }, { x: 400, y: 360 }, { x: 430, y: 390 }, { x: 460, y: 420 }, { x: 490, y: 450 }, { x: 430, y: 450 }, { x: 370, y: 450 }, { x: 310, y: 450 }] }, { points: [{ x: 280, y: 420 }, { x: 280, y: 360 }, { x: 280, y: 300 }, { x: 280, y: 240 }, { x: 280, y: 180 }, { x: 310, y: 210 }, { x: 340, y: 240 }, { x: 370, y: 270 }, { x: 400, y: 300 }, { x: 370, y: 330 }, { x: 340, y: 360 }, { x: 310, y: 390 }] }, { points: [{ x: 295, y: 535 }, { x: 210, y: 535 }, { x: 125, y: 450 }, { x: 210, y: 450 }] }, { points: [{ x: 280, y: 250 }, { x: 280, y: 335 }, { x: 195, y: 335 }] }, { points: [{ x: 195, y: 335 }, { x: 238, y: 335 }, { x: 280, y: 335 }, { x: 280, y: 378 }, { x: 280, y: 420 }, { x: 238, y: 420 }, { x: 195, y: 420 }, { x: 195, y: 378 }] }, { points: [{ x: 110, y: 420 }, { x: 195, y: 335 }, { x: 195, y: 420 }] }, { points: [{ x: 210, y: 450 }, { x: 295, y: 450 }, { x: 380, y: 450 }, { x: 337, y: 493 }, { x: 295, y: 535 }, { x: 253, y: 493 }] }] },
    { id: "sail", shapes: [{ points: [{ x: 100, y: 540 }, { x: 130, y: 510 }, { x: 160, y: 480 }, { x: 190, y: 450 }, { x: 220, y: 420 }, { x: 250, y: 450 }, { x: 280, y: 480 }, { x: 310, y: 510 }, { x: 340, y: 540 }, { x: 280, y: 540 }, { x: 220, y: 540 }, { x: 160, y: 540 }] }, { points: [{ x: 160, y: 480 }, { x: 160, y: 420 }, { x: 160, y: 360 }, { x: 160, y: 300 }, { x: 160, y: 240 }, { x: 190, y: 270 }, { x: 220, y: 300 }, { x: 250, y: 330 }, { x: 280, y: 360 }, { x: 250, y: 390 }, { x: 220, y: 420 }, { x: 190, y: 450 }] }, { points: [{ x: 305, y: -40 }, { x: 305, y: 45 }, { x: 220, y: 130 }, { x: 220, y: 45 }] }, { points: [{ x: 280, y: 480 }, { x: 220, y: 420 }, { x: 280, y: 360 }] }, { points: [{ x: 178, y: 130 }, { x: 220, y: 130 }, { x: 262, y: 130 }, { x: 262, y: 173 }, { x: 262, y: 215 }, { x: 220, y: 215 }, { x: 178, y: 215 }, { x: 178, y: 173 }] }, { points: [{ x: 280, y: 240 }, { x: 280, y: 360 }, { x: 220, y: 300 }] }, { points: [{ x: 135, y: 215 }, { x: 220, y: 215 }, { x: 305, y: 215 }, { x: 262, y: 258 }, { x: 220, y: 300 }, { x: 178, y: 258 }] }] },
    { id: "rocket", shapes: [{ points: [{ x: 270, y: 390 }, { x: 240, y: 360 }, { x: 210, y: 330 }, { x: 180, y: 300 }, { x: 150, y: 270 }, { x: 180, y: 240 }, { x: 210, y: 210 }, { x: 240, y: 180 }, { x: 270, y: 150 }, { x: 270, y: 210 }, { x: 270, y: 270 }, { x: 270, y: 330 }] }, { points: [{ x: 150, y: 510 }, { x: 150, y: 450 }, { x: 150, y: 390 }, { x: 150, y: 330 }, { x: 150, y: 270 }, { x: 180, y: 300 }, { x: 210, y: 330 }, { x: 240, y: 360 }, { x: 270, y: 390 }, { x: 240, y: 420 }, { x: 210, y: 450 }, { x: 180, y: 480 }] }, { points: [{ x: 90, y: 570 }, { x: 150, y: 510 }, { x: 270, y: 510 }, { x: 210, y: 570 }] }, { points: [{ x: 210, y: 570 }, { x: 270, y: 510 }, { x: 330, y: 570 }] }, { points: [{ x: 150, y: 150 }, { x: 180, y: 120 }, { x: 210, y: 90 }, { x: 240, y: 120 }, { x: 270, y: 150 }, { x: 240, y: 180 }, { x: 210, y: 210 }, { x: 180, y: 180 }] }, { points: [{ x: 150, y: 270 }, { x: 150, y: 150 }, { x: 210, y: 210 }] }, { points: [{ x: 150, y: 510 }, { x: 210, y: 450 }, { x: 270, y: 390 }, { x: 270, y: 450 }, { x: 270, y: 510 }, { x: 210, y: 510 }] }] },
    { id: "chair", shapes: [{ points: [{ x: 358, y: 305 }, { x: 358, y: 348 }, { x: 358, y: 390 }, { x: 358, y: 433 }, { x: 358, y: 475 }, { x: 315, y: 475 }, { x: 273, y: 475 }, { x: 230, y: 475 }, { x: 188, y: 475 }, { x: 230, y: 433 }, { x: 273, y: 390 }, { x: 315, y: 348 }] }, { points: [{ x: 272, y: 390 }, { x: 230, y: 432 }, { x: 188, y: 475 }, { x: 145, y: 517 }, { x: 103, y: 560 }, { x: 103, y: 517 }, { x: 103, y: 475 }, { x: 103, y: 432 }, { x: 103, y: 390 }, { x: 145, y: 390 }, { x: 188, y: 390 }, { x: 230, y: 390 }] }, { points: [{ x: 357, y: 220 }, { x: 357, y: 305 }, { x: 272, y: 390 }, { x: 272, y: 305 }] }, { points: [{ x: 188, y: 475 }, { x: 188, y: 560 }, { x: 103, y: 560 }] }, { points: [{ x: 273, y: 475 }, { x: 316, y: 475 }, { x: 358, y: 475 }, { x: 358, y: 517 }, { x: 358, y: 560 }, { x: 316, y: 560 }, { x: 273, y: 560 }, { x: 273, y: 517 }] }, { points: [{ x: 357, y: 220 }, { x: 272, y: 135 }, { x: 357, y: 135 }] }, { points: [{ x: 272, y: 305 }, { x: 272, y: 220 }, { x: 272, y: 135 }, { x: 315, y: 178 }, { x: 357, y: 220 }, { x: 315, y: 262 }] }] },
    { id: "house", shapes: [{ points: [{ x: 70, y: 440 }, { x: 100, y: 410 }, { x: 130, y: 380 }, { x: 160, y: 350 }, { x: 190, y: 320 }, { x: 220, y: 350 }, { x: 250, y: 380 }, { x: 280, y: 410 }, { x: 310, y: 440 }, { x: 250, y: 440 }, { x: 190, y: 440 }, { x: 130, y: 440 }] }, { points: [{ x: 350, y: 560 }, { x: 290, y: 560 }, { x: 230, y: 560 }, { x: 170, y: 560 }, { x: 110, y: 560 }, { x: 140, y: 530 }, { x: 170, y: 500 }, { x: 200, y: 470 }, { x: 230, y: 440 }, { x: 260, y: 470 }, { x: 290, y: 500 }, { x: 320, y: 530 }] }, { points: [{ x: 225, y: 355 }, { x: 310, y: 355 }, { x: 395, y: 440 }, { x: 310, y: 440 }] }, { points: [{ x: 350, y: 440 }, { x: 290, y: 500 }, { x: 230, y: 440 }] }, { points: [{ x: 225, y: 270 }, { x: 267, y: 270 }, { x: 310, y: 270 }, { x: 310, y: 313 }, { x: 310, y: 355 }, { x: 267, y: 355 }, { x: 225, y: 355 }, { x: 225, y: 313 }] }, { points: [{ x: 350, y: 440 }, { x: 350, y: 560 }, { x: 290, y: 500 }] }, { points: [{ x: 230, y: 440 }, { x: 170, y: 500 }, { x: 110, y: 560 }, { x: 110, y: 500 }, { x: 110, y: 440 }, { x: 170, y: 440 }] }] },
    { id: "pyramid", shapes: [{ points: [{ x: 182, y: 368 }, { x: 182, y: 410 }, { x: 182, y: 452 }, { x: 182, y: 495 }, { x: 182, y: 537 }, { x: 140, y: 537 }, { x: 98, y: 537 }, { x: 55, y: 537 }, { x: 13, y: 537 }, { x: 55, y: 495 }, { x: 98, y: 452 }, { x: 140, y: 410 }] }, { points: [{ x: 352, y: 367 }, { x: 394, y: 410 }, { x: 437, y: 452 }, { x: 479, y: 495 }, { x: 522, y: 537 }, { x: 479, y: 537 }, { x: 437, y: 537 }, { x: 394, y: 537 }, { x: 352, y: 537 }, { x: 352, y: 495 }, { x: 352, y: 452 }, { x: 352, y: 410 }] }, { points: [{ x: 352, y: 367 }, { x: 352, y: 452 }, { x: 267, y: 537 }, { x: 267, y: 452 }] }, { points: [{ x: 267, y: 452 }, { x: 267, y: 537 }, { x: 182, y: 537 }] }, { points: [{ x: 207, y: 392 }, { x: 237, y: 362 }, { x: 267, y: 332 }, { x: 297, y: 362 }, { x: 327, y: 392 }, { x: 297, y: 422 }, { x: 267, y: 452 }, { x: 237, y: 422 }] }, { points: [{ x: 267, y: 537 }, { x: 352, y: 452 }, { x: 352, y: 537 }] }, { points: [{ x: 182, y: 537 }, { x: 182, y: 452 }, { x: 182, y: 367 }, { x: 224, y: 410 }, { x: 267, y: 452 }, { x: 224, y: 494 }] }] },
    { id: "apple", shapes: [{ points: [{ x: 200, y: 310 }, { x: 230, y: 340 }, { x: 260, y: 370 }, { x: 290, y: 400 }, { x: 320, y: 430 }, { x: 290, y: 460 }, { x: 260, y: 490 }, { x: 230, y: 520 }, { x: 200, y: 550 }, { x: 200, y: 490 }, { x: 200, y: 430 }, { x: 200, y: 370 }] }, { points: [{ x: 200, y: 310 }, { x: 200, y: 370 }, { x: 200, y: 430 }, { x: 200, y: 490 }, { x: 200, y: 550 }, { x: 170, y: 520 }, { x: 140, y: 490 }, { x: 110, y: 460 }, { x: 80, y: 430 }, { x: 110, y: 400 }, { x: 140, y: 370 }, { x: 170, y: 340 }] }, { points: [{ x: 285, y: 125 }, { x: 285, y: 210 }, { x: 200, y: 295 }, { x: 200, y: 210 }] }, { points: [{ x: 80, y: 310 }, { x: 140, y: 370 }, { x: 80, y: 430 }] }, { points: [{ x: 80, y: 310 }, { x: 110, y: 280 }, { x: 140, y: 250 }, { x: 170, y: 280 }, { x: 200, y: 310 }, { x: 170, y: 340 }, { x: 140, y: 370 }, { x: 110, y: 340 }] }, { points: [{ x: 320, y: 310 }, { x: 200, y: 310 }, { x: 260, y: 250 }] }, { points: [{ x: 320, y: 430 }, { x: 260, y: 370 }, { x: 200, y: 310 }, { x: 260, y: 310 }, { x: 320, y: 310 }, { x: 320, y: 370 }] }] },
    { id: "duck", shapes: [{ points: [{ x: 370, y: 550 }, { x: 340, y: 520 }, { x: 310, y: 490 }, { x: 280, y: 460 }, { x: 250, y: 430 }, { x: 280, y: 400 }, { x: 310, y: 370 }, { x: 340, y: 340 }, { x: 370, y: 310 }, { x: 370, y: 370 }, { x: 370, y: 430 }, { x: 370, y: 490 }] }, { points: [{ x: 190, y: 250 }, { x: 250, y: 250 }, { x: 310, y: 250 }, { x: 370, y: 250 }, { x: 430, y: 250 }, { x: 400, y: 280 }, { x: 370, y: 310 }, { x: 340, y: 340 }, { x: 310, y: 370 }, { x: 280, y: 340 }, { x: 250, y: 310 }, { x: 220, y: 280 }] }, { points: [{ x: 70, y: 490 }, { x: 130, y: 430 }, { x: 250, y: 430 }, { x: 190, y: 490 }] }, { points: [{ x: 130, y: 190 }, { x: 190, y: 250 }, { x: 130, y: 310 }] }, { points: [{ x: 130, y: 310 }, { x: 160, y: 280 }, { x: 190, y: 250 }, { x: 220, y: 280 }, { x: 250, y: 310 }, { x: 220, y: 340 }, { x: 190, y: 370 }, { x: 160, y: 340 }] }, { points: [{ x: 310, y: 490 }, { x: 190, y: 490 }, { x: 250, y: 430 }] }, { points: [{ x: 130, y: 310 }, { x: 190, y: 370 }, { x: 250, y: 430 }, { x: 190, y: 430 }, { x: 130, y: 430 }, { x: 130, y: 370 }] }] },
    { id: "triangle", shapes: [{ points: [{ x: 260, y: 550 }, { x: 290, y: 520 }, { x: 320, y: 490 }, { x: 350, y: 460 }, { x: 380, y: 430 }, { x: 410, y: 460 }, { x: 440, y: 490 }, { x: 470, y: 520 }, { x: 500, y: 550 }, { x: 440, y: 550 }, { x: 380, y: 550 }, { x: 320, y: 550 }] }, { points: [{ x: 260, y: 550 }, { x: 200, y: 550 }, { x: 140, y: 550 }, { x: 80, y: 550 }, { x: 20, y: 550 }, { x: 50, y: 520 }, { x: 80, y: 490 }, { x: 110, y: 460 }, { x: 140, y: 430 }, { x: 170, y: 460 }, { x: 200, y: 490 }, { x: 230, y: 520 }] }, { points: [{ x: 200, y: 490 }, { x: 260, y: 430 }, { x: 380, y: 430 }, { x: 320, y: 490 }] }, { points: [{ x: 320, y: 490 }, { x: 260, y: 550 }, { x: 200, y: 490 }] }, { points: [{ x: 140, y: 430 }, { x: 170, y: 400 }, { x: 200, y: 370 }, { x: 230, y: 400 }, { x: 260, y: 430 }, { x: 230, y: 460 }, { x: 200, y: 490 }, { x: 170, y: 460 }] }, { points: [{ x: 260, y: 310 }, { x: 260, y: 430 }, { x: 200, y: 370 }] }, { points: [{ x: 260, y: 310 }, { x: 320, y: 370 }, { x: 380, y: 430 }, { x: 320, y: 430 }, { x: 260, y: 430 }, { x: 260, y: 370 }] }] },
    { id: "tv", shapes: [{ points: [{ x: 78, y: 482 }, { x: 78, y: 440 }, { x: 78, y: 398 }, { x: 78, y: 355 }, { x: 78, y: 313 }, { x: 120, y: 313 }, { x: 162, y: 313 }, { x: 205, y: 313 }, { x: 247, y: 313 }, { x: 205, y: 355 }, { x: 162, y: 398 }, { x: 120, y: 440 }] }, { points: [{ x: 78, y: 482 }, { x: 120, y: 440 }, { x: 163, y: 397 }, { x: 205, y: 355 }, { x: 248, y: 312 }, { x: 248, y: 355 }, { x: 248, y: 397 }, { x: 248, y: 440 }, { x: 248, y: 482 }, { x: 205, y: 482 }, { x: 163, y: 482 }, { x: 120, y: 482 }] }, { points: [{ x: 163, y: 482 }, { x: 248, y: 482 }, { x: 333, y: 567 }, { x: 248, y: 567 }] }, { points: [{ x: 333, y: 397 }, { x: 333, y: 482 }, { x: 248, y: 482 }] }, { points: [{ x: 248, y: 312 }, { x: 290, y: 312 }, { x: 333, y: 312 }, { x: 333, y: 354 }, { x: 333, y: 397 }, { x: 290, y: 397 }, { x: 248, y: 397 }, { x: 248, y: 354 }] }, { points: [{ x: 333, y: 397 }, { x: 248, y: 482 }, { x: 248, y: 397 }] }, { points: [{ x: 248, y: 567 }, { x: 163, y: 567 }, { x: 78, y: 567 }, { x: 121, y: 524 }, { x: 163, y: 482 }, { x: 205, y: 524 }] }] }
];

// --- FUNCIONES MATEMÁTICAS ---

// Rotar un punto alrededor del origen (0,0)
const rotatePoint = (x: number, y: number, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
        x: x * Math.cos(rad) - y * Math.sin(rad),
        y: x * Math.sin(rad) + y * Math.cos(rad)
    };
};

const getPolygonCentroid = (points: { x: number, y: number }[]) => {
    let cx = 0, cy = 0, a = 0;
    for (let i = 0; i < points.length; i++) {
        let j = (i + 1) % points.length;
        let p1 = points[i];
        let p2 = points[j];
        let cross = (p1.x * p2.y - p2.x * p1.y);
        a += cross;
        cx += (p1.x + p2.x) * cross;
        cy += (p1.y + p2.y) * cross;
    }
    a *= 0.5;
    if (Math.abs(a) < 1) return points[0];
    return { x: cx / (6 * a), y: cy / (6 * a) };
};

const getPolygonArea = (points: { x: number, y: number }[]) => {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
        let j = (i + 1) % points.length;
        area += points[i].x * points[j].y;
        area -= points[j].x * points[i].y;
    }
    return Math.abs(area / 2);
};

const pointsToSvgPath = (points: { x: number, y: number }[]) => "M " + points.map(p => `${p.x},${p.y}`).join(" L ") + " Z";

const analyzeLevelTargets = (level: any) => {
    return level.shapes.map((shape: any, idx: number) => ({
        id: `target-${idx}`,
        points: shape.points,
        centroid: getPolygonCentroid(shape.points),
        area: getPolygonArea(shape.points),
        svgPath: pointsToSvgPath(shape.points),
        filledBy: null
    }));
};

export default function GeoMindsApp() {
    const t = useTranslations('GamesPage');
    const [levelIndex, setLevelIndex] = useState(0);
    const [targets, setTargets] = useState<any[]>([]);
    const [pieces, setPieces] = useState<any[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLevelComplete, setIsLevelComplete] = useState(false);
    const [showHints, setShowHints] = useState(false);

    const svgRef = useRef<SVGSVGElement>(null);
    const dragInfo = useRef({ isDragging: false, selectedId: null, startX: 0, startY: 0, initialPieceX: 0, initialPieceY: 0, hasMoved: false });

    useEffect(() => {
        loadLevel(levelIndex);
    }, [levelIndex]);

    const loadLevel = (idx: number) => {
        const rawLevel = RAW_LEVELS[idx];
        setTargets(analyzeLevelTargets(rawLevel));
        // Reiniciar piezas con layout de cuadrado perfecto
        setPieces(PERFECT_SQUARE_PIECES.map(p => ({
            ...p,
            isPlaced: false,
            placedTargetId: null,
            exactPath: null,
            rotation: p.rotation // Usar rotación inicial definida
        })));
        setIsLevelComplete(false);
        setShowHints(false);
    };

    const getMousePos = (e: any) => {
        const svg = svgRef.current;
        if (!svg) return { x: 0, y: 0 };
        let pt = svg.createSVGPoint();
        const clientX = e.touches ? e.touches[0].clientX : (e.clientX || e.nativeEvent?.clientX);
        const clientY = e.touches ? e.touches[0].clientY : (e.clientY || e.nativeEvent?.clientY);
        if (clientX === undefined || clientY === undefined) return { x: 0, y: 0 };
        pt.x = clientX;
        pt.y = clientY;
        try {
            const globalPoint = pt.matrixTransform(svg.getScreenCTM()!.inverse());
            return { x: globalPoint.x, y: globalPoint.y };
        } catch (err) {
            return { x: 0, y: 0 };
        }
    };

    const handlePointerDown = (e: any, id: any) => {
        e.stopPropagation();
        e.preventDefault(); // Importante para evitar scroll en móviles
        if (isLevelComplete) return;
        try { e.target.setPointerCapture(e.pointerId); } catch (err) { }

        const piece = pieces.find(p => p.id === id);
        // Si estaba colocada, liberar el target
        if (piece.isPlaced) {
            setTargets(prev => prev.map(t => t.id === piece.placedTargetId ? { ...t, filledBy: null } : t));
        }

        const pos = getMousePos(e);
        dragInfo.current = {
            isDragging: true,
            selectedId: id,
            hasMoved: false,
            startX: pos.x,
            startY: pos.y,
            initialPieceX: piece.x,
            initialPieceY: piece.y
        };

        setPieces(prev => {
            const others = prev.filter(p => p.id !== id);
            return [...others, { ...piece, isPlaced: false, placedTargetId: null }];
        });
    };

    const handlePointerMove = (e: any) => {
        if (!dragInfo.current.isDragging) return;
        e.preventDefault();
        const pos = getMousePos(e);
        const dx = pos.x - dragInfo.current.startX;
        const dy = pos.y - dragInfo.current.startY;

        // Umbral de 5px para considerar movimiento
        if (Math.hypot(dx, dy) > 5) dragInfo.current.hasMoved = true;

        setPieces(prev => prev.map(p => {
            if (p.id === dragInfo.current.selectedId) {
                return { ...p, x: dragInfo.current.initialPieceX + dx, y: dragInfo.current.initialPieceY + dy };
            }
            return p;
        }));
    };

    const handlePointerUp = (e: any) => {
        if (!dragInfo.current.isDragging) return;
        const { selectedId, hasMoved } = dragInfo.current;
        dragInfo.current.isDragging = false;
        try { if (e.target.releasePointerCapture) e.target.releasePointerCapture(e.pointerId); } catch (err) { }

        if (hasMoved) {
            checkPlacement(selectedId);
        } else {
            rotatePiece(selectedId);
        }
    };

    const rotatePiece = (id: any) => {
        setPieces(prev => prev.map(p => p.id === id ? { ...p, rotation: (p.rotation + 45) % 360 } : p));
    };

    // --- LÓGICA DE VALIDACIÓN (DROP) ---
    const checkPlacement = (pieceId: any) => {
        const piece = pieces.find(p => p.id === pieceId);
        let bestTarget: any = null;
        let minVertexDist = 30; // Tolerancia en píxeles para vértices

        // Verificar contra todos los huecos
        for (let target of targets) {
            if (target.filledBy) continue; // Hueco ocupado

            // 1. Filtro rápido por área (Tamaño) para no perder tiempo
            // Big ~14400, Mid ~7200, Small ~3600
            let targetType = 'unknown';
            if (target.area > 10000) targetType = 'big';
            else if (target.area > 5000) targetType = 'mid'; // Incluye Square y Rhombus
            else targetType = 'small';

            let pieceTypeGroup = 'unknown';
            if (piece.areaWeight === 4) pieceTypeGroup = 'big';
            else if (piece.areaWeight === 2) pieceTypeGroup = 'mid';
            else pieceTypeGroup = 'small';

            if (targetType !== pieceTypeGroup) continue;

            // 2. Filtro por distancia del centroide (Aproximación)
            const dist = Math.hypot(piece.x - target.centroid.x, piece.y - target.centroid.y);
            if (dist > 60) continue; // Si está lejos ni miramos

            // 3. VALIDACIÓN ESTRICTA DE VÉRTICES (Forma y Rotación)
            if (checkVerticesMatch(piece, target)) {
                bestTarget = target;
                break;
            }
        }

        if (bestTarget) {
            // Encajar pieza
            setPieces(prev => prev.map(p => {
                if (p.id === pieceId) {
                    return {
                        ...p,
                        x: bestTarget.centroid.x,
                        y: bestTarget.centroid.y,
                        isPlaced: true,
                        placedTargetId: bestTarget.id,
                        exactPath: bestTarget.svgPath
                    };
                }
                return p;
            }));

            setTargets(prev => {
                const newTargets = prev.map(t => t.id === bestTarget.id ? { ...t, filledBy: pieceId } : t);

                // Verificar victoria solo si todos los huecos tienen dueño
                const allFilled = newTargets.every(t => t.filledBy !== null);
                if (allFilled) setIsLevelComplete(true);

                return newTargets;
            });
        }
    };

    // Comprueba si los vértices de la pieza (con su rotación actual) coinciden con los del target
    const checkVerticesMatch = (piece: any, target: any) => {
        // Puntos base centrados en 0,0
        const basePoints = piece.points;

        // Transformar puntos de la pieza al espacio del target (como si estuviera encima)
        // Usamos el centroide del target como ancla
        const transformedPoints = basePoints.map((p: any) => {
            const rotated = rotatePoint(p.x, p.y, piece.rotation);
            return {
                x: rotated.x + target.centroid.x,
                y: rotated.y + target.centroid.y
            };
        });

        // Contar cuántos vértices de la pieza coinciden con alguno del target
        let matchCount = 0;
        const tolerance = 25; // Tolerancia generosa para el "dedo"

        for (let pPiece of transformedPoints) {
            let found = false;
            for (let pTarget of target.points) {
                const d = Math.hypot(pPiece.x - pTarget.x, pPiece.y - pTarget.y);
                if (d < tolerance) {
                    found = true;
                    break;
                }
            }
            if (found) matchCount++;
        }

        // Si la mayoría de vértices coinciden (permitimos 1 fallo por redondeo/geometría extraña), es válido
        // -1 porque a veces los shapes de tangram.js tienen puntos colineales extra
        return matchCount >= (basePoints.length - 1);
    };

    return (
        <div className="h-screen w-full bg-slate-50 font-sans select-none flex overflow-hidden">

            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'w-80' : 'w-16'} bg-slate-900 text-white flex flex-col shadow-2xl transition-all duration-300 relative z-30 flex-shrink-0`}>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute -right-3 top-6 bg-yellow-400 text-slate-900 rounded-full p-1 shadow-lg z-50 border-2 border-slate-800">
                    {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
                <div className="p-4 flex flex-col items-center border-b border-slate-800 bg-slate-950">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLevelIndex(0)}>
                        <Grid size={24} className="text-yellow-400" />
                        {isSidebarOpen && <span className="font-bold text-xl">GeoMinds</span>}
                    </div>
                </div>
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {isSidebarOpen && (
                        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                            <h2 className="text-xl font-bold mb-1">{t(`geoMindsMessages.levelNames.${RAW_LEVELS[levelIndex].id}`)}</h2>
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => setLevelIndex(Math.max(0, levelIndex - 1))} className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600"><ChevronLeft /></button>
                                <div className="flex-1 bg-slate-900 flex items-center justify-center font-mono text-yellow-400 border border-slate-700 rounded-lg">{levelIndex + 1}/{RAW_LEVELS.length}</div>
                                <button onClick={() => setLevelIndex(Math.min(RAW_LEVELS.length - 1, levelIndex + 1))} className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600"><ChevronRight /></button>
                            </div>
                        </div>
                    )}
                    <button onClick={() => loadLevel(levelIndex)} className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 flex items-center justify-center gap-2">
                        <RefreshCw size={20} /> {isSidebarOpen && t('geoMindsMessages.reset')}
                    </button>
                    <button onClick={() => setShowHints(!showHints)} className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 ${showHints ? 'bg-yellow-500/20 text-yellow-300' : 'bg-slate-800 text-slate-400'}`}>
                        <Lightbulb size={20} /> {isSidebarOpen && (showHints ? t('geoMindsMessages.hideHints') : t('geoMindsMessages.showHints'))}
                    </button>
                </div>
            </div>

            {/* Área de Juego */}
            <div className="flex-1 relative bg-[#60A5FA]/10 flex justify-center items-center overflow-hidden">

                {isLevelComplete && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center border-4 border-yellow-400 transform scale-100 transition-transform">
                            <Trophy size={64} className="mx-auto text-yellow-500 mb-4 animate-bounce" />
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">{t('geoMindsMessages.levelCompleted')}</h2>
                            <button onClick={() => setLevelIndex(Math.min(RAW_LEVELS.length - 1, levelIndex + 1))} className="mt-4 bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 shadow-lg transition-transform hover:scale-105">
                                {t('geoMindsMessages.nextLevel')}
                            </button>
                        </div>
                    </div>
                )}

                <svg
                    ref={svgRef}
                    viewBox="0 0 1000 650"
                    className="w-full h-full max-w-6xl touch-none"
                    style={{ touchAction: 'none' }}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                >
                    {/* CAPA 1: SOMBRA / OBJETIVO */}
                    {targets.map(target => (
                        <path
                            key={target.id}
                            d={target.svgPath}
                            // Color de relleno sólido para evitar ver las líneas de unión
                            fill={showHints ? "#475569" : "#1e293b"}
                            stroke={showHints ? "white" : "#1e293b"}
                            strokeWidth={showHints ? "1" : "3"} // Borde grueso del mismo color fusiona las piezas visualmente
                            strokeDasharray={showHints ? "4 2" : "none"}
                            style={{ pointerEvents: 'none' }}
                        />
                    ))}

                    {/* CAPA 2: PIEZAS DEL JUGADOR */}
                    {pieces.map(piece => (
                        <g
                            key={piece.id}
                            transform={piece.isPlaced ? '' : `translate(${piece.x}, ${piece.y}) rotate(${piece.rotation})`}
                            onPointerDown={(e) => handlePointerDown(e, piece.id)}
                            className="cursor-grab active:cursor-grabbing"
                            style={{
                                zIndex: piece.isPlaced ? 10 : 100,
                                cursor: piece.isPlaced ? 'default' : 'grab',
                                // SIN FILTROS DURANTE ARRASTRE para rendimiento máximo
                                filter: (dragInfo.current.selectedId === piece.id) ? 'none' : 'drop-shadow(1px 2px 3px rgba(0,0,0,0.3))'
                            }}
                        >
                            <path
                                d={piece.isPlaced ? piece.exactPath : piece.path}
                                fill={piece.color}
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                                style={{ pointerEvents: 'all' }}
                            />
                        </g>
                    ))}
                </svg>

                <div className="absolute bottom-4 right-4 text-xs text-slate-400 pointer-events-none opacity-50">
                    {t('geoMindsMessages.level')}: {t(`geoMindsMessages.levelNames.${RAW_LEVELS[levelIndex].id}`)}
                </div>
            </div>
        </div>
    );
}
