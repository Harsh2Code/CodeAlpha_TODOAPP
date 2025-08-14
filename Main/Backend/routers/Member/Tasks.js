const express = require('express');
const router = express.Router();
const memberTaskController = require('../../Controllers/Member/Tasks');
const { auth, isMember } = require('../../middleware/auth');

router.get('/tasks', auth, isMember, memberTaskController.getMemberTasks);
router.patch('/tasks/:id/complete', auth, isMember, memberTaskController.markTaskAsComplete);

module.exports = router;
