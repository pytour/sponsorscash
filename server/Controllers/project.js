const mongoose = require('mongoose');
const User = require('../Models/users');
const Project = require('../Models/project');
const ReceivingAddress = require('../Models/receivingAddress');
const WalletModel = require('../Models/wallet');
const fs = require('fs');
const path = require('path');
const Wallet = require('../Classes/wallet');
const bitboxSDK = require('bitbox-sdk').BITBOX;
const BITBOX = new bitboxSDK();

require('dotenv').config();

exports.createProject = (req, res) => {
    let data = req.body;
    let userImages = data.images;

    let staticPath = '';
    let _id = new mongoose.Types.ObjectId();

    let dbImages = [];
    if (userImages) {
        for (let [key, value] of Object.entries(userImages)) {
            value = value.replace(/^data:image\/(jpeg|png);base64,/, '');
            staticPath = `projImg_${req.decodedTokenData.userId}_${_id}_${key}.png`;
            let imagePath = path.normalize(__dirname + `/../../public/ProjectImages/${staticPath}`);
            dbImages.push(staticPath);
            console.log('image path:', imagePath);
            fs.writeFileSync(imagePath, value, 'base64');
        }
    }

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
        status: 'ACTIVE',
        receivingAddresses: data.receivingAddresses
    });

    data &&
        data.receivingAddresses &&
        data.receivingAddresses.map(obj => {
            let receivingAddress = new ReceivingAddress({
                _id: new mongoose.Types.ObjectId(),
                projectId: _id,
                address: obj
            });

            return receivingAddress.save(function(err) {
                if (err) {
                    console.log('Error at createDonation:', err);
                }
            });
        });

    project.save(function(err) {
        if (err) {
            console.log('project save error');
            console.log(err);
            return res.status(500).send({ msg: err.message });
        }
        User.findOne({ _id: req.decodedTokenData.userId })
            .exec()
            .then(user => {
                user.projects.push(_id);
                user.save(function(err) {
                    if (err) {
                        console.log('project save error');
                        console.log(err);
                        return res.status(500).send({ msg: err.message });
                    }
                    res.send({
                        status: 200,
                        message: 'Project Created',
                        username: user.username
                    });
                });
            });
    });
};

exports.getProjects = (req, res) => {
    User.findOne({ _id: req.decodedTokenData.userId })
        .populate('projects')
        .exec(function(err, projects) {
            if (err) {
                return res.status(500).send({ msg: err.message });
            }
            res.send({
                status: 200,
                projects: projects.projects
            });
        });
};

exports.getAllProjects = (req, res) => {
    Project.find({ startTime: { $exists: true } })
        .then(projects => {
            res.send({
                status: 200,
                projects: projects
            });
        })
        .catch(err => {
            return res.status(500).send({ msg: err.message });
        });
};

exports.getPopularProjects = (req, res) => {
    Project.find({ hasEnded: false })
        .then(projects => {
            let allowedProjects = projects.filter(project => {
                const progress = Math.round((project.funded * 100) / project.goal);
                const allowed = project.approved || progress >= 3;
                const ongoing = project.endTime > new Date().toJSON();
                if (ongoing && project.status === 'ACTIVE' && allowed) return project;
            });

            // console.log(projects);
            // console.log(allowedProjects);
            res.send({
                status: 200,
                projects: allowedProjects
            });
        })
        .catch(err => {
            return res.status(500).send({ msg: err.message });
        });
};

/**
 * Get Completed Projects
 * that sorted in descending order by funded value
 * @param {Object} req request
 * @param {Object} res result
 */
exports.getCompletedProjects = (req, res) => {
    let { campaignsLimit } = req.query;
    Project.find({ hasEnded: true })
        .sort({ funded: -1 })
        .limit(parseInt(campaignsLimit))
        .then(projects => {
            res.send({
                status: 200,
                projects: projects
            });
        })
        .catch(err => {
            return res.status(500).send({ msg: err.message });
        });
};

exports.getSingleProject = async (req, res) => {
    let { id } = req.params;
    let project, user;
    // Get project
    try {
        project = await Project.findOne({ _id: id }).exec();
    } catch (error) {
        console.log(error);
        return res.send({
            status: 404,
            error: error
        });
    }

    // Get campaign creator info
    if (project) {
        let cashAddress;
        if (project.projectWalletID) {
            // Legacy - Backward compatibility for old campaigns
            //We need to get cashAddress
            try {
                let wallet = await WalletModel.findOne({
                    _id: project.projectWalletID
                }).exec();
                cashAddress = wallet.cashAddress;
                console.log(' [x] Project Wallet Address: ', wallet.cashAddress);
            } catch (error) {
                console.log('Non-custodial campaign');
            }
        }
        try {
            user = await User.findOne({ projects: id }).exec();
        } catch (error) {
            console.log(error);
            return res.send({
                status: 404,
                error: error
            });
        }

        // Get project donations

        // Get project receiving  BCH ADDRESS
        try {
            // Return result
            res.send({
                status: 200,
                project: project,
                cashAddress: cashAddress,
                creator: user.name || user.username,
                avatar: user.image,
                username: user.username
            });
        } catch (error) {
            console.log(error);
            return res.send({
                status: 404,
                error: error
            });
        }
    } else {
        return res.send({
            status: 404
        });
    }
};

/**
 * **Update project data:** short and full description ; ending date ; ...
 *
 * Body: `{ id , values, images, endTime }`
 *
 * where images: `{ changed: { key:value , ...}, allImagesNames: [imageName1, ...] }`
 *
 * imageName (String) exmaple: projImg_5e6a3e651673aa0017740711_5f842ef68f0968378077904e_image1.png
 */
exports.editProject = async (req, res) => {
    let data = req.body;
    let images = data.images;
    let projectId = data.id;
    let userId = req.decodedTokenData.userId;
    let staticPath = '';
    let dbImages = images.allImagesNames;

    // Check if user owner of this project
    let isOwner;
    try {
        const user = await User.findOne({
            _id: req.decodedTokenData.userId
        }).exec();
        console.log(`[x] editProject ${projectId} for user ${user.username}`);
        for (const id of user.projects) {
            if (id.toString() === projectId) {
                isOwner = true;
            }
        }
    } catch (error) {
        return res.send({
            status: 404,
            msg: error.message
        });
    }

    if (!isOwner) {
        return res.send({
            status: 404,
            msg: 'User is not owner of project: ' + projectId
        });
    }

    if (images && images.changed) {
        // Update images that changed
        for (let [key, value] of Object.entries(images.changed)) {
            value = value.replace(/^data:image\/(jpeg|png);base64,/, '');
            staticPath = `projImg_${userId}_${projectId}_${key}.png`;
            let imagePath = path.normalize(__dirname + `/../../public/ProjectImages/${staticPath}`);
            fs.writeFileSync(imagePath, value, 'base64');
        }
    }

    try {
        await Project.updateOne(
            { _id: projectId },
            {
                description: data.values.description,
                details: data.values.detail,
                images: dbImages,
                endTime: data.endTime
            }
        );
        return res.send({
            status: 200,
            msg: 'Successfully updated, projectId:' + projectId
        });
    } catch (error) {
        return res.send({
            status: 404,
            msg: error.message
        });
    }
};

exports.getProjectCashAddress = (req, res) => {
    let { id } = req.params;
    // get cash address in wallet
    WalletModel.findOne({ _id: id })
        .exec()
        .then(wallet => {
            res.send({
                status: 200,
                cashAddress: wallet.cashAddress
            });
        })
        .catch(err => console.log(err));
};

exports.getArrayOfProjects = (req, res) => {
    const data = req.body;
    const objIds = data.projects.map(el => mongoose.Types.ObjectId(el));
    Project.find({ _id: { $in: objIds } })
        .exec()
        .then(projects => {
            if (projects) {
                res.send({
                    status: 200,
                    projects: projects
                });
            } else {
                res.send({
                    status: 404
                });
            }
        })
        .catch(err => console.log(err));
};

exports.payUsingCustomWallet = async (req, res) => {
    const data = req.body;
    let wallet = new Wallet();
    console.log('payUsingCustomWallet amount: ', data.amount);
    console.log('payUsingCustomWallet data: ', data);
    let transaction = await wallet.sendBch(
        data.receiverAddr,
        data.senderAddr,
        data.senderMnemonic,
        data.amount
    );
    if (transaction === 401) {
        return res.send({
            status: 401,
            message: 'You do not have sufficient balance in your account. Try funding it first'
        });
    }
    if (transaction === 402) {
        return res.send({
            status: 402,
            message: 'Something went wrong'
        });
    }
    if (transaction === 403) {
        return res.send({
            status: 403,
            message: 'Something went wrong'
        });
    }
    Project.findOne({ _id: data.projectID })
        .exec()
        .then(project => {
            project.funded = project.funded + BITBOX.BitcoinCash.toBitcoinCash(data.amount);
            project.save(function(err) {
                if (err) return err;
                if (project.funded >= project.goal) {
                    return res.send({
                        status: 201,
                        completed: true,
                        message: `<a href="https://explorer.bitcoin.com/tbch/tx/${transaction}">View Transaction Details</a>`
                    });
                }
                res.send({
                    status: 200,
                    message: `<a href="https://explorer.bitcoin.com/tbch/tx/${transaction}">View Transaction Details</a>`
                });
            });
        });
};

exports.updateFunds = (req, res) => {
    const data = req.body;
    Project.findOne({ _id: data.projectID })
        .exec()
        .then(project => {
            project.funded = project.funded + data.amount;

            project.save(function(err) {
                if (err) return err;
                if (project.funded >= project.goal) {
                    return res.send({
                        status: 201,
                        completed: true,
                        message: 'Funds Updated And Goal Reached'
                    });
                }
                res.send({
                    status: 200,
                    message: 'Funds updated'
                });
            });
        });
};

exports.isBchAddress = (req, res) => {
    const { bchAddress } = req.body;
    console.log(bchAddress);
    // check address
    let isCashAddress, isMainnetAddress;
    try {
        isCashAddress = BITBOX.Address.isCashAddress(bchAddress);
    } catch (error) {
        console.log(error);
    }
    try {
        isMainnetAddress = BITBOX.Address.isMainnetAddress(bchAddress);
    } catch (error) {
        console.log(error);
    }

    if (isCashAddress && isMainnetAddress) {
        // Ok
        return res.send({
            status: 200,
            message: 'Correct address format'
        });
    } else if (!isCashAddress) {
        // Error
        return res.send({
            status: 400,
            message: 'wrong address format, must be cash address'
        });
    } else if (!isMainnetAddress) {
        return res.send({
            status: 400,
            message: 'wrong address format, must be mainnet address'
        });
    }
};

exports.checkFunds = async (req, res) => {
    const data = req.body;
    const projectId = data.projectID;
    let project;
    try {
        project = await Project.findOne({ _id: projectId }).exec();
    } catch (error) {
        return res.send({ status: 400, message: 'Error' + error.message });
    }
    if (project.funded >= project.goal) {
        return res.send({
            status: 200,
            funded: project.funded,
            completed: true,
            message: 'Goal Reached'
        });
    } else {
        return res.send({
            status: 200,
            message: 'Funded value',
            funded: project.funded
        });
    }
};

exports.setCompletion = async (req, res) => {
    const data = req.body;
    Project.findOne({ _id: data.projectID })
        .exec()
        .then(project => {
            project.hasEnded = data.ended;
            project.save(function(err) {
                if (err) return err;
                res.send({
                    status: 200,
                    ended: true
                });
            });
        });
};

exports.cancelProject = async (req, res) => {
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
        console.log(' [x] Username:', user.username);
        let isOwner = user.projects.includes(projectId);
        if (!isOwner) {
            return res.send({
                status: 400,
                message: 'user not owner of this project'
            });
        }
    } catch (error) {
        console.log(error);
        return res.send({
            status: 400,
            message: 'user not exists'
        });
    }
    // Get project
    let project;
    try {
        project = await Project.findOne({ _id: projectId }).exec();
        console.log(' [x] Project Title:', project.title);
        project.status = 'CANCELED';
        await project.save();
        return res.send({
            status: 200,
            message: 'Project successfully cancelled'
        });
    } catch (error) {
        console.log(error);
        return res.send({
            status: 400,
            message: "can't cancell this project"
        });
    }
};

exports.checkGoalStatus = (req, res) => {
    const data = req.body;
    let cleared = false;
    console.log(' [x] checkGoalStatus for ', data.id);

    if (data.id) {
        Project.findOne({ _id: data.id })
            .exec()
            .then(project => {
                if (project.isTransactionCleared) {
                    cleared = true;
                }
                if (project.funded >= project.goal) {
                    return res.send({
                        status: 201,
                        message: 'goal Reached',
                        cleared: cleared
                    });
                } else {
                    return res.send({
                        status: 200,
                        message: 'Still way to go',
                        cleared: cleared
                    });
                }
            });
    }
};

exports.setProjectAddresses = async (req, res) => {
    const { addresses } = req.body;

    const project = await Project.findById(req.params.id);
    project.receivingAddresses = addresses;
    await project.save();

    res.send({
        status: 200,
        addresses,
        project: project
    });
};
