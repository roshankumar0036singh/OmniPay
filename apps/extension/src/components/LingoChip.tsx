import { motion } from "framer-motion";

export const LingoChip = ({ className }: { className?: string }) => {
    return (
        <label className={`relative flex items-center justify-center cursor-pointer group ${className}`}>
            {/* Animated Glow behind */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-neon blur-2xl rounded-full"
            />

            {/* Main Chip Body */}
            <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-12 h-12 glass-panel rounded-2xl flex items-center justify-center shadow-glass overflow-hidden border-white/20"
            >
                {/* Circuit Texture */}
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
                        backgroundSize: '8px 8px'
                    }}
                />

                {/* Lingo Logo (Abstract) */}
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-neon drop-shadow-[0_0_8px_rgba(0,255,0,0.5)] z-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                </svg>

                {/* Inner Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-neon/10 to-transparent pointer-events-none" />
            </motion.div>
        </label>
    );
};

