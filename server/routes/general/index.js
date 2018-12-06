const express = require('express');

const controllers = require('@routes/general/controllers');

const router = express.Router();

router.get('/occupations', controllers.getAllOccupations);

module.exports = router;
