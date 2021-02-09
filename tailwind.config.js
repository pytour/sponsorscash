
module.exports = {
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'branding-color':'#7d73c3',
                'branding-text-color': '#FFCA79',
                'branding-text-color-hover':'#ffc979b4',
                'login-bg':'#9CB4F7',
                'shadow-card':'#A3D5E9',
                'progress-filled':'#F7F7F7',
                'progress-bar':'#1AA2B8',
                'container':'#F0F2F5',
                'outline-color': '#7d73c3',


            },
            textColor: {
                'orange': '#FFA500',
                'percentage':'#9F9E9E',
                'funded':'#707070',
                'goal':'#9F9E9E',
                'title':'#FFCA79',
                'outline-color': '#7d73c3',

            },
            borderWidth: {
                '1': '1.1px',

            },
            backgroundImage: theme => ({
                'hero-md': "url('/images/cover.jpg')",
                'footer-sm': "url('/slide/girl.png')",
            }),
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
            },
            transitionDuration: {
                '2sec': '2000ms',
            },
            zIndex: {
                'minus': '-1',
            },
            height: {
                'ex-large': '31rem',
                'card':'220px',
            },
            width:{
                '1/7': '14.2857143%',
                '2/7': '33%',
                '3/7': '42.8571429%',
                '4/7': '57.1428571%',
                '5/7': '71.4285714%',
                '6/7': '85.7142857%',
                '90':'90%',
            },

            margin: {
                'right50': '24rem',
            },
            borderRadius: {
                'custom': '40px',
                'half':'50%',
            },
            inset: {
                '1/20': '5%',
            }

        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
