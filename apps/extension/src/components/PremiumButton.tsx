import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils/cn'; // I'll create this utility

interface PremiumButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'neon' | 'glass' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    children: React.ReactNode;
    className?: string;
    glow?: boolean;
}

export const PremiumButton = ({
    variant = 'neon',
    size = 'md',
    children,
    className,
    glow = false,
    ...props
}: PremiumButtonProps) => {
    const variants = {
        neon: 'bg-neon text-black font-bold hover:shadow-neon-strong border-transparent',
        glass: 'glass-panel hover:bg-white/10 text-white border-white/10',
        outline: 'bg-transparent border border-neon/50 text-neon hover:bg-neon/10 hover:border-neon',
        ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        icon: 'p-2',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'relative flex items-center justify-center rounded-lg transition-all duration-300 font-sans',
                variants[variant],
                sizes[size],
                glow && variant === 'neon' ? 'shadow-neon' : '',
                className
            )}
            {...props}
        >
            {/* Subtle inner glow for glass variant */}
            {variant === 'glass' && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg pointer-events-none" />
            )}
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};
