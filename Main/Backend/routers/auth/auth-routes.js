const express = require('express');
const router = express.Router();
const {register, login, getAllUsers, getUserProfile} = require('../../Controllers/auth/auth-controllers');
const { auth } = require('../../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/users', auth, getAllUsers);
router.get('/profile', auth, getUserProfile);
router.get('/health', (req, res) => res.status(200).send('OK'));

module.exports = router;
