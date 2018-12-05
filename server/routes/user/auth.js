const express = require('express');
const to = require('await-to-js').default;

const controllers = require('@routes/user/controllers/auth');
const helpers = require('@routes/helpers');
const authValidators = require('@routes/user/validators/auth');

const router = express.Router();

// Регистрация
router.post(
    '/signup',
    helpers.validateBody(authValidators.signUp),
    controllers.signUp
);

// Логиним пользователя и сохраняем сессию
router.post(
    '/signin',
    helpers.validateBody(authValidators.signIn),
    controllers.signIn
);

module.exports = router;
