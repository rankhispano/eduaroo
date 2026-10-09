// Roo, la mascota de Eduaroo, en SVG animado.
// Cada pose está pensada para un momento de la app:
//   idle       en reposo (portada, cabeceras)
//   wave       saludo (Mi mapa, bienvenida)
//   celebrate  acierto o bloque terminado
//   encourage  fallo: "¡casi, tú puedes!"
//   think      pista, examen, "¿qué estás dando en clase?"
//   point      señala algo ("¡Aquí!", seguir por donde ibas)
//   read       ideas clave / explicación
//   calculator Matemáticas (como la ilustración original)
//   sleep      nada pendiente (repaso vacío)

import RooIdleMascot from './RooIdleMascot';

export type RooPose = 'idle' | 'wave' | 'celebrate' | 'encourage' | 'think' | 'point' | 'read' | 'calculator' | 'sleep';

const C = {
    line: '#5A3424',
    fur: '#E8892F',
    furShade: '#CF7322',
    cream: '#F8CD93',
    earInner: '#F2A1A0',
    nose: '#5A3420',
    iris: '#3A2216',
    mouth: '#7A2E2A',
    tongue: '#F07F8C',
    hat: '#8E8C50',
    hatBrim: '#76743F',
    hatBand: '#5D5B31',
    gold: '#E9C46A',
    belt: '#3B78C2',
    pouch: '#2D61A2',
    blush: '#F59B9B',
};

const STROKE = { stroke: C.line, strokeWidth: 2.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

// Ángulo de cada brazo (0 = hacia abajo, positivo = hacia la izquierda de la pantalla) y largo
type ArmSpec = { angle: number; length?: number; className?: string; fist?: boolean; bend?: number };
const ARMS: Record<RooPose, { left: ArmSpec; right: ArmSpec }> = {
    idle: { left: { angle: -28 }, right: { angle: 28 } },
    wave: { left: { angle: -28 }, right: { angle: -118, length: 30, bend: 5, className: 'roo-wave' } },
    celebrate: { left: { angle: 122, length: 30, className: 'roo-wiggle' }, right: { angle: -122, length: 30, className: 'roo-wiggle-r' } },
    encourage: { left: { angle: -28 }, right: { angle: -128, length: 27, className: 'roo-pump', fist: true } },
    think: { left: { angle: -28 }, right: { angle: 172, length: 19 } },
    point: { left: { angle: -28 }, right: { angle: -96, length: 31, bend: -5, className: 'roo-point' } },
    read: { left: { angle: -4 }, right: { angle: 4 } },
    calculator: { left: { angle: -4 }, right: { angle: 4 } },
    sleep: { left: { angle: -24 }, right: { angle: 24 } },
};

function Arm({ x, y, spec }: { x: number; y: number; spec: ArmSpec }) {
    const L = spec.length ?? 26;
    // bend curva el antebrazo para que el codo forme un arco natural
    const k = spec.bend ?? 0;
    return (
        <g transform={`translate(${x} ${y}) rotate(${spec.angle})`}>
            <g className={spec.className}>
                <path
                    d={`M -7.5 -3 C ${-10.5 + k} ${L * 0.35}, ${-8.5 + k} ${L * 0.7}, -5 ${L - 1} L 6 ${L - 1} C ${9 + k} ${L * 0.65}, ${9.5 + k} ${L * 0.3}, 7.5 -3 Z`}
                    fill={C.fur}
                    {...STROKE}
                />
                {spec.fist ? (
                    <>
                        <circle cx={0.5} cy={L + 1.5} r={7.4} fill={C.fur} {...STROKE} />
                        <path d={`M -3.5 ${L - 1} Q 0.5 ${L + 2.5} 4.5 ${L - 1}`} fill="none" {...STROKE} strokeWidth={1.6} />
                    </>
                ) : (
                    <>
                        {/* Mitón: pulgar + palma con dos dedos insinuados */}
                        <ellipse cx={-6} cy={L + 1} rx={2.8} ry={3.6} fill={C.fur} {...STROKE} strokeWidth={2} />
                        <path d={`M -5.5 ${L - 2} C -7.5 ${L + 4}, -4.5 ${L + 9}, 0.5 ${L + 8.6} C 5.5 ${L + 9}, 8.5 ${L + 4}, 6.5 ${L - 2} Z`} fill={C.fur} {...STROKE} />
                        <path d={`M -1.6 ${L + 5} L -1.6 ${L + 8} M 2.4 ${L + 5} L 2.4 ${L + 8}`} stroke={C.line} strokeWidth={1.4} strokeLinecap="round" />
                    </>
                )}
            </g>
        </g>
    );
}

type EyeStyle = 'open' | 'happy' | 'think' | 'closed';
type MouthStyle = 'smile' | 'open' | 'big' | 'soft' | 'crooked' | 'serene' | 'focused' | 'sleep';
type BrowStyle = 'normal' | 'raised' | 'empathic' | 'oneUp' | 'none';

const FACE: Record<RooPose, { eyes: EyeStyle; mouth: MouthStyle; brows: BrowStyle; look: { dx: number; dy: number } }> = {
    idle: { eyes: 'open', mouth: 'smile', brows: 'normal', look: { dx: 0.4, dy: 0.3 } },
    wave: { eyes: 'open', mouth: 'open', brows: 'raised', look: { dx: 0.4, dy: 0.2 } },
    celebrate: { eyes: 'happy', mouth: 'big', brows: 'raised', look: { dx: 0, dy: 0 } },
    encourage: { eyes: 'open', mouth: 'soft', brows: 'empathic', look: { dx: 0.3, dy: 0.4 } },
    think: { eyes: 'think', mouth: 'crooked', brows: 'oneUp', look: { dx: 1.5, dy: -1.7 } },
    point: { eyes: 'open', mouth: 'open', brows: 'raised', look: { dx: 1.8, dy: 0 } },
    read: { eyes: 'open', mouth: 'serene', brows: 'normal', look: { dx: 0.4, dy: 1.9 } },
    calculator: { eyes: 'open', mouth: 'focused', brows: 'normal', look: { dx: 0.2, dy: 1.6 } },
    sleep: { eyes: 'closed', mouth: 'sleep', brows: 'none', look: { dx: 0, dy: 0 } },
};

// Centro de los ojos (más separados y algo más altos que el hocico: proporción infantil)
const EYES = [
    { x: 84, y: 66 },
    { x: 108, y: 64 },
];

function FaceEye({ x, y, style, look }: { x: number; y: number; style: EyeStyle; look: { dx: number; dy: number } }) {
    if (style === 'happy') return <path d={`M ${x - 7} ${y + 2.5} Q ${x} ${y - 6.5} ${x + 7} ${y + 2.5}`} fill="none" {...STROKE} strokeWidth={3} />;
    if (style === 'closed') return <path d={`M ${x - 7} ${y} Q ${x} ${y + 6} ${x + 7} ${y}`} fill="none" {...STROKE} strokeWidth={3} />;
    const ix = x + look.dx;
    const iy = y + look.dy;
    return (
        <g className="roo-blink">
            <ellipse cx={x} cy={y} rx={8} ry={9.2} fill="#fff" stroke={C.line} strokeWidth={2} />
            <circle cx={ix} cy={iy + 0.6} r={5.7} fill={C.iris} />
            <circle cx={ix - 2} cy={iy - 1.6} r={2.3} fill="#fff" />
            <circle cx={ix + 2.1} cy={iy + 2.6} r={1} fill="#fff" />
        </g>
    );
}

function FaceBrow({ x, y, lift = 0, tiltIn = 0 }: { x: number; y: number; lift?: number; tiltIn?: number }) {
    // tiltIn > 0 eleva el extremo interior (hacia el centro de la cara)
    const inner = x < 96 ? 1 : -1;
    const yl = y - lift + (inner === -1 ? -tiltIn : 0);
    const yr = y - lift + (inner === 1 ? -tiltIn : 0);
    return <path d={`M ${x - 5.5} ${yl} Q ${x} ${y - lift - 3.2} ${x + 5.5} ${yr}`} fill="none" {...STROKE} strokeWidth={2.1} />;
}

function FaceMouth({ style }: { style: MouthStyle }) {
    const line = { fill: 'none', ...STROKE, strokeWidth: 2.3 };
    switch (style) {
        case 'smile':
            // Sonrisa en "w" con las comisuras hacia arriba
            return <path d="M 120.5 84.5 Q 121.5 86.6 123.4 86.3 Q 127 89.6 130 85.6 Q 133 89.6 136.6 86.3 Q 138.5 86.6 139.5 84.5" {...line} />;
        case 'open':
            return (
                <g>
                    <path d="M 121.5 85 Q 130 87 138.5 85 Q 137.2 94.2 130 94.2 Q 122.8 94.2 121.5 85 Z" fill={C.mouth} {...STROKE} strokeWidth={2.1} />
                    <path d="M 124.6 90.6 Q 130 87.9 135.4 90.6 Q 133.6 94.1 130 94.1 Q 126.4 94.1 124.6 90.6 Z" fill={C.tongue} />
                </g>
            );
        case 'big':
            // Boca abierta en "D"
            return (
                <g>
                    <path d="M 119.5 84.2 Q 130 86.4 140.5 84.2 Q 139.5 97.5 130 97.5 Q 120.5 97.5 119.5 84.2 Z" fill={C.mouth} {...STROKE} strokeWidth={2.1} />
                    <path d="M 123.5 92.4 Q 130 88.8 136.5 92.4 Q 134.5 97.3 130 97.3 Q 125.5 97.3 123.5 92.4 Z" fill={C.tongue} />
                </g>
            );
        case 'soft':
            // Sonrisa cálida, algo ladeada
            return <path d="M 121.5 86 Q 128.5 92.6 138 84.6 Q 139.4 84 139.6 82.6" {...line} />;
        case 'crooked':
            // Sonrisa torcida hacia un lado (pensando, nunca disgustado)
            return <path d="M 124 87.4 Q 129.5 89.8 136 85.6 Q 137.6 84.8 137.8 83.4" {...line} />;
        case 'serene':
            return <path d="M 124.5 86 Q 130 90.8 135.5 86" {...line} />;
        case 'focused':
            return <path d="M 122.5 85.6 Q 129.5 91.6 137 85.4 Q 138.6 84.8 138.9 83.4" {...line} />;
        case 'sleep':
            return <path d="M 126 87.4 Q 130 90 134 87.4" {...line} />;
    }
}

// Cara compartida por las 9 poses: hocico, nariz, boca, ojos, cejas y mejillas
function KangarooFace({ eyes, mouth, brows, look }: { eyes: EyeStyle; mouth: MouthStyle; brows: BrowStyle; look: { dx: number; dy: number } }) {
    const [left, right] = EYES;
    const browY = (e: { y: number }) => e.y - 11.6;
    return (
        <g>
            {/* Hocico: óvalo corto y ancho, con la punta ligeramente hacia arriba */}
            <path d="M 104 83 C 104 74, 113 68.5, 124 68.5 C 134 68.5, 141 72, 141.5 78.5 C 142 88, 134 97.5, 122 97.5 C 111.5 97.5, 104 91.5, 104 83 Z" fill={C.cream} {...STROKE} />
            {/* Mejillas */}
            <ellipse cx={75} cy={82} rx={5.6} ry={4.6} fill={C.blush} opacity={0.55} />
            <ellipse cx={100.5} cy={92} rx={4.6} ry={3.8} fill={C.blush} opacity={0.55} />

            {[left, right].map((e) => (
                <FaceEye key={e.x} x={e.x} y={e.y} style={eyes} look={look} />
            ))}

            {brows === 'none' ? null : (
                <>
                    <FaceBrow x={left.x} y={browY(left)} lift={brows === 'raised' || brows === 'empathic' ? 1.6 : 0} tiltIn={brows === 'empathic' ? 1.8 : 0} />
                    <FaceBrow x={right.x} y={browY(right)} lift={brows === 'raised' || brows === 'empathic' ? 1.6 : brows === 'oneUp' ? 3.6 : 0} tiltIn={brows === 'empathic' ? 1.8 : 0} />
                </>
            )}

            {/* Nariz en corazón invertido, filtrum y brillo */}
            <path d="M 124.4 73.4 C 124.4 70.4, 135.6 70.4, 135.6 73.4 C 135.6 76.6, 131.8 79.6, 130 79.9 C 128.2 79.6, 124.4 76.6, 124.4 73.4 Z" fill={C.nose} />
            <circle cx={127.4} cy={73} r={1.6} fill="#fff" opacity={0.8} />
            <path d="M 130 79.9 L 130 85" fill="none" {...STROKE} strokeWidth={2} />
            <FaceMouth style={mouth} />
        </g>
    );
}

function Props({ pose }: { pose: RooPose }) {
    switch (pose) {
        case 'calculator':
            return (
                <g transform="rotate(-6 101 140)">
                    <rect x={81} y={118} width={38} height={46} rx={6} fill="#F1F3F7" {...STROKE} />
                    <rect x={87} y={121} width={28} height={10} rx={2} fill="#CFE8D8" stroke={C.line} strokeWidth={1.5} />
                    {[0, 1, 2].map((r) =>
                        [0, 1, 2].map((c) => (
                            <circle key={`${r}${c}`} cx={91 + c * 10} cy={139 + r * 8.5} r={3} fill={['#7C6CF2', '#4FA3E8', '#F2895B'][c]} />
                        )),
                    )}
                </g>
            );
        case 'read':
            return (
                <g>
                    <path d="M 100 132 Q 88 126 76 130 L 76 154 Q 88 150 100 156 Z" fill="#fff" {...STROKE} />
                    <path d="M 100 132 Q 112 126 124 130 L 124 154 Q 112 150 100 156 Z" fill="#fff" {...STROKE} />
                    <path d="M 81 137 L 95 139 M 81 143 L 95 145 M 105 139 L 119 137 M 105 145 L 119 143" stroke="#9AA6B8" strokeWidth={1.6} strokeLinecap="round" />
                    <path d="M 76 154 Q 88 150 100 156 Q 112 150 124 154 L 124 157 Q 112 153 100 159 Q 88 153 76 157 Z" fill="#E86F5B" {...STROKE} strokeWidth={2} />
                </g>
            );
        case 'celebrate':
            return (
                <g>
                    {[
                        [36, 52, 0],
                        [164, 46, 0.25],
                        [28, 112, 0.5],
                        [172, 108, 0.75],
                        [150, 18, 0.4],
                    ].map(([x, y, d]) => (
                        <path
                            key={`${x}-${y}`}
                            className="roo-sparkle"
                            style={{ animationDelay: `${d}s` }}
                            d={`M ${x} ${y - 8} Q ${x + 1.5} ${y - 1.5} ${x + 8} ${y} Q ${x + 1.5} ${y + 1.5} ${x} ${y + 8} Q ${x - 1.5} ${y + 1.5} ${x - 8} ${y} Q ${x - 1.5} ${y - 1.5} ${x} ${y - 8} Z`}
                            fill={C.gold}
                            stroke="#C9952E"
                            strokeWidth={1.2}
                        />
                    ))}
                </g>
            );
        case 'think':
            return (
                <g>
                    <circle className="roo-dot" style={{ animationDelay: '0s' }} cx={150} cy={56} r={3.5} fill="#fff" {...STROKE} strokeWidth={1.8} />
                    <circle className="roo-dot" style={{ animationDelay: '0.3s' }} cx={160} cy={44} r={5} fill="#fff" {...STROKE} strokeWidth={1.8} />
                    <g className="roo-dot" style={{ animationDelay: '0.6s' }}>
                        <circle cx={176} cy={24} r={13} fill="#fff" {...STROKE} strokeWidth={2} />
                        <text x={176} y={30.5} textAnchor="middle" fontSize={18} fontWeight={900} fontFamily="ui-rounded, system-ui, sans-serif" fill={C.belt}>?</text>
                    </g>
                </g>
            );
        case 'sleep':
            return (
                <g fontFamily="ui-rounded, system-ui, sans-serif" fontWeight={900} fill={C.belt}>
                    <text className="roo-z" style={{ animationDelay: '0s' }} x={148} y={40} fontSize={14}>z</text>
                    <text className="roo-z" style={{ animationDelay: '1s' }} x={148} y={40} fontSize={18}>z</text>
                    <text className="roo-z" style={{ animationDelay: '2s' }} x={148} y={40} fontSize={22}>Z</text>
                </g>
            );
        default:
            return null;
    }
}

const BODY_ANIM: Record<RooPose, string> = {
    idle: 'roo-breathe',
    wave: 'roo-breathe',
    celebrate: 'roo-jump',
    encourage: 'roo-bounce',
    think: 'roo-breathe',
    point: 'roo-breathe',
    read: 'roo-breathe',
    calculator: 'roo-breathe',
    sleep: 'roo-breathe-slow',
};

const HEAD_ANIM: Partial<Record<RooPose, string>> = {
    think: 'roo-tilt',
    read: 'roo-nod',
    sleep: 'roo-doze',
    encourage: 'roo-nod',
};

const STYLES = `
.roo-svg * { transform-box: view-box; }
.roo-breathe { animation: roo-breathe 3.2s ease-in-out infinite; transform-origin: 100px 230px; }
.roo-breathe-slow { animation: roo-breathe 5s ease-in-out infinite; transform-origin: 100px 230px; }
@keyframes roo-breathe { 50% { transform: scale(1.012, 1.02); } }
.roo-jump { animation: roo-jump 1.1s cubic-bezier(.3,.7,.4,1) infinite; transform-origin: 100px 232px; }
@keyframes roo-jump { 0%,100% { transform: translateY(0) scale(1.05,.95); } 15% { transform: translateY(0) scale(1,1); } 45% { transform: translateY(-24px) scale(.97,1.04); } 75% { transform: translateY(0) scale(1.05,.95); } 85% { transform: translateY(0) scale(1,1); } }
.roo-shadow { transform-origin: 100px 232px; }
.roo-shadow-jump { animation: roo-shadow 1.1s cubic-bezier(.3,.7,.4,1) infinite; transform-origin: 100px 232px; }
@keyframes roo-shadow { 45% { transform: scale(.65); opacity: .45; } }
.roo-bounce { animation: roo-bounce 1.4s ease-in-out infinite; transform-origin: 100px 232px; }
@keyframes roo-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
.roo-blink { animation: roo-blink 4.2s infinite; transform-box: fill-box; transform-origin: center; }
@keyframes roo-blink { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(.1); } }
.roo-tail { animation: roo-tail 2.6s ease-in-out infinite; transform-origin: 68px 196px; }
@keyframes roo-tail { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(5deg); } }
.roo-ear { animation: roo-ear 5s ease-in-out infinite; transform-origin: 112px 52px; }
@keyframes roo-ear { 0%, 84%, 100% { transform: rotate(0); } 89% { transform: rotate(-12deg); } 94% { transform: rotate(4deg); } }
.roo-wave { animation: roo-wave .45s ease-in-out infinite alternate; transform-origin: 0 0; }
@keyframes roo-wave { from { transform: rotate(-16deg); } to { transform: rotate(16deg); } }
.roo-wiggle { animation: roo-wiggle .55s ease-in-out infinite alternate; transform-origin: 0 0; }
.roo-wiggle-r { animation: roo-wiggle .55s ease-in-out infinite alternate-reverse; transform-origin: 0 0; }
@keyframes roo-wiggle { from { transform: rotate(-10deg); } to { transform: rotate(10deg); } }
.roo-pump { animation: roo-pump .7s ease-in-out infinite alternate; transform-origin: 0 0; }
@keyframes roo-pump { from { transform: rotate(-6deg); } to { transform: rotate(14deg); } }
.roo-point { animation: roo-point .8s ease-in-out infinite alternate; transform-origin: 0 0; }
@keyframes roo-point { from { transform: translateY(0); } to { transform: translateY(5px); } }
.roo-tilt { animation: roo-tilt 3s ease-in-out infinite; transform-origin: 100px 100px; }
@keyframes roo-tilt { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(6deg); } }
.roo-nod { animation: roo-nod 2.4s ease-in-out infinite; transform-origin: 100px 100px; }
@keyframes roo-nod { 0%,100% { transform: rotate(0); } 50% { transform: rotate(4deg); } }
.roo-doze { animation: roo-doze 5s ease-in-out infinite; transform-origin: 100px 100px; }
@keyframes roo-doze { 0%,100% { transform: rotate(7deg); } 50% { transform: rotate(10deg); } }
.roo-sparkle { animation: roo-twinkle 1.1s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes roo-twinkle { 0%,100% { transform: scale(.4) rotate(0); opacity: .35; } 50% { transform: scale(1.1) rotate(20deg); opacity: 1; } }
.roo-dot { animation: roo-dot 2.4s ease-in-out infinite; opacity: 0; }
@keyframes roo-dot { 0% { opacity: 0; } 15%, 80% { opacity: 1; } 100% { opacity: 0; } }
.roo-z { animation: roo-z 3s linear infinite; opacity: 0; }
@keyframes roo-z { 0% { transform: translate(0, 0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(16px, -30px); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .roo-svg * { animation: none !important; } .roo-dot, .roo-z { opacity: 1; } }
`;

export default function RooMascot({
    pose = 'idle',
    size = 160,
    className = '',
    title = pose === 'idle' ? 'Roo, la mascota de Eduaroo (en reposo)' : 'Roo, la mascota de Eduaroo',
}: {
    pose?: RooPose;
    size?: number;
    className?: string;
    title?: string;
}) {
    if (pose === 'idle') return <RooIdleMascot size={size} className={className} title={title} />;

    const arms = ARMS[pose];
    const holding = pose === 'calculator' || pose === 'read';

    return (
        <svg
            viewBox="0 0 200 240"
            width={size}
            height={(size * 240) / 200}
            role="img"
            aria-label={title}
            className={`roo-svg ${className}`}
            style={{ overflow: 'visible' }}
        >
            <style>{STYLES}</style>

            <ellipse className={pose === 'celebrate' ? 'roo-shadow-jump' : 'roo-shadow'} cx={100} cy={232} rx={56} ry={6} fill="#1E293B" opacity={0.12} />

            <g className={BODY_ANIM[pose]}>
                {/* Cola */}
                <path className="roo-tail" d="M 70 198 C 38 206, 16 188, 20 160 C 22 147, 34 149, 34 160 C 34 180, 50 191, 72 186 Z" fill={C.fur} {...STROKE} />

                {/* Patas traseras y pies */}
                <ellipse cx={78} cy={196} rx={21} ry={25} fill={C.furShade} {...STROKE} />
                <ellipse cx={122} cy={196} rx={21} ry={25} fill={C.furShade} {...STROKE} />
                <ellipse cx={80} cy={225} rx={23} ry={7.5} fill={C.fur} {...STROKE} />
                <ellipse cx={122} cy={225} rx={25} ry={7.5} fill={C.fur} {...STROKE} />
                <path d="M 66 225 L 66 229 M 74 226 L 74 230 M 132 226 L 132 230 M 140 225 L 140 229" stroke={C.line} strokeWidth={1.5} strokeLinecap="round" />

                {/* Cuerpo y panza */}
                <path d="M 100 94 C 82 94, 72 120, 68 150 C 63 188, 80 211, 100 211 C 120 211, 137 188, 132 150 C 128 120, 118 94, 100 94 Z" fill={C.fur} {...STROKE} />
                <path d="M 100 118 C 86 118, 80 140, 80 165 C 80 188, 89 203, 100 203 C 111 203, 120 188, 120 165 C 120 140, 114 118, 100 118 Z" fill={C.cream} />

                {/* Cinturón con riñonera */}
                <path d="M 67.5 152 Q 100 165 132.5 152 L 132.2 161 Q 100 174 67.8 161 Z" fill={C.belt} {...STROKE} strokeWidth={2} />
                <rect x={96} y={159} width={9} height={8} rx={1.5} fill={C.gold} stroke={C.line} strokeWidth={1.5} />
                <rect x={69} y={155} width={14} height={12} rx={3} fill={C.pouch} {...STROKE} strokeWidth={2} />

                {holding ? <Props pose={pose} /> : null}

                {/* Brazos */}
                <Arm x={85} y={114} spec={arms.left} />
                <Arm x={115} y={114} spec={arms.right} />

                {/* Cabeza */}
                <g className={HEAD_ANIM[pose]}>
                    <path d="M 78 56 C 60 42, 52 6, 62 -2 C 72 -8, 90 22, 90 50 Z" fill={C.fur} {...STROKE} />
                    <path d="M 79 48 C 66 37, 60 12, 65 6 C 70 2, 84 24, 86 44 Z" fill={C.earInner} />
                    <g className="roo-ear">
                        <path d="M 106 50 C 108 22, 124 -6, 137 -2 C 147 3, 138 36, 120 58 Z" fill={C.fur} {...STROKE} />
                        <path d="M 110 47 C 113 25, 125 5, 133 6 C 139 10, 131 34, 119 50 Z" fill={C.earInner} />
                    </g>
                    <path d="M 98 43 C 78 43, 65 56, 65 74 C 65 92, 80 103, 99 103 C 115 103, 127 94, 129 80 C 131 60, 117 43, 98 43 Z" fill={C.fur} {...STROKE} />
                    <KangarooFace {...FACE[pose]} />

                    {/* Sombrero de explorador con brújula */}
                    <g transform="translate(0 -8) rotate(-4 98 46)">
                        <path d="M 74 47 C 74 19, 122 19, 122 47 Z" fill={C.hat} {...STROKE} />
                        <path d="M 75 42 Q 98 46.5 121 42 L 122 47 Q 98 51.5 74 47 Z" fill={C.hatBand} />
                        <ellipse cx={98} cy={48} rx={35} ry={7} fill={C.hatBrim} {...STROKE} />
                        <circle cx={98} cy={33} r={5.8} fill={C.gold} stroke={C.line} strokeWidth={1.6} />
                        <circle cx={98} cy={33} r={3.5} fill="#fff" />
                        <path d="M 98 30 L 99.2 33 L 98 36 L 96.8 33 Z" fill="#D9473F" />
                    </g>
                </g>

                {!holding ? <Props pose={pose} /> : null}
            </g>
        </svg>
    );
}
