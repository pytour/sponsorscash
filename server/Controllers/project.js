const mongoose = require("mongoose");
const User = require("../Models/users");
const Project = require("../Models/project");
const DonationModel = require("../Models/donations");
const WalletModel = require("../Models/wallet");
const fs = require("fs");
const path = require("path");
const Wallet = require("../Classes/wallet");
const bitboxSDK = require("bitbox-sdk").BITBOX;
const BITBOX = new bitboxSDK();
const BigNumber = require("bignumber.js");

require("dotenv").config();

exports.createProject = (req, res, next) => {
  let data = req.body;
  let userImages = data.images;
  let staticPath = "";
  let _id = new mongoose.Types.ObjectId();
  let walletID = new mongoose.Types.ObjectId();
  let wallet = new Wallet();
  let walletData = wallet.createWallet();
  let dbImages = [];
  if (userImages) {
    for (let [key, value] of Object.entries(userImages)) {
      value = value.replace(/^data:image\/(jpeg|png);base64,/, "");
      staticPath = `projImg_${req.decodedTokenData.userId}_${_id}_${key}.png`;
      let imagePath = path.normalize(
        __dirname + `/../../public/ProjectImages/${staticPath}`
      );
      dbImages.push(staticPath);
      console.log("image path:", imagePath);
      console.log("image value:", value);
      fs.writeFileSync(imagePath, value, "base64");
    }
  }

  const walletDB = new WalletModel({
    _id: walletID,
    mnemonic: walletData.mnemonic,
    cashAddress: walletData.cashAddress,
    legacyAddress: walletData.legacyAddress,
    privateKey: walletData.WIF,
  });

  const project = new Project({
    _id: _id,
    endTime: data.date,
    startTime: new Date().toJSON(),
    title: data.values.title,
    description: data.values.description,
    details: data.values.detail,
    category: data.values.select,
    goal: data.values.goal,
    images: dbImages,
    projectWalletID: walletID,
    status: "ACTIVE",
  });
  walletDB.save(function (err) {
    if (err) console.log(err);
  });
  project.save(function (err) {
    if (err) {
      console.log("project save error");
      console.log(err);
      return res.status(500).send({ msg: err.message });
    }
    User.findOne({ _id: req.decodedTokenData.userId })
      .exec()
      .then((user) => {
        user.projects.push(_id);
        user.save(function (err) {
          if (err) {
            console.log("project save error");
            console.log(err);
            return res.status(500).send({ msg: err.message });
          }
          res.send({
            status: 200,
            message: "Project Created",
            username: user.username,
          });
        });
      });
  });
};

exports.getProjects = (req, res, next) => {
  User.findOne({ _id: req.decodedTokenData.userId })
    .populate("projects")
    .exec(function (err, projects) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      res.send({
        status: 200,
        projects: projects.projects,
      });
    });
};

exports.getAllProjects = (req, res, next) => {
  Project.find({ startTime: { $exists: true } })
    .then((projects) => {
      res.send({
        status: 200,
        projects: projects,
      });
    })
    .catch((err) => {
      return res.status(500).send({ msg: err.message });
    });
};

exports.getPopularProjects = (req, res, next) => {
  Project.find({ hasEnded: false })
    .then((projects) => {
      let allowedProjects = projects.filter((project) => {
        const progress = Math.round((project.funded * 100) / project.goal);
        const allowed = project.approved || progress >= 3;
        const ongoing = project.endTime > new Date().toJSON();
        if (ongoing && project.status === "ACTIVE" && allowed) return project;
      });

      // console.log(projects);
      // console.log(allowedProjects);
      res.send({
        status: 200,
        projects: allowedProjects,
      });
    })
    .catch((err) => {
      return res.status(500).send({ msg: err.message });
    });
};

exports.getCompletedProjects = (req, res, next) => {
  Project.find({ hasEnded: true })
    .then((projects) => {
      res.send({
        status: 200,
        projects: projects,
      });
    })
    .catch((err) => {
      return res.status(500).send({ msg: err.message });
    });
};

exports.getSingleProject = async (req, res, next) => {
  let { id } = req.params;
  let project, user, bchAddress;
  // Get project
  try {
    project = await Project.findOne({ _id: id }).exec();
  } catch (error) {
    console.log(error);
    return res.send({
      status: 404,
      error: error,
    });
  }

  // Get campaign creator info
  if (project) {
    try {
      user = await User.findOne({ projects: id }).exec();
    } catch (error) {
      console.log(error);
      return res.send({
        status: 404,
        error: error,
      });
    }

    // Get project donations

    // Get project receiving  BCH ADDRESS
    try {
      bchAddress = await WalletModel.findOne({
        _id: project.projectWalletID,
      }).exec();

      // Return result
      res.send({
        status: 200,
        project: project,
        creator: user.name || user.username,
        avatar: user.image, // user.cashID,
        cashAddress: bchAddress.cashAddress, // Campaign address
        username: user.username,
      });
    } catch (error) {
      console.log(error);
      return res.send({
        status: 404,
        error: error,
      });
    }
  } else {
    return res.send({
      status: 404,
    });
  }
};

/**
 * Update project data: short and full description ; ending date ; ...
 * 
 * Body: { id , values, images, endTime }
 */
exports.editProject = async (req, res, next) => {
  let data = req.body;
  let userImages = data.images;
  let projectId = data.id;
  let userId = req.decodedTokenData.userId;
  let staticPath = "";
  let dbImages = [];

  if (userImages) {
    for (let [key, value] of Object.entries(userImages)) {
      value = value.replace(/^data:image\/(jpeg|png);base64,/, "");
      staticPath = `projImg_${userId}_${projectId}_${key}.png`;
      let imagePath = path.normalize(
        __dirname + `/../../public/ProjectImages/${staticPath}`
      );
      dbImages.push(staticPath);
      console.log("image path:", imagePath);
      console.log("image value:", value);
      fs.writeFileSync(imagePath, value, "base64");
    }
  }

  try {
    await Project.updateOne(
      { _id: projectId },
      {
        description: data.values.description,
        details: data.values.detail,
        images: dbImages,
        endTime: data.endTime,
      }
    );
    res.send({
      status: 200,
      msg: "Successfully updated, projectId:" + projectId,
    });
  } catch (error) {
    return res.send({
      status: 404,
      msg: error.message,
    });
  }
};

exports.getProjectCashAddress = (req, res, next) => {
  let { id } = req.params;
  // get cash address in wallet
  WalletModel.findOne({ _id: id })
    .exec()
    .then((wallet) => {
      res.send({
        status: 200,
        cashAddress: wallet.cashAddress,
      });
    })
    .catch((err) => console.log(err));
};

exports.getArrayOfProjects = (req, res, next) => {
  const data = req.body;
  const objIds = data.projects.map((el) => mongoose.Types.ObjectId(el));
  Project.find({ _id: { $in: objIds } })
    .exec()
    .then((projects) => {
      if (projects) {
        res.send({
          status: 200,
          projects: projects,
        });
      } else {
        res.send({
          status: 404,
        });
      }
    })
    .catch((err) => console.log(err));
};

exports.payUsingCustomWallet = async (req, res, next) => {
  const data = req.body;
  let wallet = new Wallet();
  let bchCompatibleAmount = data.amount.toFixed(8);
  console.log("payUsingCustomWallet amount: ", data.amount);
  console.log("payUsingCustomWallet data: ", data);
  let transaction = await wallet.sendBch(
    data.receiverAddr,
    data.senderAddr,
    data.senderMnemonic,
    data.amount
  );
  if (transaction === 401) {
    return res.send({
      status: 401,
      message:
        "You do not have sufficient balance in your account. Try funding it first",
    });
  }
  if (transaction === 402) {
    return res.send({
      status: 402,
      message: "Something went wrong",
    });
  }
  if (transaction === 403) {
    return res.send({
      status: 403,
      message: "Something went wrong",
    });
  }
  Project.findOne({ _id: data.projectID })
    .exec()
    .then((project) => {
      project.funded =
        project.funded + BITBOX.BitcoinCash.toBitcoinCash(data.amount);
      project.save(function (err) {
        if (err) return err;
        if (project.funded >= project.goal) {
          return res.send({
            status: 201,
            completed: true,
            message: `<a href="https://explorer.bitcoin.com/tbch/tx/${transaction}">View Transaction Details</a>`,
          });
        }
        res.send({
          status: 200,
          message: `<a href="https://explorer.bitcoin.com/tbch/tx/${transaction}">View Transaction Details</a>`,
        });
      });
    });
};

exports.updateFunds = (req, res, next) => {
  const data = req.body;
  Project.findOne({ _id: data.projectID })
    .exec()
    .then((project) => {
      project.funded = project.funded + data.amount;

      project.save(function (err) {
        if (err) return err;
        if (project.funded >= project.goal) {
          return res.send({
            status: 201,
            completed: true,
            message: "Funds Updated And Goal Reached",
          });
        }
        res.send({
          status: 200,
          message: "Funds updated",
        });
      });
    });
};

exports.isBchAddress = (req, res, next) => {
  const { bchAddress } = req.body;
  console.log(bchAddress);
  // check address
  let isCashAddress, isMainnetAddress;
  try {
    isCashAddress = BITBOX.Address.isCashAddress(bchAddress);
  } catch (error) {}
  try {
    isMainnetAddress = BITBOX.Address.isMainnetAddress(bchAddress);
  } catch (error) {}

  if (isCashAddress && isMainnetAddress) {
    // Ok
    return res.send({
      status: 200,
      message: "Correct address format",
    });
  } else if (!isCashAddress) {
    // Error
    return res.send({
      status: 400,
      message: "wrong address format, must be cash address",
    });
  } else if (!isMainnetAddress) {
    return res.send({
      status: 400,
      message: "wrong address format, must be mainnet address",
    });
  }
};

exports.checkFunds = async (req, res, next) => {
  const data = req.body;
  const projectId = data.projectID;
  let project, projWallet;
  let balance = 0;
  let addressDetails,
    donations = [];
  const WALLET = new Wallet();
  // 1 Get project info
  try {
    project = await Project.findOne({ _id: projectId }).exec();
  } catch (error) {
    return res.send({ status: 400, message: "Error" + error.message });
  }

  // 2 Get project wallet
  try {
    projWallet = await WalletModel.findOne({
      _id: project.projectWalletID,
    }).exec();
  } catch (error) {
    return res.send({ status: 400, message: "Error" + error.message });
  }

  // 3 Get campaign bch_address balance and transactions
  try {
    addressDetails = await WALLET.getAddressDetails(
      projWallet.cashAddress,
      false
    );
  } catch (error) {
    console.log(
      "Error:: Cant update funded amount with getAddressDetails:",
      error
    );
    return res.send({ status: 400, message: "Error" + error.message });
  }

  balance = addressDetails.balance;
  transactions = addressDetails.transactions;
  console.log("Balance: ", balance);

  // 4 Compare network transactions with saved transactions && Update if new tx founded

  console.log("txAppearances: ", transactions.length);

  for (const tx of transactions) {
    console.log("Network Transaction:", tx);
  }

  // TODO: To prevent double check need to use DB locks
  // in case checkFunds requested from two browsers in same time
  // For a while set random timeout

  await new Promise((r) =>
    setTimeout(r, Math.floor(Math.random() * 2000 + 1000))
  );

  // 4.2 Get saved transactions for projectId
  let savedTxs;
  try {
    donations = await DonationModel.find({
      projectId: projectId,
    }).exec();
    savedTxs = donations.map((donation) => donation.txId);
  } catch (error) {
    console.log("Error:: Can't get donations:", error.message);
  }
  // 4.3 Compare saved transactions && Add new one

  let newTransactions = []; // New transactions
  for (const tx of transactions) {
    if (!savedTxs.includes(tx)) {
      newTransactions.push(tx);
    }
  }

  if (newTransactions.length > 0) {
    // Check new transactions
    let newTransactionsDetails;
    const campaignAddress = projWallet.cashAddress;
    try {
      newTransactionsDetails = await WALLET.getTransaction(newTransactions);
      //console.log("newTransactionsDetails:", newTransactionsDetails);
    } catch (error) {
      console.log(error);
    }

    // Split transactions on INPUT and OUTPUT
    // INPUT transaction have bch campaign_address in output side
    for (const newTx of newTransactionsDetails) {
      // console.log("\n\nNEW TX DETAILS:", JSON.stringify(newTx, null, 2));
      console.log("\n\nNEW TX ID:", newTx.txid);
      console.log("NEW TX DATE:", new Date(newTx.time * 1000));
      let input = newTx.vin;
      let output = newTx.vout; // addresses - Array with Legacy addresses
      let confirmations = newTx.confirmations;
      // Need to get Donors transactions (fromAddr, Amount, Date, txId)
      let i = 0;
      for (const el of input) {
        i++;
        console.log("\n* INPUT *", i);
        console.log("Value:", el.value);
        console.log("cashAddress:", el.cashAddress);
      }
      i = 0;
      for (const el of output) {
        i++;
        console.log("\n* OUTPUT *", i);
        console.log("Value:", el.value);
        console.log("cashAddress:", el.scriptPubKey.cashAddrs);
        console.log("scriptPubKey:", el.scriptPubKey);
        if (
          el.scriptPubKey.cashAddrs &&
          +el.value > 0 &&
          el.scriptPubKey.cashAddrs.includes(campaignAddress)
        ) {
          console.log("** This is sponsor transaction! **", el.value);

          // Update funded value with this donation
          console.log("FUNDED : NEW_VALUE", project.funded, +el.value);

          let funded = new BigNumber(project.funded); // "11"
          let amount = new BigNumber(el.value); // "1295.25"
          funded = funded.plus(amount);
          project.funded = funded.toNumber();

          console.log(funded, amount);
          try {
            await project.save();
            // If project saved without version error (race condition)
            // Then save donation
            try {
              const donation = new DonationModel({
                _id: new mongoose.Types.ObjectId(),
                projectTitle: project.title,
                projectImage: project.images[0],
                txId: newTx.txid,
                date: new Date().toJSON(),
                donatedBCH: +el.value,
                projectId: project._id,
              });
              await donation.save();
            } catch (err) {
              console.log("Error while save anonymous transaction :", err);
            }
          } catch (error) {
            console.log("Error at server/checkFunds:", error);
          }
        }
      }
    }
    if (project.funded >= project.goal) {
      return res.send({
        status: 200,
        funded: project.funded,
        completed: true,
        message: "Funds Updated And Goal Reached",
      });
    } else {
      return res.send({
        status: 200,
        message: "Funds updated",
        funded: project.funded,
      });
    }
  } else {
    // There is no new transactions!
    // Check project.FUNDED value again
    try {
      project = await Project.findOne({ _id: projectId }).exec();
    } catch (error) {
      return res.send({ status: 400, message: "Error" + error.message });
    }
    return res.send({
      status: 200,
      message: "Funds the same:" + project.funded,
      funded: project.funded,
    });
  }
};

exports.setCompletion = async (req, res, next) => {
  const data = req.body;
  Project.findOne({ _id: data.projectID })
    .exec()
    .then((project) => {
      project.hasEnded = data.ended;
      project.save(function (err) {
        if (err) return err;
        res.send({
          status: 200,
          ended: true,
        });
      });
    });
};

exports.cancelProject = async (req, res, next) => {
  const { projectId } = req.body;
  const userId = req.decodedTokenData.userId;
  console.log(` [x] Cancell Project ${projectId} for ${userId}`);
  // 1 Check proj owner
  // 2 Get project
  // 3 Update proj status
  // Check if userId is owner of projectId
  let user;
  try {
    user = await User.findOne({ _id: userId }).exec();
    console.log(" [x] Username:", user.username);
    let isOwner = user.projects.includes(projectId);
    if (!isOwner) {
      return res.send({
        status: 400,
        message: "user not owner of this project",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      message: "user not exists",
    });
  }
  // Get project
  let project;
  try {
    project = await Project.findOne({ _id: projectId }).exec();
    console.log(" [x] Project Title:", project.title);
    project.status = "CANCELED";
    await project.save();
    return res.send({
      status: 200,
      message: "Project successfully cancelled",
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      message: "can't cancell this project",
    });
  }
};

exports.withDrawFunds = async (req, res, next) => {
  const projectId = req.body.id;
  const userCashAddress = req.body.bchAddress;
  const userId = req.decodedTokenData.userId;
  const WALLET = new Wallet();
  console.log(" [x] WITHDRAW Funds request:", req.body);
  // Check if userId is owner of projectId
  let user;
  try {
    user = await User.findOne({ _id: userId }).exec();
    console.log(" [x] Username:", user.username);
    let isOwner = user.projects.includes(projectId);
    if (!isOwner) {
      return res.send({
        status: 400,
        message: "user not owner of this project",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      message: "user not exists",
    });
  }
  // Get project
  let project;
  try {
    project = await Project.findOne({ _id: projectId }).exec();
    console.log(" [x] Project Title:", project.title);
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      message: "user not exists",
    });
  }
  if (project.hasEnded) {
    if (!project.isTransactionCleared) {
      let wallet;
      try {
        wallet = await WalletModel.findOne({
          _id: project.projectWalletID,
        }).exec();
        console.log(" [x] Project Wallet Address: ", wallet.cashAddress);
      } catch (error) {
        return res.send({
          status: 400,
          message: "project wallet not exists",
        });
      }
      // 1 TAKE PLATFORMS FEE
      let amount = await WALLET.getBCHBalance(wallet.cashAddress, false);
      let feePercent = process.env.FEE_AMOUNT;
      console.log(" [x] Total BCH amount:", amount);
      let fees = 0;
      if (amount > 0.001 && feePercent > 0) {
        // Then take FEE
        fees = amount * (feePercent / 100);
        console.log(" [x] Platform FEE amount:", fees);

        let bchCompatibleFees = fees.toFixed(8);
        let feeTx;
        try {
          feeTx = await WALLET.sendBch(
            process.env.ESCROW_WALLET,
            wallet.cashAddress,
            wallet.mnemonic,
            BITBOX.BitcoinCash.toSatoshi(parseFloat(bchCompatibleFees))
          );
          // Update amount after taking fee
          await new Promise((r) => setTimeout(r, 2000));
          amount = await WALLET.getBCHBalance(wallet.cashAddress, false);
        } catch (err) {
          console.log("Error at withDrawFunds:", err);
        }
        console.log("Platform FEE TX:", feeTx);
      }

      // 2 WITHDRAW LAST BCH TO USER

      let withdrawAmount = amount; // - 0.00000600
      let bchCompatibleAmount = withdrawAmount.toFixed(8);
      console.log(" [x] Withdraw amount to User:", bchCompatibleAmount);
      let transaction;
      try {
        transaction = await WALLET.sendAll(
          userCashAddress,
          wallet.cashAddress,
          wallet.mnemonic
        );
      } catch (err) {
        console.log("Error at withDrawFunds", err);
        transaction = 402;
      }
      console.log(transaction);

      if (transaction === 401) {
        return res.send({
          status: 401,
          message: "Insufficient balance",
        });
      }
      if (transaction === 402) {
        return res.send({
          status: 402,
          message: "something went wrong",
        });
      }
      if (transaction === 403) {
        return res.send({
          status: 402,
          message: "UTXO is less then the amount you are trying to withdraw",
        });
      }
      project.isTransactionCleared = true;
      project.save(function (err) {
        if (err) return err;
      });
      res.send({
        status: 200,
        message: `<a href="https://explorer.bitcoin.com/bch/tx/${transaction}">View Transaction Details</a>`,
        transactionCleared: true,
      });
    }
  } else {
    return res.send({
      status: 400,
      message: "campaign not ended",
    });
  }
};

exports.checkGoalStatus = (req, res, next) => {
  const data = req.body;
  let cleared = false;
  console.log(" [x] checkGoalStatus for ", data.id);

  if (data.id) {
    Project.findOne({ _id: data.id })
      .exec()
      .then((project) => {
        if (project.isTransactionCleared) {
          cleared = true;
        }
        if (project.funded >= project.goal) {
          return res.send({
            status: 201,
            message: "goal Reached",
            cleared: cleared,
          });
        } else {
          return res.send({
            status: 200,
            message: "Still way to go",
            cleared: cleared,
          });
        }
      });
  }
};
