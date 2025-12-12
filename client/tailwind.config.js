/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Montserrat', 'sans-serif'],
                display: ['Montserrat', 'sans-serif'], // Kahoot uses very bold sans
                mono: ['monospace'],
            },
            colors: {
                primary: {
                    light: '#60a5fa', // blue-400
                    DEFAULT: '#2563eb', // royal-600 (Main Brand Color)
                    dark: '#1e40af', // royal-800
                },
                secondary: {
                    light: '#fbbf24', // amber-400
                    DEFAULT: '#f59e0b', // amber-500
                    dark: '#d97706', // amber-600
                },
                background: {
                    DEFAULT: '#46178f', // Kahoot purple background? Or Blue?
                    // User asked for Blue. Let's make the main page background Blue.
                },
                paper: '#ffffff',
            },
            boxShadow: {
                'card': '0 4px 0 0 rgba(0,0,0,0.2)', // Hard shadow like Kahoot
                'button': '0 4px 0 0 rgba(0,0,0,0.2)',
                'button-active': '0 0 0 0 rgba(0,0,0,0)',
            },
            animation: {
                'bounce-slow': 'bounce 3s infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
