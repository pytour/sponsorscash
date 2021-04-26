const mongoose = require('mongoose');

const transactionsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    walletId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' }],
    satoshiSent: { type: Number, required: false },
    createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Transactions', transactionsSchema);
