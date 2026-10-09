'use client';

import Image from 'next/image';
import { Link, useRouter } from '@/i18n/navigation';
import RooMascot from '@/components/mascot/RooMascot';
import type { AsignaturaId } from '@/src/types';

export type MapRegion = {
    id: AsignaturaId;
    region: string;
    shortName: string;
    color: string;
    image: string;
    earned: number;
    possible: number;
    href: string | null;
};

// Posición de cada región en el dibujo (unidades del viewBox 1000x700) y de su etiqueta
const SPOTS: Record<AsignaturaId, { x: number; y: number; labelY: number; align?: 'left' | 'right' }> = {
    mates: { x: 330, y: 230, labelY: 335 },
    sociales: { x: 650, y: 235, labelY: 345 },
    lengua: { x: 300, y: 480, labelY: 585 },
    naturales: { x: 835, y: 575, labelY: 668, align: 'right' },
    ingles: { x: 880, y: 135, labelY: 222, align: 'right' },
};
const CENTER = { x: 520, y: 420 };
const W = 1000;
const H = 700;

const LINE = { stroke: '#5A3424', strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function Mountains() {
    return (
        <g>
            <path d="M 205 300 L 285 150 L 365 300 Z" fill="#A78BFA" {...LINE} />
            <path d="M 262 193 L 285 150 L 308 193 L 296 186 L 285 197 L 274 186 Z" fill="#fff" {...LINE} strokeWidth={3} />
            <path d="M 300 300 L 390 125 L 470 300 Z" fill="#8B5CF6" {...LINE} />
            <path d="M 365 173 L 390 125 L 415 173 L 402 165 L 390 177 L 378 165 Z" fill="#fff" {...LINE} strokeWidth={3} />
            <path d="M 250 300 L 320 200 L 400 300 Z" fill="#7C3AED" {...LINE} />
            <g fontFamily="ui-rounded, system-ui, sans-serif" fontWeight={900} fill="#fff" textAnchor="middle">
                <text x={318} y={278} fontSize={34}>3</text>
                <text x={392} y={240} fontSize={30}>+</text>
                <text x={262} y={270} fontSize={26}>÷</text>
            </g>
        </g>
    );
}

function Town() {
    return (
        <g>
            {/* Castillo */}
            <rect x={560} y={175} width={52} height={120} fill="#FBBF24" {...LINE} />
            <path d="M 556 175 L 556 158 L 568 158 L 568 168 L 580 168 L 580 158 L 592 158 L 592 168 L 604 168 L 604 158 L 616 158 L 616 175 Z" fill="#F59E0B" {...LINE} />
            <path d="M 586 158 L 586 128" {...LINE} />
            <path d="M 586 128 L 612 137 L 586 146 Z" fill="#EF4444" {...LINE} strokeWidth={3} />
            <path d="M 576 295 L 576 262 Q 586 248 596 262 L 596 295 Z" fill="#92400E" {...LINE} strokeWidth={3} />
            {/* Torre del reloj */}
            <rect x={630} y={150} width={50} height={145} fill="#FCD34D" {...LINE} />
            <path d="M 624 152 L 655 112 L 686 152 Z" fill="#DC2626" {...LINE} />
            <circle cx={655} cy={190} r={18} fill="#fff" {...LINE} />
            <path d="M 655 190 L 655 178 M 655 190 L 664 195" {...LINE} strokeWidth={3} />
            {/* Casas */}
            <rect x={694} y={230} width={56} height={65} fill="#FDE68A" {...LINE} />
            <path d="M 688 232 L 722 198 L 756 232 Z" fill="#F97316" {...LINE} />
            <rect x={712} y={256} width={18} height={18} fill="#93C5FD" {...LINE} strokeWidth={3} />
            <rect x={760} y={250} width={44} height={45} fill="#FEF3C7" {...LINE} />
            <path d="M 755 252 L 782 225 L 809 252 Z" fill="#EA580C" {...LINE} />
        </g>
    );
}

function Forest() {
    const tree = (x: number, y: number, r: number, color: string, letter: string) => (
        <g key={`${x}-${y}`}>
            <rect x={x - 6} y={y + r - 6} width={12} height={28} rx={4} fill="#92400E" {...LINE} strokeWidth={3} />
            <circle cx={x} cy={y} r={r} fill={color} {...LINE} />
            <text x={x} y={y + r * 0.35} textAnchor="middle" fontSize={r * 0.95} fontWeight={900} fontFamily="ui-rounded, system-ui, sans-serif" fill="#fff">
                {letter}
            </text>
        </g>
    );
    return (
        <g>
            {tree(225, 470, 38, '#16A34A', 'A')}
            {tree(370, 455, 42, '#22C55E', 'b')}
            {tree(300, 420, 46, '#15803D', 'C')}
            {tree(310, 515, 30, '#4ADE80', 'ñ')}
        </g>
    );
}

function Lab() {
    return (
        <g>
            {/* Zona más profunda del mar */}
            <ellipse cx={835} cy={585} rx={120} ry={70} fill="#5BC0E0" opacity={0.6} />
            {/* Muelle desde la isla */}
            <path d="M 735 520 L 790 548" stroke="#A16207" strokeWidth={12} strokeLinecap="round" />
            <path d="M 735 520 L 790 548" stroke="#CA8A04" strokeWidth={6} strokeLinecap="round" strokeDasharray="4 8" />
            {/* Cúpula del laboratorio */}
            <path d="M 775 605 C 775 545, 895 545, 895 605 Z" fill="#CCFBF1" fillOpacity={0.9} {...LINE} />
            <path d="M 795 590 C 800 565, 820 555, 840 553" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.9} />
            <rect x={770} y={603} width={130} height={14} rx={6} fill="#0F766E" {...LINE} />
            {/* Matraz */}
            <path d="M 828 568 L 828 582 L 816 600 L 852 600 L 840 582 L 840 568 Z" fill="#A7F3D0" {...LINE} strokeWidth={3} />
            <path d="M 820 594 L 848 594 L 852 600 L 816 600 Z" fill="#14B8A6" />
            {/* Burbujas */}
            {[
                [880, 540, 7],
                [895, 515, 5],
                [870, 500, 4],
            ].map(([x, y, r]) => (
                <circle key={`${x}`} cx={x} cy={y} r={r} fill="#fff" fillOpacity={0.7} stroke="#0E7490" strokeWidth={2} />
            ))}
        </g>
    );
}

function LanguageIsland() {
    return (
        <g>
            <path d="M 795 150 C 795 105, 860 85, 905 95 C 955 105, 975 145, 950 175 C 925 200, 840 205, 810 185 C 798 177, 795 165, 795 150 Z" fill="#F4DEA6" {...LINE} />
            <path d="M 812 150 C 815 118, 862 104, 900 110 C 938 117, 952 143, 935 163 C 915 182, 850 186, 828 172 C 818 166, 812 160, 812 150 Z" fill="#BFE39A" />
            {/* Palmera */}
            <path d="M 862 160 C 860 135, 866 115, 876 98" fill="none" stroke="#92400E" strokeWidth={9} strokeLinecap="round" />
            <path d="M 876 98 C 860 84, 840 86, 830 98 C 848 92, 862 96, 876 98 C 872 80, 880 66, 898 62 C 890 76, 886 86, 876 98 C 894 88, 914 92, 922 106 C 904 98, 890 98, 876 98 Z" fill="#22C55E" {...LINE} strokeWidth={3} />
            {/* Bocadillos */}
            <g fontFamily="ui-rounded, system-ui, sans-serif" fontWeight={900} textAnchor="middle">
                <rect x={900} y={44} width={70} height={34} rx={14} fill="#fff" {...LINE} strokeWidth={3} />
                <path d="M 915 78 L 910 90 L 928 78" fill="#fff" {...LINE} strokeWidth={3} />
                <text x={935} y={67} fontSize={20} fill="#EF4444">Hi!</text>
                <rect x={790} y={52} width={84} height={34} rx={14} fill="#fff" {...LINE} strokeWidth={3} />
                <path d="M 850 86 L 856 98 L 838 86" fill="#fff" {...LINE} strokeWidth={3} />
                <text x={832} y={75} fontSize={18} fill="#2563EB">¡Hola!</text>
            </g>
        </g>
    );
}

function Decorations() {
    return (
        <g>
            {/* Sol */}
            <g>
                {Array.from({ length: 8 }).map((_, i) => {
                    const a = (i * Math.PI) / 4;
                    return <path key={i} d={`M ${85 + Math.cos(a) * 48} ${80 + Math.sin(a) * 48} L ${85 + Math.cos(a) * 64} ${80 + Math.sin(a) * 64}`} stroke="#F59E0B" strokeWidth={6} strokeLinecap="round" />;
                })}
                <circle cx={85} cy={80} r={38} fill="#FCD34D" {...LINE} />
                <path d="M 72 86 Q 85 98 98 86" fill="none" {...LINE} strokeWidth={3} />
                <circle cx={74} cy={72} r={4} fill="#5A3424" />
                <circle cx={96} cy={72} r={4} fill="#5A3424" />
            </g>
            {/* Nubes */}
            <path className="map-cloud" d="M 480 70 C 470 45, 505 35, 520 52 C 532 32, 568 38, 568 62 C 588 62, 590 90, 568 92 L 488 92 C 462 92, 460 70, 480 70 Z" fill="#fff" stroke="#BAE6FD" strokeWidth={3} />
            {/* Barco */}
            <g className="map-boat">
                <path d="M 95 610 L 185 610 L 170 640 L 110 640 Z" fill="#EF4444" {...LINE} />
                <path d="M 140 610 L 140 545" {...LINE} />
                <path d="M 144 550 L 182 600 L 144 600 Z" fill="#fff" {...LINE} strokeWidth={3} />
                <path d="M 136 556 L 108 600 L 136 600 Z" fill="#FDE68A" {...LINE} strokeWidth={3} />
            </g>
            {/* Olas */}
            {[
                [60, 300],
                [110, 470],
                [940, 300],
                [960, 420],
                [470, 680],
                [620, 668],
                [220, 675],
            ].map(([x, y]) => (
                <path key={`${x}-${y}`} d={`M ${x} ${y} q 10 -10 20 0 q 10 10 20 0`} fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
            ))}
            {/* Pez */}
            <g transform="translate(965 520)">
                <path d="M -18 0 C -10 -12, 10 -12, 16 0 C 10 12, -10 12, -18 0 Z" fill="#FB923C" {...LINE} strokeWidth={3} />
                <path d="M 16 0 L 28 -9 L 28 9 Z" fill="#FB923C" {...LINE} strokeWidth={3} />
                <circle cx={-8} cy={-2} r={2.5} fill="#5A3424" />
            </g>
        </g>
    );
}

function Stars({ earned, possible }: { earned: number; possible: number }) {
    if (!possible) return null;
    return <span className="whitespace-nowrap text-[11px] font-black text-amber-600 sm:text-xs">★ {earned}/{possible}</span>;
}

export default function WorldMap({ regions, onNeedCourse }: { regions: MapRegion[]; onNeedCourse?: () => void }) {
    const router = useRouter();
    const go = (r: MapRegion) => (r.href ? router.push(r.href) : onNeedCourse?.());

    return (
        <div className="relative w-full overflow-hidden rounded-[2rem] border-4 border-white shadow-lg" style={{ aspectRatio: `${W} / ${H}` }}>
            <style>{`
                .map-cloud { animation: map-drift 14s ease-in-out infinite alternate; }
                @keyframes map-drift { to { transform: translateX(60px); } }
                .map-boat { animation: map-bob 3s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
                @keyframes map-bob { 50% { transform: translateY(-6px) rotate(-3deg); } }
                .map-spot { cursor: pointer; transition: transform .2s; transform-box: fill-box; transform-origin: center bottom; }
                .map-spot:hover { transform: scale(1.04); }
                @media (prefers-reduced-motion: reduce) { .map-cloud, .map-boat { animation: none; } }
            `}</style>
            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" role="img" aria-label="Mapa del mundo de Roo">
                <rect width={W} height={H} fill="#9FDCF2" />
                <Decorations />

                {/* Isla principal: arena y hierba */}
                <path d="M 150 330 C 140 200, 260 110, 420 115 C 560 80, 730 115, 800 220 C 868 320, 850 470, 765 560 C 680 645, 500 655, 360 625 C 215 600, 140 470, 150 330 Z" fill="#F4DEA6" {...LINE} />
                <path
                    d="M 150 330 C 140 200, 260 110, 420 115 C 560 80, 730 115, 800 220 C 868 320, 850 470, 765 560 C 680 645, 500 655, 360 625 C 215 600, 140 470, 150 330 Z"
                    fill="#BFE39A"
                    transform="translate(490 370) scale(0.92) translate(-490 -370)"
                />

                {/* Caminos desde la plaza central */}
                {(Object.keys(SPOTS) as AsignaturaId[]).map((id) => {
                    const s = SPOTS[id];
                    const mx = (CENTER.x + s.x) / 2 + (s.y < CENTER.y ? -30 : 30);
                    const my = (CENTER.y + s.y) / 2;
                    return <path key={id} d={`M ${CENTER.x} ${CENTER.y} Q ${mx} ${my} ${s.x} ${s.y + 60}`} fill="none" stroke="#E9B44C" strokeWidth={10} strokeLinecap="round" strokeDasharray="2 22" />;
                })}
                <ellipse cx={CENTER.x} cy={CENTER.y + 28} rx={70} ry={26} fill="#F4DEA6" {...LINE} strokeWidth={3} />

                {regions.map((r) => {
                    const Drawing = { mates: Mountains, sociales: Town, lengua: Forest, naturales: Lab, ingles: LanguageIsland }[r.id];
                    return (
                        <g key={r.id} className="map-spot" onClick={() => go(r)} aria-hidden>
                            <Drawing />
                        </g>
                    );
                })}
            </svg>

            {/* Roo en la plaza central */}
            <div className="pointer-events-none absolute" style={{ left: `${(CENTER.x / W) * 100}%`, top: `${((CENTER.y + 34) / H) * 100}%`, width: '13%', transform: 'translate(-50%, -100%)' }}>
                <RooMascot pose="wave" size={130} className="h-auto w-full" />
            </div>

            {/* Etiquetas de cada región (el enlace accesible de cada una) */}
            {regions.map((r) => {
                const s = SPOTS[r.id];
                const style = {
                    left: `${(s.x / W) * 100}%`,
                    top: `${(s.labelY / H) * 100}%`,
                    transform: s.align === 'right' ? 'translate(-80%, -50%)' : 'translate(-50%, -50%)',
                };
                const body = (
                    <>
                        <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border-2 bg-white sm:h-9 sm:w-9" style={{ borderColor: r.color }}>
                            <Image src={r.image} alt="" fill className="object-cover" sizes="36px" />
                        </span>
                        <span className="flex min-w-0 flex-col leading-tight">
                            <span className="whitespace-nowrap text-[11px] font-black text-slate-900 sm:hidden">{r.shortName}</span>
                            <span className="hidden whitespace-nowrap text-sm font-black text-slate-900 sm:block">{r.region}</span>
                            <Stars earned={r.earned} possible={r.possible} />
                        </span>
                    </>
                );
                const className = 'absolute flex items-center gap-1.5 rounded-full bg-white/95 py-1 pl-1 pr-2.5 shadow-md ring-2 transition hover:scale-105 sm:gap-2 sm:pr-3.5';
                return r.href ? (
                    <Link key={r.id} href={r.href} className={className} style={{ ...style, ['--tw-ring-color' as string]: r.color }}>
                        {body}
                    </Link>
                ) : (
                    <button key={r.id} type="button" onClick={onNeedCourse} className={className} style={{ ...style, ['--tw-ring-color' as string]: r.color }}>
                        {body}
                    </button>
                );
            })}
        </div>
    );
}
