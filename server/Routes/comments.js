const express = require('express');
const router = express.Router();
const commentsController = require('../Controllers/comments');
const checkAuth = require('../Middleware/checkauth');

router.post('/saveComment', checkAuth, commentsController.saveComment);
router.post('/deleteComment', checkAuth, commentsController.deleteComment);
// router.post('/updateComment', checkAuth, commentsController.updateComment);
router.post('/getProjectComments', commentsController.getProjectComments);

module.exports = router;
