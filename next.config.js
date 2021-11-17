module.exports = {
    publicRuntimeConfig: {
        // Will be available on both server and client
        API_URL: process.env.API_URL,
        ADS_SERVER_URL: process.env.ADS_SERVER_URL
            ? process.env.ADS_SERVER_URL
            : 'http://localhost:3001'
    },
    images: {
        domains: [
            'localhost',
            'devbitcoin.cash',
            'sponsors.cash',
        ]
    },
    webpack: function(config) {
        config.optimization.minimize = false;
        return config;
    }
};
