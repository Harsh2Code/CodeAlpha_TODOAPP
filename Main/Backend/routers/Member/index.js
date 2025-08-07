const express = require('express');
const { getMyTasks, updateTaskStatus } = require('../../Controllers/Member');
const { auth, isMember } = require('../../middleware/auth');

const router = express.Router();

router.get('/tasks', auth, isMember, getMyTasks);
router.put('/tasks', auth, isMember, updateTaskStatus);

module.exports = router;
