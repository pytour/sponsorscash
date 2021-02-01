const mongoose = require('mongoose');

const walletSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    mnemonic:{type:String},
    cashAddress:{type:String},
    legacyAddress:{type:String},
    privateKey:{type:String}
});

module.exports = mongoose.model('Wallet',walletSchema);
