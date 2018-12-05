const express = require('express');
const to = require('await-to-js').default;

const User = require('@models/user');

const helpers = require('@routes/helpers');

const router = express.Router();

// Проверка сессии
router.use(helpers.validateUser);

// Возвращаем профиль
// На данный момент используется только для проверки сессии
router.get('/', async (req, res, next) => {
    return res.sendStatus(200);
});

module.exports = router;
