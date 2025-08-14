const express = require('express');
const { getMyTasks, updateTaskStatus, getDashboard, updateChief, getMemberProjects, getChiefActivity, getMemberTeams } = require('../../Controllers/Member');
const { auth, isMember } = require('../../middleware/auth');
const memberTasksRouter = require('./Tasks');
const memberTaskController = require('../../Controllers/Member/Tasks');
const { getDetailedProjects } = require('../../Controllers/Member/Projects');

const router = express.Router();

// Routes
router.get('/dashboard', auth, isMember, getDashboard);
router.put('/tasks', auth, isMember, updateTaskStatus);
router.put('/chief', auth, updateChief);
router.get('/projects', auth, isMember, getMemberProjects);
router.get('/projects/detailed', auth, isMember, getDetailedProjects);
router.get('/projects/:projectId/tasks', auth, isMember, memberTaskController.getProjectTasksForMember);
router.get('/chief-activity', auth, isMember, getChiefActivity);
router.get('/teams', auth, isMember, getMemberTeams);

// Use task routes
router.use(memberTasksRouter);

module.exports = router;
