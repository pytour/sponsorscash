const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    publicRuntimeConfig: {
        // Will be available on both server and client
       // https://sponsor-cash.herokuapp.com/
        APP_URL: process.env.APP_URL,
        FEE_AMOUNT: process.env.FEE_AMOUNT,
        MINIMUM_AMOUNT:0.0002
    },
    images: {
        domains: ['localhost','fundme.cash', '54.244.63.208'],
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.plugins.push(
            new UglifyJsPlugin({
                uglifyOptions: {
                  mangle: {
                    reserved: [
                      'Buffer',
                      'BigInteger',
                      'Point',
                      'ECPubKey',
                      'ECKey',
                      'sha512_asm',
                      'asm',
                      'ECPair',
                      'HDNode'
                  ]
                  }
                }
              })
          
        )
        return config
    },
};
