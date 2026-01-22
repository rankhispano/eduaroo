'use client';

import { motion } from 'framer-motion';

export default function AnimatedCloud({
    size = 'medium',
    speed = 30,
    delay = 0,
    top = '10%'
}: {
    size?: 'small' | 'medium' | 'large';
    speed?: number;
    delay?: number;
    top?: string;
}) {
    const sizes = {
        small: { width: 140, height: 70 },
        medium: { width: 220, height: 110 },
        large: { width: 340, height: 170 }
    };

    const { width, height } = sizes[size];

    return (
        <motion.div
            className="absolute z-0"
            style={{ top }}
            initial={{ x: -width - 200 }}
            animate={{ x: '120vw' }}
            transition={{
                duration: speed,
                delay,
                repeat: Infinity,
                ease: 'linear'
            }}
        >
            <svg width={width} height={height} viewBox="0 0 180 90" fill="none">
                {/* Cloud shape */}
                <ellipse cx="50" cy="60" rx="40" ry="25" fill="white" />
                <ellipse cx="90" cy="50" rx="50" ry="35" fill="white" />
                <ellipse cx="130" cy="60" rx="40" ry="25" fill="white" />
                <ellipse cx="70" cy="45" rx="35" ry="25" fill="white" />
                <ellipse cx="110" cy="45" rx="35" ry="25" fill="white" />
            </svg>
        </motion.div>
    );
}
