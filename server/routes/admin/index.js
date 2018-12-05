const express = require('express');

const helpers = require('@routes/helpers');

const router = express.Router();

router.use(helpers.validateAdmin);

router.get('/test', (req, res, next) => {
    return res.sendStatus(200);
});

module.exports = router;
