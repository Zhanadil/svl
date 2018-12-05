const router = require('express').Router();

const generalRouter = require('@routes/general');
const userRouter = require('@routes/user');
const adminRouter = require('@routes/admin');

router.use('/general', generalRouter);
router.use('/user', userRouter);
router.use('/admin', adminRouter);

module.exports = router;
