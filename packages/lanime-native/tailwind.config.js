/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#b473f9',
                    light: '#d2a9ff',
                },
                bg: {
                    page: '#1A1A1A',
                    page2: '#222222',
                    el1: '#1E1E1E',
                    el2: '#252525',
                    el3: '#2E2E2E',
                },
                fg: {
                    1: '#FAFAF8',
                    2: '#ECEAE4',
                    3: '#ACACAC',
                    4: '#848484',
                },
                border: {
                    1: '#2C2C2C',
                    2: '#4D4D4D',
                },
                success: '#3399FF',
                destructive: '#FF6B6B',
            },
        },
    },
    plugins: [],
}
