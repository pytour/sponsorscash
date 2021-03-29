const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const rentedAddressSchema = mongoose.Schema({
    // _id : mongoose.Schema.Types.ObjectId,
    projectId: { type: String },
    address: { type: String },
    amount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    data: { type: mongoose.Schema.Types.Mixed },
    expireAt: { type: Date, expires: 300, default: Date.now }
});

rentedAddressSchema.index({ expireAt: 1 }, { expireAfterSeconds: 305 });
// rentedAddressSchema.ensureIndex();

rentedAddressSchema.plugin(updateIfCurrentPlugin);

module.exports = mongoose.model('RentedAddress', rentedAddressSchema);
