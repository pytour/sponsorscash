const mongoose = require("mongoose");
const DonationModel = require("../Models/donations");
const Project = require("../Models/project");
require("dotenv").config();
const { add, forEach } = require("lodash");
const rentedAddress = require("../Models/rentedAddress");
const RentedAddressModel = require("../Models/rentedAddress");


exports.createDonation = (req, res, next) => {
  let data = req.body;

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
//new info



exports.getDonationAddress = async (req, res, next) => {
    const { projectId, amount,name,comment } = req.query;
    lendAddress(projectId, amount,name,comment).then(address => {
        res.send({
            status: 200,
            data: {
                query: req.query,
                body: req.body,
                address,
            }
        });
    }).catch(err => {
        console.log(err)
        res.send({
            status: 404,
            data: err
        });
    });
}

async function lendAddress(projectId, amount,name,comment) {
    // const session = await RentedAddressModel.startSession();
    const session = null; // enable session if using replicaSet otherwise unsupported

    // return session.withTransaction(async function () {
    // get project by id
    let project = await Project.findById(projectId)
    // .setOptions({ session });

    let addresses = project.receivingAddresses || [];

    let alreadyRented = await RentedAddressModel
        .find({ projectId: projectId })
        .select({ address: 1 })
    // .setOptions({ session });

    alreadyRented = alreadyRented.map(rented => rented.address);

    let unassignedAddresses = addresses.filter((address) => { return !alreadyRented.includes(address); });

    let picked = unassignedAddresses.length && unassignedAddresses[0];

    if (picked) {
        let rentedAddress = new RentedAddressModel({
            projectId: projectId,
            data: {
                projectId:projectId,
                amount:amount,
                name:name,
                comment:comment
            },
            address: picked,
            amount: amount,
        });
        console.log("rented address",rentedAddress)
        return rentedAddress
        // .setOptions({ session })
            .save();
    } else {
        return Promise.reject('All addresses are rented at the moment');
    }
    // })
}

exports.saveTransaction = (req, res) => {
    const { txId, address, amount } = req.body;

    receiveDonation(txId, address, amount, req.body).then((ret) => {
        res.send({
            status: 200,
            data: ret
        })
    })
}

async function receiveDonation(txId, address, amount, info) {
    let rentedAddresses = await RentedAddressModel.find({ address: address });
    if (rentedAddresses && rentedAddresses.length) {
        let matched = rentedAddresses.find(rentedAddress => {
            return (Math.abs(rentedAddress.amount - amount) < rentedAddress.amount * 0.05); // check amount -/+ 5%
        });
        if (matched) {
            await DonationModel.create({
                ...info,
                txId: txId,
                donatedBCH: amount,
                projectId: matched.projectId,
                _id: new mongoose.Types.ObjectId(),
            })
            await matched.delete();
            return 'deleting';
        }
    }
    // save annonymouse transaction

    return Promise.resolve(false);
}
