module.exports = {
    publicRuntimeConfig: {
        // Will be available on both server and client
        // https://sponsor-cash.herokuapp.com/
        API_URL: process.env.API_URL,
        ADS_SERVER_URL: process.env.ADS_SERVER_URL
            ? process.env.ADS_SERVER_URL
            : 'http://localhost:3001'
    },
    images: {
        domains: [
            'localhost',
            'fundme.cash',
            'devbitcoin.cash',
            '54.244.63.208',
            '34.212.40.180',
            '142.93.2.130'
        ]
    },
    webpack: function(config) {
        config.optimization.minimize = false;
        return config;
    }
};
