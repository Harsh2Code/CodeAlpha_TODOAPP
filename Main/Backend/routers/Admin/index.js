const express = require('express');
const { getUsers, getTeams, getTasks } = require('../../Controllers/Admin');
const { auth, isAdmin } = require('../../middleware/auth');

const router = express.Router();

router.get('/users', auth, isAdmin, getUsers);
router.get('/teams', auth, isAdmin, getTeams);
router.get('/tasks', auth, isAdmin, getTasks);

module.exports = router;
