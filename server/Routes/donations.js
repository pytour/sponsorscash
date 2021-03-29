const express = require('express');
const router = express.Router();
const donationsController = require('../Controllers/donations');

router.post('/getProjectDonations', donationsController.getProjectDonations);
router.post('/getUserDonations', donationsController.getUserDonations);
router.post('/createDonation', donationsController.createDonation);

//new routes
router.get('/getDonationAddress', donationsController.getDonationAddress);
router.post('/saveDonation', donationsController.saveTransaction);

module.exports = router;
