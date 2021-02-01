const mongoose = require("mongoose");

const commentsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  projectId: { type: mongoose.Schema.Types.ObjectId },
  userId: { type: mongoose.Schema.Types.ObjectId },
  avatar: { type: String },
  name: { type: String },
  username: { type: String },
  text: { type: String },
  date: { type: Date },
});

module.exports = mongoose.model("Comments", commentsSchema);
