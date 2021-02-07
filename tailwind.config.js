module.exports = {
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'branding-color':'#7d73c3',
                'branding-text-color': '#FFCA79',
                'branding-text-color-hover':'#ffc979b4'

            },
            borderWidth: {
                '1': '1.1px',

            },
            backgroundImage: {
                // 'hero-lg': "url('/cover.png')",
                // 'hero-sm': "url('/cover.png')",
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
            },
            transitionDuration: {
                '2sec': '2000ms',
            }

        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
