const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const AdsManagers = require('../Models/adsManagers');
const Transactions = require('../Models/transactions');
const Wallet = require('../Classes/wallet');
const WalletModel = require('../Models/wallet');
const Users = require('../Models/users');
const ReceivingAddress = require('../Models/receivingAddress');

exports.createAdsManagers = async (req, res) => {
    try {
        // check for add manager existence
        const adManager = await AdsManagers.findOne({ username: req.decodedTokenData.username });

        if (adManager && adManager.userId.length > 0) {
            const token = jwt.sign(
                {
                    ...req.decodedTokenData,
                    isAdManager: true
                },
                process.env.JWT_SECRET
            );
            return res.status(409).json({
                token,
                error: 'An ad manager with this user id already exists'
            });
        }

        // create wallet
        const {
            mnemonic,
            cashAddress,
            legacyAddress,
            WIF: privateKey
        } = await Wallet.createWallet();

        const walletObj = new WalletModel({
            _id: new mongoose.Types.ObjectId(),
            mnemonic,
            cashAddress,
            legacyAddress,
            privateKey,
            userId: req.decodedTokenData.userId,
            createdAt: new Date()
        });

        const adsManagers = new AdsManagers({
            _id: new mongoose.Types.ObjectId(),
            userId: req.decodedTokenData.userId,
            name: req.decodedTokenData.name,
            username: req.decodedTokenData.username,
            createdAt: new Date(),
            walletId: walletObj.id
        });

        const receivingAddress = new ReceivingAddress({
            _id: new mongoose.Types.ObjectId(),
            adManagerId: adsManagers.id,
            walletId: walletObj.id,
            address: cashAddress
        });

        await adsManagers.save();
        await walletObj.save();
        await receivingAddress.save();

        const token = jwt.sign(
            {
                ...req.decodedTokenData,
                isAdManager: true
            },
            process.env.JWT_SECRET
        );

        return res.status(201).json({
            token,
            message: 'Successfully created ad manager'
        });
    } catch (error) {
        console.log('error', error);
        return res.status(500).json({
            error: 'Failed to create ad manager'
        });
    }
};

exports.getAdManagerProfile = async (req, res) => {
    try {
        const user = await Users.findOne({ _id: req.decodedTokenData.userId });
        const wallet = await WalletModel.findOne({ userId: req.decodedTokenData.userId });
        const adManager = await AdsManagers.findOne({ username: req.decodedTokenData.username });
        const transactions = await Transactions.find({ userId: req.decodedTokenData.userId });

        return res.status(200).json({
            user,
            adManager,
            transactions,
            cashAddress: wallet.cashAddress
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Failed to get ad manager'
        });
    }
};

exports.returnAdManagerTransactions = async (req, res) => {
    try {
        const transactions = await Transactions.find({ userId: req.decodedTokenData.userId });
        console.log('transactions', transactions);

        return res.status(200).json({
            transactions
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Failed to fetch ad manager transactions'
        });
    }
};
