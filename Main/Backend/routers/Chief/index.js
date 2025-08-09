const express = require('express');
const router = express.Router();
const { getDashboard, createTeam, getUsers, getAllChiefs } = require('../../Controllers/Chief/index');
const { createProject, getProjects, createTaskInProject, completeTask, getProjectOverview, updateProject } = require('../../Controllers/Chief/Projects');
const { createTask, getTasks } = require('../../Controllers/Chief/Tasks');
const { getTeams, getTeamMembers } = require('../../Controllers/Chief/Teams');
const { auth, isChief, isMember } = require('../../middleware/auth');

router.get('/dashboard', auth, isChief, getDashboard);

// Project Routes
router.post('/projects', auth, isChief, createProject);
router.get('/projects', auth, isChief, getProjects);
router.get('/projects/:projectId/overview', auth, getProjectOverview);
router.put('/projects/:projectId', auth, isChief, updateProject);

// Task Routes
router.post('/projects/:projectId/tasks', auth, isChief, createTaskInProject);
router.put('/tasks/:taskId/complete', auth, completeTask);
router.get('/tasks', auth, isChief, getTasks);

// Team Routes
router.get('/teams', auth, isChief, getTeams);
router.post('/teams', auth, isChief, createTeam);
router.get('/teams/:teamId/members', auth, isChief, getTeamMembers);

// User Routes
router.get('/users', auth, isChief, getUsers);
router.get('/all', auth, isMember, getAllChiefs);

module.exports = router;
