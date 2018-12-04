const router = require('express').Router();

const generalRouter = require('@routes/general');

router.use('/general', generalRouter);

module.exports = router;
