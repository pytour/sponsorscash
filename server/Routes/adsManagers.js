const express = require('express');
const router = express.Router();
const adsManagerController = require('../Controllers/adsManagers');
const checkAuth = require('../Middleware/checkauth');

router.post('/', checkAuth, adsManagerController.createAdsManagers);
router.get('/', checkAuth, adsManagerController.getAdManagerProfile);
router.get('/transactions', checkAuth, adsManagerController.returnAdManagerTransactions);

module.exports = router;
