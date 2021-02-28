const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/users");
const Token = require("../Models/token");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const CashID = require("../Classes/cashid");
const fs = require("fs");
const path = require("path");
const WalletModel = require("../Models/wallet");
const Wallet = require("../Classes/wallet");

//Signup Function
exports.user_signup = (req, res, next) => {
  // let walletID = new mongoose.Types.ObjectId();
  // let wallet = new Wallet();
  // let walletData = wallet.createWallet();
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.username >= 1) {
        return res.status(409).json({
          message: "Username exists",
        });
      }
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            console.log("bcrypt error");
            return res.status(500).json({
              error: err,
            });
          } else {
            // const walletDB = new WalletModel({
            //   _id: walletID,
            //   mnemonic: walletData.mnemonic,
            //   cashAddress: walletData.cashAddress,
            //   legacyAddress: walletData.legacyAddress,
            //   privateKey: walletData.WIF,
            // });
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username.toLowerCase(),
              name: req.body.name,
              email: req.body.email,
              password: hash,
              accountType: req.body.select,
            });
            // walletDB.save(function (err) {
            //   if (err) return res.status(500).send({ msg: err.message });
            // });
            user.save(function (err) {
              if (err) {
                console.log("user save error");
                return res.status(500).send({ msg: err.message });
              }
              // Create a verification token for this user
              const token = new Token({
                _userId: user._id,
                token: jwt.sign(
                  {
                    email: user.email,
                    userId: user._id,
                  },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "30d",
                  }
                ),
              });
              token.save(function (err) {
                if (err) {
                  console.log("token error");
                  return res.status(500).send({ msg: err.message });
                }

                // Send the email
                const transporter = nodemailer.createTransport(
                  sendgridTransport({
                    auth: {
                      //api_user: process.env.SENDGRID_USERNAME, // SG username
                      api_key: process.env.SENDGRID_PASSWORD, // SG password
                    },
                  })
                );
                let verifyURL = `https://${req.headers.host}/api/users/confirmation/${token.token}`;
                let mailOptions = {
                  from: "noreply@fundme.cash",
                  to: user.email,
                  subject: "Account Verification Token",
                  text:
                    "Hello,\n\n" +
                    "Please verify your Fundme.cash account by clicking the link:\n" +
                    verifyURL,
                  html: `<b>Hello<br>Please verify your Fundme.cash account by clicking the link:</b>
                  <table width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                      <td>
                          <table cellspacing="0" cellpadding="0">
                              <tr>
                                  <td style="border-radius: 2px;" bgcolor="#ED2939">
                                      <a href="${verifyURL}" target="_blank" style="padding: 8px 12px; border: 1px solid #ED2939;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
                                          VERIFY             
                                      </a>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
                </table>
                <br>
                <p>Button not working? Paste the following link into your browser: ${verifyURL}</p>`,
                };
                transporter.sendMail(mailOptions, function (err) {
                  if (err) {
                    console.log("mail error: ", err.message);
                    return res.status(500).send({ msg: err.message });
                  }
                  res.status(200).send({
                    // cashAddress: walletData.cashAddress,
                    // mnemonic: walletData.mnemonic,
                    message: "Ok",
                  });
                });
              });
            });
          }
        });
      }
    });
};

//Login Function
exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.send({
          statusCode: 401,
          status: "User Not Found",
        });
      }
      if (!user[0].isVerified)
        return res.send({
          statusCode: 402,
          status: "Please Verify before logging in",
        });
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.send({
            statusCode: 401,
            status: "Password is incorrect",
          });
        }
        if (result) {
          console.log("Login data", result);
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "30d",
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
            username: user[0].username,
            id: user[0]._id,
            name: user[0].name,
            image: user[0].image,
            accountType: user[0].accountType,
          });
        }
        return res.send({
          statusCode: 401,
          status: "Invalid email or password",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//Confirmation Post
exports.confirmationPost = function (req, res, next) {
  // Find a matching token
  Token.findOne({ token: req.params.token }, function (err, token) {
    if (!token)
      return res.status(400).send({
        type: "not-verified",
        msg:
          "We were unable to find a valid token. Your token my have expired.",
      });

    // If we found a token, find a matching user
    User.findOne({ _id: token._userId }, function (err, user) {
      if (!user)
        return res
          .status(400)
          .send({ msg: "We were unable to find a user for this token." });
      if (user.isVerified)
        return res.status(400).send({
          type: "already-verified",
          msg: "This user has already been verified.",
        });

      // Verify and save the user
      user.isVerified = true;
      user.save(function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        res.status(200).send("The account has been verified. Please log in.");
      });
    });
  });
};

//Forgot password.
exports.forgotPassword = (req, res, next) => {
  User.findOne({ email: req.body.email }, function (err, user) {
    // Create a verification token for this user
    const token = new Token({
      _userId: user._id,
      token: jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      ),
    });
    token.save(function (err) {
      if (err) {
        console.log("token error");
        return res.status(500).send({ msg: err.message });
      }

      // Send the email
      const transporter = nodemailer.createTransport(
        sendgridTransport({
          auth: {
            //api_user: process.env.SENDGRID_USERNAME, // SG username
            api_key: process.env.SENDGRID_PASSWORD, // SG password
          },
        })
      );
      var mailOptions = {
        from: "fundmecashinfo@gmail.com",
        to: user.email,
        subject: "Password Reset",
        text:
          "Hello,\n\n" +
          "You requested password reset,please click on the link to continue: \nhttps://" +
          req.headers.host +
          "/resetPassword?token=" +
          token.token +
          "\n",
      };
      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          console.log("mail error:", err.message);
          return res.status(500).send({ msg: err.message });
        }
        res
          .status(200)
          .send("A reset email has been sent to " + user.email + ".");
      });
    });
  });
};

//Reset Password
exports.resetPassword = (req, res, next) => {
  console.log(req.body.data);
  Token.findOne({ token: req.body.data.token }, function (err, token) {
    if (!token)
      return res.status(400).send({
        type: "not-verified",
        msg:
          "We were unable to find a valid token. Your token my have expired.",
      });

    // If we found a token, find a matching user
    User.findOne({ _id: token._userId }, function (err, user) {
      if (!user)
        return res
          .status(400)
          .send({ msg: "We were unable to find a user for this token." });

      // Verify and save the user
      bcrypt.hash(req.body.data.values.password, 10, (err, hash) => {
        user.password = hash;
        user.save(function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          res.status(200).send("The Password Reset complete. Please log in.");
        });
      });
    });
  });
};

exports.cashidRequest = (req, res, next) => {
  let cashid = new CashID(req.body.domain, req.body.path);
  let uri = cashid.createRequest(
    req.body.action,
    req.body.data,
    req.body.metadata
  );
  return res.send({ uri: uri });
};

exports.cashidParse = (req, res, next) => {
  let cashid = new CashID();
  let request = cashid.validateRequest(req.body);
  let confirmation = cashid.confirmRequest(req.headers);
  return res.status(200).send({ confirmation: confirmation.status });
};

exports.cashidAssociated = (req, res, next) => {
  let cashID = req.body.cashID;
  User.find({ cashID: cashID })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.send({
          statusCode: 401,
          status: "Cash ID not Associated",
          isAssociated: false,
        });
      } else {
        const token = jwt.sign(
          {
            email: user[0].email,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        );
        return res.send({
          message: "Auth successful",
          token: token,
          isAssociated: true,
          username: user[0].username,
          accountType: user[0].accountType,
        });
      }
    })
    .catch((err) => console.log(err));
};

exports.cashidAssociateCredentials = (req, res, next) => {
  User.findOne({ email: req.body.data.values.email }, function (err, user) {
    if (!user) return res.status(400).send({ msg: "User does not exist." });
    if (!user.isVerified)
      return res.send({
        statusCode: 402,
        status: "Please Verify before logging in",
      });

    // Verify and save the user
    bcrypt.compare(
      req.body.data.values.password,
      user.password,
      (err, hash) => {
        if (err) {
          return res.send({
            statusCode: 401,
            status: "Password is incorrect",
          });
        }
        user.cashID = req.body.data.cashID;
        user.save(function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "30d",
            }
          );
          res.send({
            statusCode: 200,
            token: token,
            username: user.username,
            accountType: user.accountType,
          });
        });
      }
    );
  });
};

exports.cashidSignUp = (req, res, next) => {
  User.find({ username: req.body.data.values.username })
    .exec()
    .then((user) => {
      if (user.username >= 1) {
        return res.status(409).json({
          message: "Username exists",
        });
      }
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.data.values.username.toLowerCase(),
        email: req.body.data.values.email,
        accountType: req.body.data.values.select,
        cashID: req.body.data.cashID,
        isVerified: true,
      });
      newUser.save(function (err) {
        if (err) {
          console.log("user save error");
          return res.status(500).send({ msg: err.message });
        }
        res.send({
          statusCode: 200,
        });
      });
    })
    .catch((err) => console.log(err));
};

//Get User Profile Data
exports.getUserProfile = (req, res, next) => {
  User.findOne({ _id: req.decodedTokenData.userId })
    .exec()
    .then((user) => {
      if (user) {
        return res.status(200).json({
          id: user._id,
          name: user.name,
          username: user.username,
          memberSince: user.startedAt,
          image: user.image,
          accountType: user.accountType,
          bio: user.bio,
          websiteURL: user.websiteURL,
          socialLinks: user.socialLinks,
        });
      }
    })
    .catch((err) => console.log(err));
};

exports.getStats = (req, res) => {
  User.find({})
    .exec()
    .then((users) => {
      console.log("users stats");
      let sponsorees = 0;
      if (users) {
        let sponsorees = users.filter((el) => {
          if (el.projects && el.projects.length > 0) return el;
        });
        let registerDates = []; // [{date: countUsers}, {'2020-01-01': 2}, ...]

        for (const user of users) {
          let date = user.startedAt.toJSON().toString().split("T")[0];
          // Group!!!
          console.log(date, typeof date);
          if (registerDates.length === 0) {
            let regObjNew = {};
            regObjNew[date] = 1;
            registerDates.push(regObjNew);
          } else {
            let isNew = true,
              index = 0;
            for (const regObj of registerDates) {
              if (regObj.hasOwnProperty(date)) {
                regObj[date] += 1;
                registerDates[index] = regObj;
                isNew = false;
              }
              index++;
            }
            if (isNew) {
              let regObjNew = {};
              regObjNew[date] = 1;
              // registerDates[index] = regObj;
              registerDates.push(regObjNew);
            }
          }
        }

        return res.status(200).json({
          count: users.length,
          registerDates: registerDates,
          sponsoreesCount: sponsorees.length,
        });
      }
    })
    .catch((err) => console.log(err));
};

exports.getUserProfileByID = (req, res, next) => {
  let { username } = req.params;
  User.findOne({ username: username })
    .exec()
    .then((user) => {
        if (user) {
            return res.status(200).json({
                name: user.name,
                username: user.username,
                memberSince: user.startedAt,
                image: user.image,
                accountType: user.accountType,
                bio: user.bio,
                websiteURL: user.websiteURL,
                socialLinks: user.socialLinks,
                projects: user.projects,
            });
        }

        else {
            // TODO
            return res.status(201).json({
                name:username ,
                message: "user not found",
            });
        }
    })
    .catch((err) => console.log(err));
};

exports.getUserId = (req, res, next) => {
  console.log(" [x] getUserId req params ", req.params);
  let address = req.params.address;
  User.findOne({ cashID: address })
    .exec()
    .then((user) => {
      console.log("user", user);
      if (user) {
        return res.status(200).json({
          id: user._id,
          name: user.name,
          username: user.username,
          memberSince: user.startedAt,
          image: user.image,
          accountType: user.accountType,
          bio: user.bio,
          websiteURL: user.websiteURL,
          socialLinks: user.socialLinks,
        });
      } else {
        // TODO
        return res.status(201).json({
          address: address,
          message: "user with such address not found",
        });
      }
    })
    .catch((err) => console.log(err));
};
//Update User Profile
exports.updateUserProfile = (req, res, next) => {
  const data = req.body;
  console.log("updateUserProfile:", data);
  // console.log("updateUserProfile:", data.imageURI, data.imageInput);
  let staticPath = "";
  let userImage = data.imageURI;
  if (userImage) {
    userImage = userImage.replace(/^data:image\/(jpeg|png);base64,/, "");
    staticPath = `pp_${req.decodedTokenData.userId}.png`;
    let imagePath = path.normalize(
      __dirname + `/../../public/UserImages/${staticPath}`
    );
    console.log("image path:", imagePath);
    // console.log("image value:", userImage);
    fs.writeFileSync(imagePath, userImage, "base64");
  }

  User.findOne({ _id: req.decodedTokenData.userId })
    .exec()
    .then((user) => {
      if (user) {
        user.name = data.name;
        if (userImage) {
          user.image = staticPath;
        }
        user.bio = data.bio;
        user.websiteURL = data.websiteURL || null;
        if (!user.socialLinks) user.socialLinks = {};
        if (data.socialLinks) user.socialLinks = data.socialLinks;
        user.socialLinks.facebook = data.facebook
          ? data.facebook
          : user.socialLinks.facebook;
        user.socialLinks.telegram = data.telegram
          ? data.telegram
          : user.socialLinks.telegram;
        user.socialLinks.twitter = data.twitter
          ? data.twitter
          : user.socialLinks.twitter;
        user.socialLinks.email = data.email
          ? data.email
          : user.socialLinks.email;

        console.log("USER DATA", user);
        user.save(function (err) {
          if (err) return res.status(500).json({ msg: err.message });
          res.send({
            status: 200,
            message: "Profile Updated",
          });
        });
      }
    });
};

exports.getUserWallet = (req, res, next) => {
  User.findOne({ _id: req.decodedTokenData.userId })
    .exec()
    .then((user) => {
      if (user) {
        WalletModel.findOne({ _id: user.walletID })
          .exec()
          .then((wallet) => {
            if (wallet) {
              res.send({
                status: 200,
                userWalletAddr: wallet.cashAddress,
                userWalletMnemonic: wallet.mnemonic,
              });
            } else {
              res.send({
                status: 404,
              });
            }
          });
      }
    })
    .catch((err) => console.log(err));
};
