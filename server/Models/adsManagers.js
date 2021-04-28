const mongoose = require('mongoose');

const adsManagerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    username: { type: String, required: true },
    name: { type: String, required: false },
    walletId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' }],
    balance: { type: Number, required: false },
    deposits: { type: Array, required: false },
    bids: { type: Array, required: false },
    createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('AdsManagers', adsManagerSchema);
