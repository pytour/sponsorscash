// id , projectId , address
const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const receivingAddressSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    projectId: { type: String },
    adManagerId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AdManagers' }],
    walletId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' }],
    address: [{ type: String, ref: 'Wallet' }]
});

receivingAddressSchema.plugin(updateIfCurrentPlugin);

module.exports = mongoose.model('ReceivingAddress', receivingAddressSchema);
