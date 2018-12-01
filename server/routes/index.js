const router = module.exports = require('express').Router();
const generalRouter = require('@routes/general')

router.use('/general', generalRouter);
