'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Play,
    RotateCcw,
    Home,
    Volume2,
    VolumeX,
    Check,
    Heart,
    Trophy,
    HelpCircle,
    Clock
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

import styles from './page.module.css';

// --- DATA & CONFIGURATION ---

const LANGUAGES = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
];

const WORD_DB: Record<string, { word: string; splits: number[]; difficulty: number }[]> = {
    es: [
        // 1 Sílaba
        { word: "SOL", splits: [], difficulty: 1 },
        { word: "PAN", splits: [], difficulty: 1 },
        { word: "LUZ", splits: [], difficulty: 1 },
        { word: "MAR", splits: [], difficulty: 1 },
        { word: "SAL", splits: [], difficulty: 1 },
        { word: "TREN", splits: [], difficulty: 1 },
        { word: "FLOR", splits: [], difficulty: 1 },
        { word: "REY", splits: [], difficulty: 1 },
        { word: "PEZ", splits: [], difficulty: 1 },
        { word: "GOL", splits: [], difficulty: 1 },
        { word: "VOZ", splits: [], difficulty: 1 },
        { word: "DOS", splits: [], difficulty: 1 },
        { word: "TRES", splits: [], difficulty: 1 },
        { word: "MES", splits: [], difficulty: 1 },
        { word: "PIE", splits: [], difficulty: 1 },

        // 2 Sílabas
        { word: "CASA", splits: [2], difficulty: 1 },
        { word: "LUNA", splits: [2], difficulty: 1 },
        { word: "GATO", splits: [2], difficulty: 1 },
        { word: "PERRO", splits: [2], difficulty: 1 },
        { word: "PATO", splits: [2], difficulty: 1 },
        { word: "MANO", splits: [2], difficulty: 1 },
        { word: "BOCA", splits: [2], difficulty: 1 },
        { word: "CARA", splits: [2], difficulty: 1 },
        { word: "PELO", splits: [2], difficulty: 1 },
        { word: "DEDO", splits: [2], difficulty: 1 },
        { word: "NUBE", splits: [2], difficulty: 1 },
        { word: "AGUA", splits: [1], difficulty: 1 }, // A-GUA
        { word: "FUEGO", splits: [3], difficulty: 1 }, // FUE-GO
        { word: "TIERRA", splits: [3], difficulty: 1 }, // TIE-RRA (hiato/diptongo rules simplified for kids, usually TIE-RRA)
        { word: "AIRE", splits: [2], difficulty: 1 }, // AI-RE
        { word: "MESA", splits: [2], difficulty: 1 },
        { word: "SILLA", splits: [2], difficulty: 1 }, // SI-LLA
        { word: "LAPIZ", splits: [2], difficulty: 1 },
        { word: "LIBRO", splits: [2], difficulty: 1 },
        { word: "ARBOL", splits: [2], difficulty: 1 }, // AR-BOL

        // 3 Sílabas
        { word: "AMIGO", splits: [1, 3], difficulty: 2 },
        { word: "TOMATE", splits: [2, 4], difficulty: 2 },
        { word: "CAMISA", splits: [2, 4], difficulty: 2 },
        { word: "ZAPATO", splits: [2, 4], difficulty: 2 }, // ZA-PA-TO
        { word: "PELOTA", splits: [2, 4], difficulty: 2 },
        { word: "COLEGIO", splits: [2, 4], difficulty: 2 }, // CO-LE-GIO
        { word: "ESCUELA", splits: [2, 5], difficulty: 2 }, // ES-CUE-LA
        { word: "MAESTRA", splits: [2, 4], difficulty: 2 }, // MA-ES-TRA (Hiato A-E)
        { word: "CUADERNO", splits: [3, 6], difficulty: 2 }, // CUA-DER-NO
        { word: "MOCHILA", splits: [2, 5], difficulty: 2 },
        { word: "VENTANA", splits: [3, 6], difficulty: 2 }, // VEN-TA-NA
        { word: "COCINA", splits: [2, 4], difficulty: 2 },
        { word: "COMIDA", splits: [2, 4], difficulty: 2 },
        { word: "BEBIDA", splits: [2, 4], difficulty: 2 },
        { word: "JUGUETE", splits: [2, 5], difficulty: 2 }, // JU-GUE-TE
        { word: "MUÑECA", splits: [2, 4], difficulty: 2 },
        { word: "CARAMELO", splits: [2, 4, 6], difficulty: 2 }, // CA-RA-ME-LO (4 sy) -> Moving to 4
        { word: "HELADO", splits: [2, 4], difficulty: 2 }, // HE-LA-DO
        { word: "GALLETA", splits: [2, 5], difficulty: 2 }, // GA-LLE-TA
        { word: "MANZANA", splits: [3, 5], difficulty: 2 }, // MAN-ZA-NA
        { word: "PLATANO", splits: [3, 5], difficulty: 2 }, // PLA-TA-NO
        { word: "NARANJA", splits: [2, 5], difficulty: 2 }, // NA-RAN-JA
        { word: "LIMON", splits: [2], difficulty: 2 }, // LI-MON (2 sy)
        { word: "MELON", splits: [2], difficulty: 2 }, // ME-LON (2 sy)
        { word: "SANDIA", splits: [3, 5], difficulty: 2 }, // SAN-DI-A (Hiato)

        // 4+ Sílabas
        { word: "AVENTURA", splits: [1, 4, 6], difficulty: 3 },
        { word: "MARIPOSA", splits: [2, 4, 6], difficulty: 3 },
        { word: "ELEFANTE", splits: [1, 3, 6], difficulty: 3 },
        { word: "BICICLETA", splits: [2, 4, 7], difficulty: 3 },
        { word: "COMPUTADORA", splits: [3, 5, 7, 9], difficulty: 3 },
        { word: "CHOCOLATE", splits: [3, 5, 7], difficulty: 3 }, // CHO-CO-LA-TE
        { word: "TELEFONO", splits: [2, 4, 6], difficulty: 3 }, // TE-LE-FO-NO
        { word: "TELEVISION", splits: [2, 4, 6, 8], difficulty: 3 }, // TE-LE-VI-SI-ON (Hiato I-O with accent?) No, SION is diphthong usually: SIÓN -> [2, 4, 6] TE-LE-VI-SIÓN?
        // Let's stick to clear ones.
        { word: "DINOSAURIO", splits: [2, 4, 7, 8], difficulty: 3 }, // DI-NO-SAU-RIO
        { word: "HIPOPOTAMO", splits: [2, 4, 6, 8], difficulty: 3 }, // HI-PO-PO-TA-MO
        { word: "RINOCERONTE", splits: [2, 4, 6, 9], difficulty: 3 }, // RI-NO-CE-RON-TE
        { word: "ESCALERA", splits: [2, 4, 6], difficulty: 3 }, // ES-CA-LE-RA
        { word: "ASCENSOR", splits: [2, 5], difficulty: 3 }, // AS-CEN-SOR (3 sy)
        { word: "EDIFICIO", splits: [1, 3, 5], difficulty: 3 }, // E-DI-FI-CIO
        { word: "BIBLIOTECA", splits: [2, 5, 6, 8], difficulty: 3 }, // BI-BLIO-TE-CA
        { word: "HOSPITAL", splits: [3, 5], difficulty: 3 }, // HOS-PI-TAL (3 sy)
        { word: "SUPERMERCADO", splits: [2, 5, 8, 10], difficulty: 3 }, // SU-PER-MER-CA-DO
        { word: "RESTUARANTE", splits: [3, 6, 9], difficulty: 3 }, // RES-TAU-RAN-TE
        { word: "VACACIONES", splits: [2, 4, 7], difficulty: 3 }, // VA-CA-CIO-NES
        { word: "CUMPLEAÑOS", splits: [3, 6, 7], difficulty: 3 }, // CUM-PLE-A-ÑOS
        { word: "PRIMAVERA", splits: [3, 5, 7], difficulty: 3 }, // PRI-MA-VE-RA
        { word: "VERANO", splits: [2, 4], difficulty: 2 }, // VE-RA-NO (3 sy)
        { word: "OTOÑO", splits: [1, 3], difficulty: 2 }, // O-TO-ÑO (3 sy)
        { word: "INVIERNO", splits: [2, 5], difficulty: 3 }, // IN-VIER-NO
        { word: "DICCIONARIO", splits: [3, 6, 8], difficulty: 3 }, // DIC-CIO-NA-RIO
        { word: "CALENDARIO", splits: [2, 5, 7], difficulty: 3 }, // CA-LEN-DA-RIO
        { word: "UNIVERSO", splits: [1, 3, 6], difficulty: 3 }, // U-NI-VER-SO
        { word: "PLANETA", splits: [3, 5], difficulty: 3 }, // PLA-NE-TA (3 sy)
        { word: "ESTRELLA", splits: [2, 5], difficulty: 3 }, // ES-TRE-LLA
        { word: "ASTRONAUTA", splits: [2, 5, 7], difficulty: 3 } // AS-TRO-NAU-TA
    ],
    en: [
        // 1 Syllable
        { word: "CAT", splits: [], difficulty: 1 },
        { word: "DOG", splits: [], difficulty: 1 },
        { word: "SUN", splits: [], difficulty: 1 },
        { word: "RED", splits: [], difficulty: 1 },
        { word: "BLUE", splits: [], difficulty: 1 },
        { word: "GREEN", splits: [], difficulty: 1 },
        { word: "ONE", splits: [], difficulty: 1 },
        { word: "TWO", splits: [], difficulty: 1 },
        { word: "THREE", splits: [], difficulty: 1 },
        { word: "FOUR", splits: [], difficulty: 1 },
        { word: "FIVE", splits: [], difficulty: 1 },
        { word: "BIG", splits: [], difficulty: 1 },
        { word: "CAR", splits: [], difficulty: 1 },
        { word: "BUS", splits: [], difficulty: 1 },
        { word: "FISH", splits: [], difficulty: 1 },

        // 2 Syllables
        { word: "APPLE", splits: [2], difficulty: 1 }, // AP-PLE
        { word: "HAPPY", splits: [3], difficulty: 1 }, // HAP-PY
        { word: "TABLE", splits: [2], difficulty: 1 }, // TA-BLE
        { word: "TIGER", splits: [2], difficulty: 2 }, // TI-GER
        { word: "LION", splits: [2], difficulty: 2 }, // LI-ON
        { word: "ZEBRA", splits: [2], difficulty: 2 }, // ZE-BRA
        { word: "MONKEY", splits: [3], difficulty: 2 }, // MON-KEY
        { word: "PANDA", splits: [3], difficulty: 2 }, // PAN-DA
        { word: "RABBIT", splits: [3], difficulty: 2 }, // RAB-BIT
        { word: "WATER", splits: [2], difficulty: 1 }, // WA-TER
        { word: "FIRE", splits: [], difficulty: 1 }, // FIRE (1 sy usually)
        { word: "FLOWER", splits: [3], difficulty: 2 }, // FLOW-ER
        { word: "GARDEN", splits: [3], difficulty: 2 }, // GAR-DEN
        { word: "WINDOW", splits: [3], difficulty: 2 }, // WIN-DOW
        { word: "PENCIL", splits: [3], difficulty: 2 }, // PEN-CIL
        { word: "PAPER", splits: [2], difficulty: 2 }, // PA-PER
        { word: "TEACHER", splits: [4], difficulty: 2 }, // TEACH-ER
        { word: "STUDENT", splits: [3], difficulty: 2 }, // STU-DENT
        { word: "DOCTOR", splits: [3], difficulty: 2 }, // DOC-TOR
        { word: "PIZZA", splits: [3], difficulty: 2 }, // PIZ-ZA

        // 3 Syllables
        { word: "BANANA", splits: [2, 4], difficulty: 2 }, // BA-NA-NA
        { word: "GALAXY", splits: [3, 5], difficulty: 2 }, // GAL-AX-Y
        { word: "ELEPHANT", splits: [2, 4], difficulty: 3 }, // EL-E-PHANT
        { word: "COMPUTER", splits: [3, 5], difficulty: 3 }, // COM-PU-TER
        { word: "TOMATO", splits: [2, 4], difficulty: 2 }, // TO-MA-TO
        { word: "POTATO", splits: [2, 4], difficulty: 2 }, // PO-TA-TO
        { word: "UMBRELLA", splits: [2, 5], difficulty: 3 }, // UM-BREL-LA
        { word: "OCTOPUS", splits: [2, 4], difficulty: 3 }, // OC-TO-PUS
        { word: "BUTTERFLY", splits: [3, 6], difficulty: 3 }, // BUT-TER-FLY
        { word: "KANGAROO", splits: [3, 5], difficulty: 3 }, // KAN-GA-ROO
        { word: "CROCODILE", splits: [3, 5], difficulty: 3 }, // CROC-O-DILE
        { word: "DINOSAUR", splits: [3, 5], difficulty: 3 }, // DIN-O-SAUR
        { word: "ASTRONAUT", splits: [2, 5], difficulty: 3 }, // AS-TRO-NAUT
        { word: "BICYCLE", splits: [2, 4], difficulty: 3 }, // BI-CY-CLE
        { word: "LIBRARY", splits: [2, 5], difficulty: 3 }, // LI-BRAR-Y
        { word: "HOSPITAL", splits: [3, 5], difficulty: 3 }, // HOS-PI-TAL
        { word: "HAMBURGER", splits: [3, 6], difficulty: 3 }, // HAM-BUR-GER
        { word: "CHOCOLATE", splits: [3, 5], difficulty: 3 }, // CHOC-O-LATE
        { word: "STRAWBERRY", splits: [5, 8], difficulty: 3 }, // STRAW-BER-RY
        { word: "PINEAPPLE", splits: [4, 6], difficulty: 3 }, // PINE-AP-PLE

        // 4+ Syllables
        { word: "ADVENTURE", splits: [2, 5], difficulty: 3 },
        { word: "BASKETBALL", splits: [3, 6], difficulty: 3 },
        { word: "TELEVISION", splits: [3, 5, 7], difficulty: 3 }, // TEL-E-VI-SION
        { word: "HELICOPTER", splits: [3, 5, 8], difficulty: 3 }, // HEL-I-COP-TER
        { word: "WATERMELON", splits: [2, 5, 7], difficulty: 3 }, // WA-TER-MEL-ON
        { word: "SUPERMARKET", splits: [2, 5, 8], difficulty: 3 }, // SU-PER-MAR-KET
        { word: "INFORMATION", splits: [2, 5, 7], difficulty: 3 }, // IN-FOR-MA-TION
        { word: "EDUCATION", splits: [2, 4, 6], difficulty: 3 }, // ED-U-CA-TION
        { word: "CELEBRATION", splits: [3, 5, 7], difficulty: 3 }, // CEL-E-BRA-TION
        { word: "DECORATION", splits: [3, 5, 7], difficulty: 3 }, // DEC-O-RA-TION
        { word: "DICTIONARY", splits: [3, 5, 7], difficulty: 3 }, // DIC-TION-AR-Y
        { word: "CALCULATOR", splits: [3, 5, 7], difficulty: 3 }, // CAL-CU-LA-TOR
        { word: "ELEVATOR", splits: [2, 4, 6], difficulty: 3 }, // EL-E-VA-TOR
        { word: "ALLIGATOR", splits: [2, 4, 6], difficulty: 3 }, // AL-LI-GA-TOR
        { word: "CATERPILLAR", splits: [3, 5, 8], difficulty: 3 }, // CAT-ER-PIL-LAR
        { word: "RHINOCEROS", splits: [3, 5, 7], difficulty: 3 }, // RHI-NOC-ER-OS
        { word: "HIPPOPOTAMUS", splits: [3, 5, 7, 9], difficulty: 3 } // HIP-PO-POT-A-MUS
    ],
    pt: [
        // 1 Sílaba
        { word: "MÃO", splits: [], difficulty: 1 },
        { word: "PÉ", splits: [], difficulty: 1 },
        { word: "SOL", splits: [], difficulty: 1 },
        { word: "LUZ", splits: [], difficulty: 1 },
        { word: "SAL", splits: [], difficulty: 1 },
        { word: "MAR", splits: [], difficulty: 1 },
        { word: "CÉU", splits: [], difficulty: 1 },
        { word: "PÃO", splits: [], difficulty: 1 },
        { word: "SIM", splits: [], difficulty: 1 },
        { word: "NÃO", splits: [], difficulty: 1 },
        { word: "UM", splits: [], difficulty: 1 },
        { word: "DEZ", splits: [], difficulty: 1 },
        { word: "COR", splits: [], difficulty: 1 },
        { word: "FLOR", splits: [], difficulty: 1 },
        { word: "TREM", splits: [], difficulty: 1 },

        // 2 Sílabas
        { word: "CASA", splits: [2], difficulty: 1 }, // CA-SA
        { word: "GATO", splits: [2], difficulty: 1 }, // GA-TO
        { word: "BOLA", splits: [2], difficulty: 1 }, // BO-LA
        { word: "MALA", splits: [2], difficulty: 1 }, // MA-LA
        { word: "PATO", splits: [2], difficulty: 1 }, // PA-TO
        { word: "LIVRO", splits: [2], difficulty: 1 }, // LI-VRO
        { word: "MESA", splits: [2], difficulty: 1 }, // ME-SA
        { word: "CAMA", splits: [2], difficulty: 1 }, // CA-MA
        { word: "DEDO", splits: [2], difficulty: 1 }, // DE-DO
        { word: "BOCA", splits: [2], difficulty: 1 }, // BO-CA
        { word: "ÁGUA", splits: [1], difficulty: 1 }, // Á-GUA
        { word: "LEITE", splits: [3], difficulty: 1 }, // LEI-TE
        { word: "NOITE", splits: [3], difficulty: 1 }, // NOI-TE
        { word: "DIA", splits: [2], difficulty: 1 }, // DI-A (hiato)
        { word: "FOGO", splits: [2], difficulty: 1 }, // FO-GO
        { word: "LIGAR", splits: [2], difficulty: 1 }, // LI-GAR
        { word: "COMER", splits: [2], difficulty: 1 }, // CO-MER
        { word: "ANDAR", splits: [2], difficulty: 1 }, // AN-DAR
        { word: "BRINCAR", splits: [4], difficulty: 2 }, // BRIN-CAR
        { word: "PAPEL", splits: [2], difficulty: 2 }, // PA-PEL

        // 3 Sílabas
        { word: "BONITO", splits: [2, 4], difficulty: 2 }, // BO-NI-TO
        { word: "AMIGO", splits: [1, 3], difficulty: 2 }, // A-MI-GO
        { word: "ESCOLA", splits: [2, 4], difficulty: 2 }, // ES-CO-LA
        { word: "JANELA", splits: [2, 4], difficulty: 2 }, // JA-NE-LA
        { word: "COMIDA", splits: [2, 4], difficulty: 2 }, // CO-MI-DA
        { word: "CANETA", splits: [2, 4], difficulty: 2 }, // CA-NE-TA
        { word: "SAPATO", splits: [2, 4], difficulty: 2 }, // SA-PA-TO
        { word: "MENINO", splits: [2, 4], difficulty: 2 }, // ME-NI-NO
        { word: "MENINA", splits: [2, 4], difficulty: 2 }, // ME-NI-NA
        { word: "FAMÍLIA", splits: [2, 4], difficulty: 2 }, // FA-MÍ-LIA (ditongo crescente at end usually not split in PT-BR primary education) or FA-MÍ-LI-A? Usually FA-MÍ-LIA.
        { word: "BANANA", splits: [2, 4], difficulty: 2 }, // BA-NA-NA
        { word: "TOMATE", splits: [2, 4], difficulty: 2 }, // TO-MA-TE
        { word: "BATATA", splits: [2, 4], difficulty: 2 }, // BA-TA-TA
        { word: "LARANJA", splits: [2, 5], difficulty: 2 }, // LA-RAN-JA
        { word: "ABELHA", splits: [1, 3], difficulty: 2 }, // A-BE-LHA
        { word: "COELHO", splits: [2, 3], difficulty: 2 }, // CO-E-LHO
        { word: "CACHORRO", splits: [2, 5], difficulty: 2 }, // CA-CHOR-RO
        { word: "ESTRELA", splits: [2, 5], difficulty: 2 }, // ES-TRE-LA
        { word: "MÚSICA", splits: [2, 4], difficulty: 2 }, // MÚ-SI-CA
        { word: "MÉDICO", splits: [2, 4], difficulty: 2 }, // MÉ-DI-CO

        // 4+ Sílabas
        { word: "CHOCOLATE", splits: [3, 5, 7], difficulty: 3 }, // CHO-CO-LA-TE
        { word: "ELEFANTE", splits: [1, 3, 6], difficulty: 3 }, // E-LE-FAN-TE
        { word: "TELEFONE", splits: [2, 4, 6], difficulty: 3 }, // TE-LE-FO-NE
        { word: "BORBOLETA", splits: [3, 5, 7], difficulty: 3 }, // BOR-BO-LE-TA
        { word: "COMPUTADOR", splits: [3, 5, 7], difficulty: 3 }, // COM-PU-TA-DOR
        { word: "FELICIDADE", splits: [2, 4, 6, 8], difficulty: 3 }, // FE-LI-CI-DA-DE
        { word: "INTELIGENTE", splits: [2, 4, 6, 9], difficulty: 3 }, // IN-TE-LI-GEN-TE
        { word: "MARAVILHOSO", splits: [2, 4, 6, 9], difficulty: 3 }, // MA-RA-VI-LHO-SO
        { word: "HIPOPÓTAMO", splits: [2, 4, 6, 8], difficulty: 3 }, // HI-PO-PÓ-TA-MO
        { word: "RINOCERONTE", splits: [2, 4, 6, 9], difficulty: 3 }, // RI-NO-CE-RON-TE
        { word: "BICICLETA", splits: [2, 4, 7], difficulty: 3 }, // BI-CI-CLE-TA
        { word: "MATEMÁTICA", splits: [2, 4, 6, 8], difficulty: 3 }, // MA-TE-MÁ-TI-CA
        { word: "BRINCADEIRA", splits: [4, 6, 9], difficulty: 3 }, // BRIN-CA-DEI-RA
        { word: "ANIVERSÁRIO", splits: [1, 3, 6, 8], difficulty: 3 }, // A-NI-VER-SÁ-RIO
        { word: "PORTUGUÊS", splits: [3, 5], difficulty: 2 }, // POR-TU-GUÊS (3 sy)
        { word: "GEOGRAFIA", splits: [2, 3, 6, 7], difficulty: 3 }, // GEO-GRA-FI-A (Geo is usually separated GE-O in strict grammar, but GEO often together in quick speech. Let's use strict: GE-O-GRA-FI-A [2, 3, 6, 7])
        { word: "HISTÓRIA", splits: [3, 5], difficulty: 3 }, // HIS-TÓ-RIA
        { word: "CIÊNCIAS", splits: [4], difficulty: 3 }, // CIÊN-CIAS (2 sy? No. CI-ÊN-CIAS or CIÊN-CIAS. Cien-cias is common separation)
        { word: "EDUCAÇÃO", splits: [1, 3, 5], difficulty: 3 }, // E-DU-CA-ÇÃO
        { word: "PROFESSORA", splits: [3, 5, 7], difficulty: 3 } // PRO-FES-SO-RA
    ],
    fr: [
        // 1 Syllable (Oral syllables mainly, writing splits are tricky in FR due to mute e. 
        // We will follow written syllable division rules for school: coupé en syllabes graphiques)
        { word: "CHAT", splits: [], difficulty: 1 },
        { word: "EAU", splits: [], difficulty: 1 },
        { word: "PAIN", splits: [], difficulty: 1 },
        { word: "LAIT", splits: [], difficulty: 1 },
        { word: "LOUP", splits: [], difficulty: 1 },
        { word: "CIEL", splits: [], difficulty: 1 },
        { word: "FLEUR", splits: [], difficulty: 1 },
        { word: "ROI", splits: [], difficulty: 1 },
        { word: "MER", splits: [], difficulty: 1 },
        { word: "FEU", splits: [], difficulty: 1 },
        { word: "JOUR", splits: [], difficulty: 1 },
        { word: "NUIT", splits: [], difficulty: 1 },
        { word: "COEUR", splits: [], difficulty: 1 },
        { word: "MAIN", splits: [], difficulty: 1 },
        { word: "PIED", splits: [], difficulty: 1 },

        // 2 Syllables
        { word: "ROUGE", splits: [], difficulty: 1 }, // ROUGE (1 oral, 2 written? ROU-GE is traditional cutting at end of line, but modern is 1. Let's stick to clear 2+ voiced syllables or traditional coupe)
        // Let's use words with clear voiced vowels for kids
        { word: "MERCI", splits: [3], difficulty: 2 }, // MER-CI
        { word: "PETIT", splits: [2], difficulty: 2 }, // PE-TIT
        { word: "AMOUR", splits: [1], difficulty: 2 }, // A-MOUR
        { word: "BONJOUR", splits: [3], difficulty: 2 }, // BON-JOUR
        { word: "MAMAN", splits: [2], difficulty: 2 }, // MA-MAN
        { word: "PAPA", splits: [2], difficulty: 2 }, // PA-PA
        { word: "MAISON", splits: [3], difficulty: 2 }, // MAI-SON
        { word: "JARDIN", splits: [3], difficulty: 2 }, // JAR-DIN
        { word: "ÉCOLE", splits: [1, 3], difficulty: 2 }, // É-CO-LE (Written: É-CO-LE, Oral: É-COL) -> Let's use written standard rules for games
        { word: "POMME", splits: [3], difficulty: 1 }, // POM-ME (Traditional cut between double consonants)
        { word: "BALLE", splits: [3], difficulty: 1 }, // BAL-LE
        { word: "LIVRE", splits: [2], difficulty: 1 }, // LI-VRE (Traditional)
        { word: "STYLO", splits: [3], difficulty: 2 }, // STY-LO
        { word: "TABLE", splits: [2], difficulty: 1 }, // TA-BLE
        { word: "CHAISE", splits: [4], difficulty: 2 }, // CHAI-SE
        { word: "PORTE", splits: [3], difficulty: 1 }, // POR-TE
        { word: "FENÊTRE", splits: [2, 4], difficulty: 2 }, // FE-NÊ-TRE
        { word: "SOLEIL", splits: [2], difficulty: 2 }, // SO-LEIL
        { word: "LUNE", splits: [2], difficulty: 1 }, // LU-NE

        // 3 Syllables
        { word: "PAPILLON", splits: [2, 5], difficulty: 3 }, // PA-PIL-LON
        { word: "ÉLÉPHANT", splits: [1, 3], difficulty: 3 }, // É-LÉ-PHANT (3 sy)
        { word: "ANIMAUX", splits: [1, 3], difficulty: 2 }, // A-NI-MAUX
        { word: "CHOCOLAT", splits: [3, 5], difficulty: 3 }, // CHO-CO-LAT
        { word: "BANANE", splits: [2, 4], difficulty: 2 }, // BA-NA-NE
        { word: "TOMATE", splits: [2, 4], difficulty: 2 }, // TO-MA-TE
        { word: "PYJAMA", splits: [2, 4], difficulty: 2 }, // PY-JA-MA
        { word: "SAMEDI", splits: [2, 4], difficulty: 2 }, // SA-ME-DI
        { word: "DIMANCHE", splits: [2, 5], difficulty: 2 }, // DI-MAN-CHE
        { word: "VACANCES", splits: [2, 5], difficulty: 2 }, // VA-CAN-CES
        { word: "VOITURE", splits: [3, 5], difficulty: 2 }, // VOI-TU-RE
        { word: "BATEAU", splits: [2], difficulty: 2 }, // BA-TEAU
        { word: "AVION", splits: [1, 3], difficulty: 2 }, // A-VI-ON (Diaeresis? No, A-VION usually, depends on region. Let's use A-VION [1])
        { word: "MUSIQUE", splits: [2, 4], difficulty: 2 }, // MU-SI-QUE
        { word: "GUITARE", splits: [3, 5], difficulty: 2 }, // GUI-TA-RE
        { word: "ORANGE", splits: [1, 4], difficulty: 2 }, // O-RAN-GE
        { word: "NUMÉRO", splits: [2, 4], difficulty: 2 }, // NU-MÉ-RO
        { word: "LIBERTÉ", splits: [2, 5], difficulty: 2 }, // LI-BER-TÉ
        { word: "FAMILLE", splits: [2, 5], difficulty: 2 }, // FA-MIL-LE (Traditional)
        { word: "POULET", splits: [3], difficulty: 2 }, // POU-LET

        // 4+ Syllables
        { word: "FANTASTIQUE", splits: [3, 6, 8], difficulty: 3 }, // FAN-TAS-TI-QUE
        { word: "ORDINATEUR", splits: [2, 4, 6], difficulty: 3 }, // OR-DI-NA-TEUR
        { word: "TÉLÉVISION", splits: [2, 4, 6], difficulty: 3 }, // TÉ-LÉ-VI-SION
        { word: "TÉLÉPHONE", splits: [2, 4, 6], difficulty: 3 }, // TÉ-LÉ-PHO-NE
        { word: "AMÉRICAIN", splits: [1, 3, 5], difficulty: 3 }, // A-MÉ-RI-CAIN
        { word: "ANNIVERSAIRE", splits: [2, 4, 7, 9], difficulty: 3 }, // AN-NI-VER-SAI-RE
        { word: "DICTIONNAIRE", splits: [3, 5, 8], difficulty: 3 }, // DIC-TION-NAI-RE
        { word: "BIBLIOTHÈQUE", splits: [2, 6, 8], difficulty: 3 }, // BI-BLIO-THÈ-QUE
        { word: "MATHÉMATIQUES", splits: [2, 4, 6, 8], difficulty: 3 }, // MA-THÉ-MA-TI-QUES
        { word: "GÉOGRAPHIE", splits: [2, 3, 6, 7], difficulty: 3 }, // GÉ-O-GRA-PHIE or GÉ-O-GRA-PHI-E? Let's use GÉ-O-GRA-PHIE
        { word: "RHINOCÉROS", splits: [3, 5, 7], difficulty: 3 }, // RHI-NO-CÉ-ROS
        { word: "HIPPOPOTAME", splits: [3, 5, 7, 9], difficulty: 3 }, // HIP-PO-PO-TA-ME
        { word: "DINOSAURE", splits: [2, 4, 6], difficulty: 3 }, // DI-NO-SAU-RE
        { word: "CROCODILE", splits: [3, 5, 7], difficulty: 3 }, // CRO-CO-DI-LE
        { word: "CONFITURE", splits: [3, 5], difficulty: 3 }, // CON-FI-TU-RE
        { word: "SALADE", splits: [2, 4], difficulty: 2 }, // SA-LA-DE (3 sy)
        { word: "RESTAURANT", splits: [3, 6], difficulty: 2 }, // RES-TAU-RANT (3 sy)
        { word: "APPARTEMENT", splits: [2, 5, 7], difficulty: 3 }, // AP-PAR-TE-MENT
        { word: "ASCENSEUR", splits: [2, 5], difficulty: 2 }, // AS-CEN-SEUR
        { word: "INFORMATION", splits: [2, 5, 7], difficulty: 3 } // IN-FOR-MA-TION
    ],
    it: [
        // 1 Syllable
        { word: "BLU", splits: [], difficulty: 1 },
        { word: "RE", splits: [], difficulty: 1 },
        { word: "TE", splits: [], difficulty: 1 },
        { word: "ME", splits: [], difficulty: 1 },
        { word: "NO", splits: [], difficulty: 1 },
        { word: "SI", splits: [], difficulty: 1 },
        { word: "TRE", splits: [], difficulty: 1 },
        { word: "SUD", splits: [], difficulty: 1 },
        { word: "EST", splits: [], difficulty: 1 },
        { word: "QUI", splits: [], difficulty: 1 },
        { word: "LÌ", splits: [], difficulty: 1 },
        { word: "GIÙ", splits: [], difficulty: 1 },
        { word: "PIÙ", splits: [], difficulty: 1 },
        { word: "MAI", splits: [], difficulty: 1 },
        { word: "BUON", splits: [], difficulty: 1 },

        // 2 Syllables
        { word: "CANE", splits: [2], difficulty: 1 }, // CA-NE
        { word: "SOLE", splits: [2], difficulty: 1 }, // SO-LE
        { word: "PIZZA", splits: [3], difficulty: 1 }, // PIZ-ZA
        { word: "PASTA", splits: [3], difficulty: 1 }, // PAS-TA
        { word: "MAMMA", splits: [3], difficulty: 1 }, // MAM-MA
        { word: "PAPA", splits: [2], difficulty: 1 }, // PA-PÀ
        { word: "CASA", splits: [2], difficulty: 1 }, // CA-SA
        { word: "GATTO", splits: [3], difficulty: 1 }, // GAT-TO
        { word: "ACQUA", splits: [2], difficulty: 1 }, // AC-QUA
        { word: "PANE", splits: [2], difficulty: 1 }, // PA-NE
        { word: "LATTE", splits: [3], difficulty: 1 }, // LAT-TE
        { word: "MARE", splits: [2], difficulty: 1 }, // MA-RE
        { word: "CIELO", splits: [3], difficulty: 1 }, // CIE-LO
        { word: "FUOCO", splits: [3], difficulty: 1 }, // FUO-CO
        { word: "TERRA", splits: [3], difficulty: 1 }, // TER-RA
        { word: "ARIA", splits: [1], difficulty: 1 }, // A-RIA
        { word: "UOMO", splits: [2], difficulty: 2 }, // UO-MO
        { word: "DONNA", splits: [3], difficulty: 2 }, // DON-NA
        { word: "LIBRO", splits: [2], difficulty: 2 }, // LI-BRO
        { word: "PENNA", splits: [3], difficulty: 2 }, // PEN-NA

        // 3 Syllables
        { word: "AMORE", splits: [1, 3], difficulty: 2 }, // A-MO-RE
        { word: "ALBERO", splits: [2, 4], difficulty: 2 }, // AL-BE-RO
        { word: "GELATO", splits: [2, 4], difficulty: 2 }, // GE-LA-TO
        { word: "SPAGHETTI", splits: [3, 6], difficulty: 3 }, // SPA-GHET-TI
        { word: "POMODORO", splits: [2, 4, 6], difficulty: 3 }, // PO-MO-DO-RO
        { word: "BANANA", splits: [2, 4], difficulty: 2 }, // BA-NA-NA
        { word: "PATATA", splits: [2, 4], difficulty: 2 }, // PA-TA-TA
        { word: "CAROTA", splits: [2, 4], difficulty: 2 }, // CA-RO-TA
        { word: "FARFALLA", splits: [3, 6], difficulty: 3 }, // FAR-FAL-LA
        { word: "UCCELLO", splits: [2, 5], difficulty: 3 }, // UC-CEL-LO
        { word: "PESCE", splits: [2], difficulty: 1 }, // PE-SCE (2 sy)
        { word: "SCUOLA", splits: [2, 4], difficulty: 2 }, // SCUO-LA -> SCUO is dipthong, usually considered 1 sy. SCUO-LA.
        { word: "MATITA", splits: [2, 4], difficulty: 2 }, // MA-TI-TA
        { word: "LAVAGNA", splits: [2, 5], difficulty: 3 }, // LA-VA-GNA
        { word: "FINESTRA", splits: [2, 5], difficulty: 3 }, // FI-NE-STRA
        { word: "TAVOLO", splits: [2, 4], difficulty: 2 }, // TA-VO-LO
        { word: "SEDIA", splits: [2], difficulty: 1 }, // SE-DIA
        { word: "DIVANO", splits: [2, 4], difficulty: 2 }, // DI-VA-NO
        { word: "CAMERA", splits: [2, 4], difficulty: 2 }, // CA-ME-RA
        { word: "CUCINA", splits: [2, 4], difficulty: 2 }, // CU-CI-NA

        // 4+ Syllables
        { word: "MERAVIGLIOSO", splits: [2, 4, 6, 9], difficulty: 3 }, // ME-RA-VI-GLIO-SO
        { word: "TELEFONO", splits: [2, 4, 6], difficulty: 3 }, // TE-LE-FO-NO
        { word: "TELEVISIONE", splits: [2, 4, 6, 8], difficulty: 3 }, // TE-LE-VI-SIO-NE
        { word: "COMPUTER", splits: [3, 5], difficulty: 2 }, // COM-PU-TER (3 sy)
        { word: "ELEFANTE", splits: [1, 3, 6], difficulty: 3 }, // E-LE-FAN-TE
        { word: "IOPPOPOTAMO", splits: [1, 3, 5, 7], difficulty: 3 }, // I-PPO-PO-TA-MO
        { word: "RINOCERONTE", splits: [2, 4, 6, 9], difficulty: 3 }, // RI-NO-CE-RON-TE
        { word: "DINOSAURO", splits: [2, 4, 6], difficulty: 3 }, // DI-NO-SAU-RO
        { word: "BICICLETTA", splits: [2, 4, 7], difficulty: 3 }, // BI-CI-CLET-TA
        { word: "MOTOCICLETTA", splits: [2, 4, 6, 9], difficulty: 3 }, // MO-TO-CI-CLET-TA
        { word: "AEROPLANO", splits: [1, 2, 5], difficulty: 3 }, // A-E-RO-PLA-NO
        { word: "ELICOTTERO", splits: [1, 3, 6, 8], difficulty: 3 }, // E-LI-COT-TE-RO
        { word: "CIOCCOLATO", splits: [3, 6, 8], difficulty: 3 }, // CIOC-CO-LA-TO
        { word: "FRAGOLA", splits: [3, 5], difficulty: 2 }, // FRA-GO-LA (3 sy)
        { word: "COMOBINAZIONE", splits: [2, 4, 6, 8], difficulty: 3 }, // CO-MBI-NA-ZIO-NE ? No. MBI is not valid start. COM-BI-NA-ZIO-NE.
        { word: "INFORMAZIONE", splits: [2, 5, 7, 9], difficulty: 3 }, // IN-FOR-MA-ZIO-NE
        { word: "EDUCAZIONE", splits: [1, 3, 5, 7], difficulty: 3 }, // E-DU-CA-ZIO-NE
        { word: "MATEMATICA", splits: [2, 4, 6, 8], difficulty: 3 }, // MA-TE-MA-TI-CA
        { word: "GEOGRAFIA", splits: [2, 3, 6, 7], difficulty: 3 }, // GE-O-GRA-FIA
        { word: "STORIA", splits: [3], difficulty: 2 } // STO-RIA
    ]
};

// --- TYPES ---

type GameState = 'menu' | 'tutorial' | 'playing' | 'gameover';

// --- COMPONENTS ---

export default function SyllableQuestGame() {
    const [gameState, setGameState] = useState<GameState>('menu');
    const [language, setLanguage] = useState('es');
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Game Session State
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [timeLeft, setTimeLeft] = useState(60);
    const [activeWords, setActiveWords] = useState<typeof WORD_DB['es']>([]);

    // Setup game
    const startGame = () => {
        // Shuffle and pick words for the selected language
        const words = [...WORD_DB[language]].sort(() => 0.5 - Math.random());
        setActiveWords(words);
        setCurrentWordIndex(0);
        setScore(0);
        setLives(5);
        setTimeLeft(60);
        setGameState('tutorial'); // Show tutorial first
    };

    const handleGameOver = useCallback(() => {
        setGameState('gameover');
    }, []);

    // Timer logic
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleGameOver();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, handleGameOver]);

    const toggleSound = () => setSoundEnabled(!soundEnabled);

    return (
        <div className="min-h-screen bg-stone-800 font-sans select-none overflow-hidden flex items-center justify-center relative">
            {/* Background Texture (Simulated Blackboard) */}
            <div className="absolute inset-0 bg-[#2F5D48] opacity-100"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute inset-0 bg-black opacity-20 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9)' }}></div>

            {/* Main Container */}
            <div className="relative w-full max-w-5xl h-[90vh] md:h-[800px] border-[16px] border-[#8B5A2B] rounded-xl shadow-2xl bg-[#264D3B] overflow-hidden flex flex-col">

                {/* Wood Texture on Border */}
                <div className="absolute inset-0 border-[16px] border-[#8B5A2B] pointer-events-none z-50 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                {/* Global Header (Visible in Game) */}
                {gameState === 'playing' && (
                    <div className="flex justify-between items-center p-6 text-white z-20">
                        <div className="flex gap-4">
                            <button onClick={() => setGameState('menu')} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                                <Home size={24} />
                            </button>
                            <button onClick={toggleSound} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                                {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                            </button>
                        </div>

                        <div className="flex gap-8 items-center bg-black/20 px-6 py-2 rounded-full border border-white/10">
                            <div className="flex items-center gap-2">
                                <Clock className="text-yellow-400" size={20} />
                                <span className="text-2xl font-bold font-mono">{timeLeft}s</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Trophy className="text-yellow-400" size={20} />
                                <span className="text-2xl font-bold font-mono">{score.toString().padStart(2, '0')}</span>
                            </div>
                        </div>

                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Heart
                                    key={i}
                                    size={24}
                                    className={`${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-500 fill-gray-900'} drop-shadow-md transition-all duration-300`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* --- SCREENS --- */}

                {gameState === 'menu' && (
                    <div className={`w-full h-full ${styles.animateFadeIn}`}>
                        <MenuScreen
                            onStart={startGame}
                            language={language}
                            setLanguage={setLanguage}
                        />
                    </div>
                )}

                {gameState === 'tutorial' && (
                    <TutorialScreen
                        onClose={() => setGameState('playing')}
                        language={language}
                    />
                )}

                {gameState === 'playing' && activeWords.length > 0 && (
                    <GameLevel
                        currentWord={activeWords[currentWordIndex]}
                        onSuccess={(points) => {
                            setScore(s => s + points);
                            if (currentWordIndex < activeWords.length - 1) {
                                setTimeout(() => setCurrentWordIndex(i => i + 1), 1000);
                            } else {
                                handleGameOver();
                            }
                        }}
                        onFail={() => {
                            setLives(l => {
                                if (l <= 1) {
                                    handleGameOver();
                                    return 0;
                                }
                                return l - 1;
                            });
                        }}
                        language={language}
                    />
                )}

                {gameState === 'gameover' && (
                    <GameOverScreen
                        score={score}
                        onRestart={startGame}
                        onHome={() => setGameState('menu')}
                    />
                )}
            </div>

            {/* Styles for game animations injected via useEffect */}
        </div>
    );
}

// --- SUB-COMPONENTS ---

function MenuScreen({ onStart, language, setLanguage }: { onStart: () => void, language: string, setLanguage: (l: string) => void }) {
    const t = useTranslations('GamesPage');
    return (
        <div className="flex flex-col items-center justify-center h-full z-10 text-white space-y-8">

            {/* Home Navigation button added to menu as well for easy exit if needed, though mostly for consistent feel */}
            <div className="absolute top-6 left-6">
                <Link href="/games" className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition flex items-center gap-2">
                    <Home size={24} />
                    <span className="font-bold">{t('syllableQuestMessages.exit')}</span>
                </Link>
            </div>

            <div className="text-center space-y-2">
                <h1 className="text-5xl md:text-8xl font-bold text-[#FFD700] drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]" style={{ fontFamily: 'Comic Sans MS, sans-serif' }}>
                    Syllable Quest
                </h1>
                <p className="text-2xl text-gray-200 opacity-90">{t('syllableQuestMessages.subtitle')}</p>
            </div>

            <div className="grid grid-cols-5 gap-2 md:gap-4 bg-black/20 p-4 rounded-xl border border-white/10">
                {LANGUAGES.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`flex flex-col items-center p-3 rounded-lg transition-all transform hover:scale-105 ${language === lang.code
                            ? 'bg-yellow-500/90 text-black shadow-lg scale-110'
                            : 'bg-white/10 hover:bg-white/20'
                            }`}
                    >
                        <span className="text-3xl mb-1">{lang.flag}</span>
                        <span className="text-xs font-bold uppercase">{lang.code}</span>
                    </button>
                ))}
            </div>

            <button
                onClick={onStart}
                className="group relative px-12 py-6 bg-orange-500 rounded-2xl shadow-[0_8px_0_#9a3412] active:shadow-[0_4px_0_#9a3412] active:translate-y-1 transition-all"
            >
                <div className="flex items-center gap-4 text-3xl font-black uppercase tracking-wider">
                    <Play fill="white" size={32} />
                    {t('syllableQuestMessages.startGame')}
                </div>
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className={`absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:${styles.animateShine}`} />
                </div>
            </button>
        </div>
    );
}

function TutorialScreen({ onClose, language }: { onClose: () => void, language: string }) {
    const instructions: Record<string, string> = {
        es: "Separa las sílabas correctamente",
        en: "Separate the syllables correctly",
        pt: "Separe as sílabas corretamente",
        fr: "Séparez les syllabes correctement",
        it: "Separa correttamente le sillabe"
    };

    const subtext: Record<string, string> = {
        es: "Haz clic entre las letras para cortar",
        en: "Click between letters to cut",
        pt: "Clique entre as letras para cortar",
        fr: "Cliquez entre les lettres pour couper",
        it: "Clicca tra le lettere per tagliare"
    };

    return (
        <div className={`absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center text-white p-8 text-center backdrop-blur-sm ${styles.animateFadeIn}`}>
            <HelpCircle size={64} className="text-yellow-400 mb-6 animate-bounce" />
            <h2 className="text-4xl font-bold mb-4 font-mono">{instructions[language]}</h2>
            <p className="text-xl mb-12 text-gray-300 max-w-lg">{subtext[language]}</p>

            {/* Demo Graphic */}
            <div className="flex items-center gap-1 text-5xl font-bold mb-12 opacity-80">
                <span>B</span>
                <span>A</span>
                <div className="w-4 h-12 bg-yellow-400 rounded-full mx-1 animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.6)]"></div>
                <span>N</span>
                <span>A</span>
                <div className="w-4 h-12 bg-gray-600 rounded-full mx-1 opacity-30 border border-white/20"></div>
                <span>N</span>
                <span>A</span>
            </div>

            <button
                onClick={onClose}
                className="px-8 py-3 bg-green-600 rounded-xl text-xl font-bold shadow-[0_6px_0_#14532d] hover:bg-green-500 active:shadow-[0_3px_0_#14532d] active:translate-y-1 transition-all"
            >
                {/* This could also be localized, leaving as is for now or use t('common.ok') if existed */}
                {language === 'en' ? 'Got it!' : '¡Entendido!'}
            </button>
        </div>
    );
}

function GameLevel({ currentWord, onSuccess, onFail, language }: { currentWord: { word: string, splits: number[] }, onSuccess: (points: number) => void, onFail: () => void, language: string }) {
    const t = useTranslations('GamesPage');
    const [userSplits, setUserSplits] = useState<boolean[]>([]); // Array of booleans
    const [status, setStatus] = useState<'active' | 'correct' | 'incorrect'>('active');

    // Reset state when word changes
    useEffect(() => {
        // Initialize splits array based on word length - 1 (spaces between letters)
        // "CASA" (4 letters) -> 3 spaces: C_A_S_A
        setUserSplits(new Array(currentWord.word.length - 1).fill(false));
        setStatus('active');
    }, [currentWord]);

    const toggleSplit = (index: number) => {
        if (status !== 'active') return;
        const newSplits = [...userSplits];
        newSplits[index] = !newSplits[index];
        setUserSplits(newSplits);
    };

    const checkAnswer = () => {
        // Generate the user's split indices
        const currentSplitIndices = userSplits
            .map((isSplit, index) => isSplit ? index + 1 : null)
            .filter((val): val is number => val !== null); // Indices where splits are true

        // Compare with correct splits
        const isCorrect = JSON.stringify(currentSplitIndices) === JSON.stringify(currentWord.splits);

        if (isCorrect) {
            setStatus('correct');
            onSuccess(100);
        } else {
            setStatus('incorrect');
            // Shake effect timeout
            setTimeout(() => {
                setStatus('active');
            }, 800);
            onFail();
        }
    };

    const letters = currentWord.word.split('');

    return (
        <div className={`flex-1 flex flex-col items-center justify-center z-10 w-full ${styles.animateFadeIn}`}>

            {/* Word Rendering Area */}
            <div className={`
        flex items-center justify-center flex-wrap gap-y-8 px-4 py-12 mb-8
        transition-transform duration-300
        ${status === 'incorrect' ? styles.animateShake : ''}
        ${status === 'correct' ? 'scale-110' : ''}
      `}>
                {letters.map((letter, index) => (
                    <React.Fragment key={index}>
                        {/* The Letter */}
                        <div className="text-6xl md:text-8xl font-bold text-white drop-shadow-md font-mono relative">
                            {letter}
                        </div>

                        {/* The Interaction Space (Between letters) */}
                        {index < letters.length - 1 && (
                            <button
                                onClick={() => toggleSplit(index)}
                                className={`
                  mx-2 md:mx-4 w-6 h-16 md:h-24 rounded-full transition-all duration-200 flex items-center justify-center
                  hover:bg-white/10 focus:outline-none
                  ${userSplits[index]
                                        ? 'bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] scale-110'
                                        : 'bg-white/5 border border-white/10 hover:border-white/30 scale-90'}
                `}
                            >
                                {userSplits[index] && <div className="w-1 h-12 bg-yellow-600/50 rounded-full"></div>}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Feedback Message */}
            <div className="h-16 mb-8 flex items-center justify-center">
                {status === 'correct' && (
                    <div className="bg-green-500 text-white px-6 py-2 rounded-full font-bold text-xl animate-bounce flex items-center gap-2">
                        <Check size={24} /> {t('syllableQuestMessages.correct')}
                    </div>
                )}
                {status === 'incorrect' && (
                    <div className="bg-red-500 text-white px-6 py-2 rounded-full font-bold text-xl flex items-center gap-2">
                        <VolumeX size={24} /> {t('syllableQuestMessages.incorrect')}
                    </div>
                )}
            </div>

            {/* Action Button */}
            <button
                onClick={checkAnswer}
                disabled={status !== 'active'}
                className={`
          px-16 py-5 rounded-2xl text-2xl font-black tracking-wider uppercase transition-all
          shadow-[0_8px_0_rgba(0,0,0,0.3)]
          ${status === 'active'
                        ? 'bg-orange-500 text-white hover:bg-orange-400 hover:-translate-y-1 active:translate-y-1 active:shadow-[0_4px_0_rgba(0,0,0,0.3)]'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
        `}
            >
                {t('syllableQuestMessages.check')}
            </button>
        </div>
    );
}

function GameOverScreen({ score, onRestart, onHome }: { score: number, onRestart: () => void, onHome: () => void }) {
    const t = useTranslations('GamesPage');
    return (
        <div className={`flex flex-col items-center justify-center h-full z-10 text-white ${styles.animateZoomIn}`}>
            <Trophy size={80} className="text-yellow-400 mb-6 drop-shadow-lg" />
            <h2 className="text-5xl font-bold mb-2">{t('syllableQuestMessages.gameOver')}</h2>
            <p className="text-2xl mb-8 opacity-90">{t('syllableQuestMessages.finalScore')}</p>

            <div className="bg-white/10 p-6 rounded-2xl border-2 border-white/20 mb-12 backdrop-blur-sm">
                <span className="text-7xl font-mono font-bold text-yellow-300">{score}</span>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={onHome}
                    className="p-4 bg-gray-600 rounded-xl hover:bg-gray-500 transition shadow-[0_4px_0_#374151]"
                >
                    <Home size={32} />
                </button>
                <button
                    onClick={onRestart}
                    className="px-8 py-4 bg-green-600 rounded-xl text-xl font-bold flex items-center gap-2 shadow-[0_6px_0_#14532d] hover:bg-green-500 active:translate-y-1 active:shadow-[0_3px_0_#14532d] transition"
                >
                    <RotateCcw size={24} />
                    {t('syllableQuestMessages.playAgain')}
                </button>
            </div>
        </div>
    );
}
