const mongoose = require('mongoose');

const bidsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    campaignId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaigns' }],
    adsManagerId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AdsManager' }],
    bid: { type: Number, required: true },
    budget: { type: Number, required: true },
    startedAt: { type: Date, required: true, default: Date.now },
    status: { type: String, default: 'active' }
});

module.exports = mongoose.model('Bids', bidsSchema);
