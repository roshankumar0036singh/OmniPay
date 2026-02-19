export const CircuitBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <svg className="absolute w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-lingo-green" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Circuit lines with data flow animation */}
            <g className="text-lingo-green stroke-current stroke-1 fill-none">
                <path d="M 0 100 Q 50 100 100 150 T 200 150" className="animate-data-flow" strokeDasharray="10 10" />
                <path d="M 300 0 Q 300 100 200 150 T 100 250" className="animate-data-flow" strokeDasharray="10 10" style={{ animationDuration: '15s' }} />
                <path d="M 20 400 Q 100 300 200 300 T 400 200" className="animate-data-flow" strokeDasharray="10 10" style={{ animationDuration: '25s' }} />
            </g>
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-lingo-dark/50 via-transparent to-lingo-dark/90"></div>
    </div>
);
