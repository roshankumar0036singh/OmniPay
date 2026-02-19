/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{tsx,html}"],
    theme: {
        extend: {
            colors: {
                neon: {
                    DEFAULT: "#CCFF00",
                    hover: "#B3E600",
                    dim: "rgba(204, 255, 0, 0.1)"
                },
                dark: {
                    bg: "#050505",
                    card: "#121212",
                    border: "#333333"
                }
            }
        },
    },
    plugins: [],
}
