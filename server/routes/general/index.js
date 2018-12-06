const express = require('express');

const controllers = require('@routes/general/controllers');

const router = express.Router();

router.get('/occupations', controllers.getAllOccupations);

router.get(
    '/slide-info/:page',
    controllers.getSlideInfo
);

module.exports = router;
