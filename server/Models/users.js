const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    projects: [{ type:  mongoose.Schema.Types.ObjectId, ref: 'Projects' }],
    username:{type:String,required: true},
    name: {type:String},
    image:{type:String,default:"user-avatar.png"},
    password: {type: String},
    isVerified:{type:Boolean,default:false},
    startedAt: { type: Date, required: true, default: Date.now},
    accountType: {type:String},
    bio:{type:String},
    websiteURL: {type:String},
    socialLinks:{
        facebook: {type:String},
        telegram: {type:String},
        twitter: {type:String},
        email: {type:String}
    },
    cashID:{type:String},
    walletID:{type:mongoose.Schema.Types.ObjectId},
    email:{type:String,  match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
});

module.exports = mongoose.model('Users',usersSchema);
