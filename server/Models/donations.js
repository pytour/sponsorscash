const mongoose = require("mongoose");

const donationsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  projectTitle: { type: String },
  projectImage: { type: String },
  txId: { type: String },
  date: { type: Date },
  donatedBCH: { type: Number, default: 0 },
  projectId: { type: mongoose.Schema.Types.ObjectId },
  userId: { type: mongoose.Schema.Types.ObjectId },
  userImage: { type: String },
  name: { type: String },
  username: { type: String },
});

module.exports = mongoose.model("Donations", donationsSchema);
