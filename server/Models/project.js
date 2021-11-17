const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String },
    description: { type: String },
    category: { type: String },
    images: { type: Array },
    startTime: { type: Date },
    endTime: { type: Date },
    funded: { type: Number, default: 0 },
    goal: { type: Number },
    sponsors: { type: Array },
    details: { type: String },
    hasEnded: { type: Boolean, default: false },
    isTransactionCleared: { type: Boolean, default: false },
    projectWalletID: { type: mongoose.Schema.Types.ObjectId }, // Legacy need to keep for backward compatibility
    status: { type: String },
    receivingAddresses: [{ type: String }]
    // addressList: [{ type: String }], need to think,which one
    // transactions: [],  //need to know its need
});

projectSchema.plugin(updateIfCurrentPlugin);

module.exports = mongoose.model('Projects', projectSchema);
