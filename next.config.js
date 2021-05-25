module.exports = {
    publicRuntimeConfig: {
        // Will be available on both server and client
        // https://sponsor-cash.herokuapp.com/
        APP_URL: process.env.APP_URL,
        ADS_SERVER_URL: process.env.ADS_SERVER_URL
            ? process.env.ADS_SERVER_URL
            : 'http://localhost:3001'
    },
    images: {
        domains: ['localhost', 'fundme.cash', 'gofundme.cash', '54.244.63.208', '34.212.40.180']
    },
    webpack: function(config) {
        config.optimization.minimize = false;
        return config;
    }
};