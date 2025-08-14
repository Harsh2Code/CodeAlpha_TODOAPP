const express = require('express');
const router = express.Router();
const { getDashboard, createTeam, getUsers, getAllChiefs } = require('../../Controllers/Chief/index');
const { createProject, getProjects, createTaskInProject, completeTask, getProjectOverview, updateProject } = require('../../Controllers/Chief/Projects');
const { createTask, getTasks, assignTask } = require('../../Controllers/Chief/Tasks');
const { getTeams, getTeamMembers, updateTeam, removeMemberFromTeam, promoteMemberToLeader, getTeamById } = require('../../Controllers/Chief/Teams');
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
router.post('/tasks/assign', auth, isChief, assignTask);

// Team Routes
router.get('/teams', auth, isChief, getTeams);
router.get('/teams/:teamId', auth, isChief, getTeamById);
router.post('/teams', auth, isChief, createTeam);
router.get('/teams/:teamId/members', auth, isChief, getTeamMembers);
router.put('/teams/:teamId', auth, isChief, updateTeam);
router.delete('/teams/:teamId/members/:memberId', auth, isChief, removeMemberFromTeam);
router.put('/teams/:teamId/members/:memberId/promote', auth, isChief, promoteMemberToLeader);

// User Routes
router.get('/users', auth, isChief, getUsers);
router.get('/all', auth, getAllChiefs);

module.exports = router;
