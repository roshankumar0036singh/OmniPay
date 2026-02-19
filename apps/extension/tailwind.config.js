/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{tsx,html}"],
    theme: {
        extend: {
            colors: {
                neon: {
                    DEFAULT: "#00FF00", // Classic Terminal Green (Brighter)
                    hover: "#33FF33",
                    dim: "rgba(0, 255, 0, 0.1)",
                    dark: "#003300" // Darker Green for backgrounds
                },
                dark: {
                    bg: "#050505",
                    card: "#121212",
                    border: "#333333"
                },
                'lingo-green': '#4ade80', // Vibrant green
                'lingo-dark': '#0a0a0a',  // Deep void black
                'lingo-card': '#111111',  // Slightly lighter card bg
                'lingo-border': '#222222', // Subtle border
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Clean modern font
            },
            boxShadow: {
                'neon': '0 0 5px #00FF00, 0 0 10px #00FF00', // Glow effect
                'crt': 'inset 0 0 20px rgba(0, 255, 0, 0.1)', // CRT Screen effect
                'lingo-glow': '0 0 20px rgba(74, 222, 128, 0.4)', // Green glow
                'lingo-card': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
            },
            animation: {
                'data-flow': 'dash 20s linear infinite',
            },
            keyframes: {
                dash: {
                    '0%': { strokeDashoffset: '1000' },
                    '100%': { strokeDashoffset: '0' },
                }
            }
        },
    },
    plugins: [],
}
