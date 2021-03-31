module.exports = {
    publicRuntimeConfig: {
        // Will be available on both server and client
        // https://sponsor-cash.herokuapp.com/
        APP_URL: process.env.APP_URL,
        FEE_AMOUNT: process.env.FEE_AMOUNT,
        MINIMUM_AMOUNT: 0.0002
    },
    images: {
        domains: ['localhost', 'fundme.cash', '54.244.63.208']
    },
    webpack: function(config) {
        config.optimization.minimize = false;
        return config;
    }
};