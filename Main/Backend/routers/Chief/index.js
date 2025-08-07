const express = require('express');
const { createTeam, assignTask } = require('../../Controllers/Chief');
const { auth, isChief } = require('../../middleware/auth');

const router = express.Router();

router.post('/teams', auth, isChief, createTeam);
router.post('/tasks', auth, isChief, assignTask);

module.exports = router;
