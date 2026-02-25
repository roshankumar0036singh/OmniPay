import { motion } from 'framer-motion';

export const CircuitBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-lingo-dark">
        {/* Animated Glows */}
        <motion.div
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
                x: [0, 50, 0],
                y: [0, 30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -top-20 -left-20 w-80 h-80 bg-neon/10 blur-[120px] rounded-full"
        />
        <motion.div
            animate={{
                scale: [1, 1.3, 1],
                opacity: [0.05, 0.15, 0.05],
                x: [0, -40, 0],
                y: [0, -60, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-neon/5 blur-[150px] rounded-full"
        />

        <svg className="absolute w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid-3d" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45) scale(0.5)">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-neon/30" />
                </pattern>

                <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(74, 222, 128, 0)" />
                    <stop offset="50%" stopColor="rgba(74, 222, 128, 0.5)" />
                    <stop offset="100%" stopColor="rgba(74, 222, 128, 0)" />
                </linearGradient>
            </defs>

            {/* Grid with perspective feel */}
            <rect width="100%" height="100%" fill="url(#grid-3d)" />

            {/* Neural Pathways */}
            <g className="filter blur-[1px]">
                <motion.path
                    d="M -50 100 Q 150 50 400 300"
                    fill="none"
                    stroke="url(#line-grad)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
                <motion.path
                    d="M 400 100 Q 200 400 -50 200"
                    fill="none"
                    stroke="url(#line-grad)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 1 }}
                />
            </g>
        </svg>

        {/* Depth Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-lingo-dark via-transparent to-lingo-dark/80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(5,5,5,0.4)_100%)]"></div>
    </div>
);
