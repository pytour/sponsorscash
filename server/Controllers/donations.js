const mongoose = require("mongoose");
const DonationModel = require("../Models/donations");
const Project = require("../Models/project");
require("dotenv").config();

exports.createDonation = (req, res, next) => {
  let data = req.body;
  console.log("createDonation:", data);
  let projectTitle = data.title;
  let projectImage = data.image;
  let txId = data.txId;
  let projectId = data.projectId;
  let userId = data.userId;
  let name = data.name;
  let username = data.username;
  let userImage = data.userImage;
  let address = data.address; // FROM address
  let donatedBCH = data.donatedBCH;
  let donationID = new mongoose.Types.ObjectId();

  const donation = new DonationModel({
    _id: donationID,
    projectTitle: projectTitle,
    projectImage: projectImage,
    txId: txId,
    date: new Date().toJSON(),
    donatedBCH: donatedBCH,
    projectId: projectId,
    userId: userId,
    userImage: userImage,
    name: name,
    username: username,
  });

  donation.save(function (err) {
    if (err) {
      console.log("Error at createDonation:", err);
      return res.status(500).send({ msg: err.message });
    }
  });

  // Update Last Donors Tab data
  // e.g. sponsors array
  Project.updateOne(
    { _id: projectId },
    {
      $push: {
        sponsors: {
          donationId: donationID,
          user: {
            id: userId,
            username: username,
            image: userImage,
            name: name,
          },
          donatedBCH: donatedBCH,
          address: address,
          txId: txId,
        },
      },
    }
  )
    .exec()
    .then((res1) => {
      return res.status(200).send("OK");
    })
    .catch((err) => {
      console.log(err);
      return res.status(200).send("Cant update project donations");
    });
};

exports.getProjectDonations = (req, res, next) => {
  DonationModel.find({ projectId: req.body.projectId }).exec(function (
    err,
    donations
  ) {
    if (err) {
      return res.status(500).send({ msg: err.message });
    }
    res.send({
      status: 200,
      donations: donations,
    });
  });
};

exports.getUserDonations = (req, res, next) => {
  DonationModel.find({ userId: req.body.userId }).exec(function (
    err,
    donations
  ) {
    if (err) {
      return res.status(500).send({ msg: err.message });
    }
    res.send({
      status: 200,
      donations: donations,
    });
  });
};
