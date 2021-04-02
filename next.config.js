const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')


module.exports = withPWA({
    future: { webpack5: true },
    pwa: {
        dest: 'public',
        runtimeCaching,
    },
    // pwa: {
    //     disable:false,
    //     register: true,
    //     scope: '/app',
    //     sw: 'service-worker.js',
    // },
    publicRuntimeConfig: {
        // Will be available on both server and client
        // https://sponsor-cash.herokuapp.com/
        APP_URL: process.env.APP_URL,
        FEE_AMOUNT: process.env.FEE_AMOUNT,
        MINIMUM_AMOUNT: 0.0002
    },
    images: {
        domains: ['localhost', 'fundme.cash', '54.244.63.208', '34.212.40.180']
    },
    webpack: function(config) {
        config.optimization.minimize = false;
        return config;
    }
})
