const mongoose = require("mongoose");
const Comment = require("../Models/comments");

exports.saveComment = (req, res, next) => {
  let data = req.body;
  console.log("saveComment:", data);

  const comment = new Comment({
    _id: new mongoose.Types.ObjectId(),
    projectId: data.projectId,
    userId: data.userId,
    avatar: data.avatar,
    name: data.name,
    username: data.username,
    text: data.text,
    date: new Date(),
  });

  comment.save(function (err) {
    if (err) {
      console.log("Error at saveComment:", err);
      return res.status(500).send({ msg: err.message });
    }
    return res.status(200).send("OK");
  });
};

exports.deleteComment = (req, res, next) => {
    let id = req.body.id;
    console.log("deleteComment:", id);
  
    const comment = new Comment({
      _id: mongoose.ObjectId(id),
    });
  
    comment.deleteOne(function (err) {
      if (err) {
        console.log("Error at deleteComment:", err);
        return res.status(500).send({ msg: err.message });
      }
      return res.status(200).send("OK");
    });
  };

exports.getProjectComments = (req, res, next) => {
    Comment.find({ projectId: req.body.projectId }).exec(function (
    err,
    comments
  ) {
    if (err) {
      return res.status(500).send({ msg: err.message });
    }
    res.send({
      status: 200,
      comments: comments,
    });
  });
};
