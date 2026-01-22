'use client';

import Mascot from './Mascot';

export default function SchoolIllustration() {
    return (
        <div className="relative w-full max-w-lg">
            {/* School Building */}
            <svg viewBox="0 0 400 360" className="w-full h-auto drop-shadow-2xl">
                {/* Foundation/Base - Solid block */}
                <rect x="20" y="300" width="360" height="40" rx="4" fill="#5D4037" />

                {/* Main building */}
                <rect x="60" y="120" width="280" height="180" fill="#E8B84A" stroke="#C9A03D" strokeWidth="2" />

                {/* Roof */}
                <polygon points="40,120 200,40 360,120" fill="#C73E1D" stroke="#A33218" strokeWidth="2" />

                {/* Roof detail - shingles */}
                <line x1="60" y1="120" x2="200" y2="50" stroke="#A33218" strokeWidth="1" />
                <line x1="340" y1="120" x2="200" y2="50" stroke="#A33218" strokeWidth="1" />

                {/* Flag pole */}
                <rect x="195" y="20" width="4" height="30" fill="#666" />
                <polygon points="199,20 220,28 199,36" fill="#F97316" />

                {/* Windows - Left */}
                <rect x="85" y="145" width="45" height="50" fill="#87CEEB" stroke="#4A3728" strokeWidth="2" />
                <line x1="107.5" y1="145" x2="107.5" y2="195" stroke="#4A3728" strokeWidth="2" />
                <line x1="85" y1="170" x2="130" y2="170" stroke="#4A3728" strokeWidth="2" />

                <rect x="85" y="215" width="45" height="50" fill="#87CEEB" stroke="#4A3728" strokeWidth="2" />
                <line x1="107.5" y1="215" x2="107.5" y2="265" stroke="#4A3728" strokeWidth="2" />
                <line x1="85" y1="240" x2="130" y2="240" stroke="#4A3728" strokeWidth="2" />

                {/* Windows - Right */}
                <rect x="270" y="145" width="45" height="50" fill="#87CEEB" stroke="#4A3728" strokeWidth="2" />
                <line x1="292.5" y1="145" x2="292.5" y2="195" stroke="#4A3728" strokeWidth="2" />
                <line x1="270" y1="170" x2="315" y2="170" stroke="#4A3728" strokeWidth="2" />

                <rect x="270" y="215" width="45" height="50" fill="#87CEEB" stroke="#4A3728" strokeWidth="2" />
                <line x1="292.5" y1="215" x2="292.5" y2="265" stroke="#4A3728" strokeWidth="2" />
                <line x1="270" y1="240" x2="315" y2="240" stroke="#4A3728" strokeWidth="2" />

                {/* Path to door - Drawn BEFORE door to be behind it, but OVER foundation */}
                <path d="M170,300 L230,300 L230,340 L170,340 Z" fill="#D4A574" />

                {/* Door */}
                <rect x="170" y="200" width="60" height="100" fill="#6B4423" stroke="#4A3728" strokeWidth="2" />
                <circle cx="220" cy="255" r="4" fill="#FFD700" />

                {/* Door arch */}
                <path d="M170,200 Q200,170 230,200" fill="#6B4423" stroke="#4A3728" strokeWidth="2" />

                {/* School sign */}
                <rect x="155" y="140" width="90" height="30" rx="4" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
                <text x="200" y="162" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif">SCHOOL</text>
            </svg>

            {/* Mascot on the ground - Jumping next to door */}
            <div className="absolute bottom-6 left-[25%] scale-110 z-10">
                <Mascot />
            </div>
        </div>
    );
}
