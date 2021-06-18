const express = require('express');
const router = express.Router();
const projectController = require('../Controllers/project');
const checkAuth = require('../Middleware/checkauth');

router.post('/createProject', checkAuth, projectController.createProject);
router.get('/getProjects', checkAuth, projectController.getProjects);
router.get('/getAllProjects', projectController.getAllProjects);
router.get('/getPopularProjects', projectController.getPopularProjects);
router.get('/getCompletedProjects', projectController.getCompletedProjects);
router.get('/getSingleProject/:id', projectController.getSingleProject);
router.post('/editProject', checkAuth, projectController.editProject);

router.get('/getProjectCashAddress/:id', projectController.getProjectCashAddress);
router.post('/donateToProject', projectController.payUsingCustomWallet);
router.post('/updateFunds', projectController.updateFunds);
router.post('/checkFunds', projectController.checkFunds);
router.post('/isBchAddress', projectController.isBchAddress);
router.post('/setCompletion', projectController.setCompletion);
router.post('/checkGoalStatus', projectController.checkGoalStatus);
router.post('/cancelProject', checkAuth, projectController.cancelProject);
router.post('/getArrayOfProjects', projectController.getArrayOfProjects);

module.exports = router;
