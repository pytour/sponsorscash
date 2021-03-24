// id , projectId , address
const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require("mongoose-update-if-current");

const receivingAddressSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    projectId: {type:String},
    address:{type:String}
});

receivingAddressSchema.plugin(updateIfCurrentPlugin);

module.exports = mongoose.model('ReceivingAddress',receivingAddressSchema);
