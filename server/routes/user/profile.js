const express = require('express');
const to = require('await-to-js').default;

const User = require('@models/user');

const helpers = require('@routes/helpers');

const router = express.Router();

// Проверка сессии
router.use(helpers.validateUser);

// Возвращаем профиль
router.get('/', async (req, res, next) => {
    return res.status(200).json({
        user: req.user
    });
});

module.exports = router;
