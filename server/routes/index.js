const router = require('express').Router();

const generalRouter = require('@routes/general');
const userRouter = require('@routes/user');

router.use('/general', generalRouter);
router.use('/user', userRouter);

module.exports = router;
