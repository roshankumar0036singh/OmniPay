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
                retro: {
                    bg: "#000000", // Pure Black
                    card: "#0a0a0a", // Almost Black
                    border: "#00FF00" // Neon Green Borders
                }
            },
            fontFamily: {
                mono: ['"Courier New"', 'Courier', 'monospace'] // Terminal Font
            },
            boxShadow: {
                'neon': '0 0 5px #00FF00, 0 0 10px #00FF00', // Glow effect
                'crt': 'inset 0 0 20px rgba(0, 255, 0, 0.1)' // CRT Screen effect
            }
        },
    },
    plugins: [],
}
