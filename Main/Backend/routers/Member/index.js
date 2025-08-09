const express = require('express');
const { getMyTasks, updateTaskStatus, getDashboard, updateChief, getMemberProjects } = require('../../Controllers/Member');
const { auth, isMember } = require('../../middleware/auth');

const router = express.Router();

router.get('/dashboard', auth, isMember, getDashboard);
router.get('/tasks', auth, isMember, getMyTasks);
router.put('/tasks', auth, isMember, updateTaskStatus);
router.put('/chief', auth, isMember, updateChief);
router.get('/projects', auth, isMember, getMemberProjects);

module.exports = router;
