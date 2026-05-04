/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class", // важливо для перемикача теми
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            borderRadius: {
                "2xl": "1rem",
                "3xl": "1.5rem"
            },
            boxShadow: {
                soft: "0 18px 40px rgba(15, 23, 42, 0.08)"
            }
        }
    },
    plugins: []
};

