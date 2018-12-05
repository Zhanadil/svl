const express = require('express');

const router = express.Router();
const authRouter = require('@routes/user/auth');
const profileRouter = require('@routes/user/profile');

router.use('/auth', authRouter);
router.use('/profile', profileRouter);

module.exports = router;
