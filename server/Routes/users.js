const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/users');
const checkAuth = require('../Middleware/checkauth');

router.post('/signup', UserController.user_signup);
router.post('/login', UserController.user_login);
router.get('/confirmation/:token', UserController.confirmationPost);
router.get('/stats', UserController.getStats);
router.post('/forgotPassword/', UserController.forgotPassword);
router.post('/resetPassword/', UserController.resetPassword);
router.get('/getUserProfile', checkAuth, UserController.getUserProfile);
router.get('/getUserProfile/:username', UserController.getUserProfileByID);
router.post('/updateUserProfile', checkAuth, UserController.updateUserProfile);
router.get('/getUserWallet', checkAuth, UserController.getUserWallet);

module.exports = router;
