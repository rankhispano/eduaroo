'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Mascot() {
    const [isBlinking, setIsBlinking] = useState(false);

    // Random blink effect
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 150);
        }, 3000 + Math.random() * 2000);

        return () => clearInterval(blinkInterval);
    }, []);

    return (
        <motion.div
            className="relative"
            animate={{ y: [0, -30, 0], scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
            transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'circOut'
            }}
        >
            <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
                {/* Kangaroo body */}
                <ellipse cx="60" cy="95" rx="35" ry="40" fill="#8B5A2B" />

                {/* Belly */}
                <ellipse cx="60" cy="100" rx="22" ry="28" fill="#D4A574" />

                {/* Head */}
                <ellipse cx="60" cy="45" rx="28" ry="25" fill="#8B5A2B" />

                {/* Ears */}
                <ellipse cx="38" cy="20" rx="10" ry="18" fill="#8B5A2B" />
                <ellipse cx="38" cy="22" rx="5" ry="12" fill="#D4A574" />
                <ellipse cx="82" cy="20" rx="10" ry="18" fill="#8B5A2B" />
                <ellipse cx="82" cy="22" rx="5" ry="12" fill="#D4A574" />

                {/* Snout */}
                <ellipse cx="60" cy="55" rx="15" ry="12" fill="#D4A574" />

                {/* Nose */}
                <ellipse cx="60" cy="50" rx="5" ry="4" fill="#4A3728" />

                {/* Eyes - with blink */}
                <motion.g>
                    {isBlinking ? (
                        <>
                            <line x1="48" y1="40" x2="56" y2="40" stroke="#4A3728" strokeWidth="3" strokeLinecap="round" />
                            <line x1="64" y1="40" x2="72" y2="40" stroke="#4A3728" strokeWidth="3" strokeLinecap="round" />
                        </>
                    ) : (
                        <>
                            <circle cx="50" cy="40" r="8" fill="white" />
                            <circle cx="70" cy="40" r="8" fill="white" />
                            <circle cx="52" cy="40" r="5" fill="#4A3728" />
                            <circle cx="72" cy="40" r="5" fill="#4A3728" />
                            <circle cx="54" cy="38" r="2" fill="white" />
                            <circle cx="74" cy="38" r="2" fill="white" />
                        </>
                    )}
                </motion.g>

                {/* Arms */}
                <ellipse cx="30" cy="90" rx="8" ry="20" fill="#8B5A2B" transform="rotate(-20 30 90)" />
                <ellipse cx="90" cy="90" rx="8" ry="20" fill="#8B5A2B" transform="rotate(20 90 90)" />

                {/* Feet */}
                <ellipse cx="45" cy="130" rx="15" ry="8" fill="#8B5A2B" />
                <ellipse cx="75" cy="130" rx="15" ry="8" fill="#8B5A2B" />

                {/* Tail */}
                <path d="M95 100 Q 115 110 110 130 Q 105 140 100 135" fill="#8B5A2B" stroke="#8B5A2B" strokeWidth="8" strokeLinecap="round" />
            </svg>
        </motion.div>
    );
}
