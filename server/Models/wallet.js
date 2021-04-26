const mongoose = require('mongoose');

const walletSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    mnemonic: { type: String },
    cashAddress: { type: String },
    legacyAddress: { type: String },
    privateKey: { type: String },
    createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Wallet', walletSchema);
