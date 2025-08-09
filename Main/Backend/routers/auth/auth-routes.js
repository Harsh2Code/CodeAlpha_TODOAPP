const express = require('express');
const router = express.Router();
const {register, login, getAllUsers} = require('../../Controllers/auth/auth-controllers');
const { auth } = require('../../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/users', auth, getAllUsers);

module.exports = router;
