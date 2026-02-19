import { motion } from "framer-motion";

export const LingoChip = ({ className }: { className?: string }) => {
    return (
        <div className={`relative w-12 h-12 ${className}`}>
            {/* Glow behind */}
            <div className="absolute inset-0 bg-lingo-green/20 blur-xl rounded-full animate-pulse" />

            {/* Main Chip Body */}
            <div className="relative w-full h-full bg-[#1A1A1A] rounded-xl border border-white/10 flex items-center justify-center shadow-lg overflow-hidden group">
                {/* Carbon fiber texture effect */}
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)', backgroundSize: '4px 4px' }}
                />

                {/* Lingo Logo (Abstract) */}
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-lingo-green relative z-10" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
                </svg>
            </div>
        </div>
    );
};
