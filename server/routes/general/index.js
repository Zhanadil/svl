const express = require('express');

const helpers = require('@routes/helpers');
const controllers = require('@routes/general/controllers');
const validators = require('@routes/general/validators');

const router = express.Router();

router.get('/occupations', controllers.getAllOccupations);

router.get(
    '/slide-info/:page',
    controllers.getSlideInfo
);

router.post(
    '/job-number',
    helpers.validateBody(validators.getJobNumber),
    controllers.getJobNumber
);

module.exports = router;
