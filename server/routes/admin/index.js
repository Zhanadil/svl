const express = require('express');

const helpers = require('@routes/helpers');
const controllers = require('@routes/admin/controllers');
const validators = require('@routes/admin/validators');

const router = express.Router();

router.use(helpers.validateAdmin);

router.route('/job')
    .put(
        helpers.validateBody(validators.createJob),
        controllers.createJob
    );

router.put(
    '/slide-info',
    helpers.validateBody(validators.createSlideInfo),
    controllers.createSlideInfo
);

module.exports = router;
