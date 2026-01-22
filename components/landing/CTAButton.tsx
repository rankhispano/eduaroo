'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CTAButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    className?: string;
}

export default function CTAButton({
    children,
    onClick,
    variant = 'primary',
    className = ''
}: CTAButtonProps) {
    const baseStyles = "px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 cursor-pointer";

    const variants = {
        primary: "bg-[#F5C731] text-gray-900 hover:bg-[#E5B721] shadow-lg shadow-yellow-400/30",
        secondary: "bg-white text-brand-blue border-2 border-brand-blue hover:bg-brand-blue/5"
    };

    return (
        <motion.button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 30px -10px rgba(245, 199, 49, 0.5)"
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
        >
            {children}
        </motion.button>
    );
}
