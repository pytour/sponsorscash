const express = require("express");
const router = express.Router();
const donationsController = require('../Controllers/donations');
const checkAuth = require('../Middleware/checkauth');


router.post('/getProjectDonations', donationsController.getProjectDonations);
router.post('/getUserDonations', donationsController.getUserDonations);
router.post('/createDonation', donationsController.createDonation);
// router.post('/createDonation',checkAuth, donationsController.createDonation);

module.exports = router;
