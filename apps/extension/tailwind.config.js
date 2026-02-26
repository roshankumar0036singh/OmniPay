/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{tsx,html}"],
    theme: {
        extend: {
            colors: {
                neon: {
                    DEFAULT: "#00FF00",
                    hover: "#33FF33",
                    dim: "rgba(0, 255, 0, 0.1)",
                    dark: "#001A00"
                },
                dark: {
                    bg: "#050505",
                    card: "#0F0F0F",
                    border: "#1A1A1A",
                    glass: "rgba(10, 10, 10, 0.7)"
                },
                'lingo-green': '#4ade80',
                'lingo-dark': '#070707',
                'lingo-card': '#0F0F0F',
                'lingo-border': '#1F1F1F',
            },
            fontFamily: {
                sans: ['Inter', 'Space Grotesk', 'sans-serif'],
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
                'neon-gradient': 'linear-gradient(90deg, #00FF00 0%, #33FF33 100%)',
            },
            boxShadow: {
                'neon': '0 0 15px rgba(0, 255, 0, 0.3)',
                'neon-strong': '0 0 25px rgba(0, 255, 0, 0.5)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
                'lingo-glow': '0 0 25px rgba(74, 222, 128, 0.2)',
            },
            backdropBlur: {
                'xs': '2px',
            },
            animation: {
                'data-flow': 'dash 20s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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

