const express = require('express');
const to = require('await-to-js').default;

const User = require('@models/user');

// ************************* HELPERS ***************************

// Сохраняем сессию
const saveSession = (session, user) => {
    // ВАЖНО:
    // Сами данные пользователя не будут сохранены в куки, только токен.
    // Данные будут сохранены на сервере.
    session.user = user;
    session.maxAge = 1000 * 60 * 60 * 24; // Одни сутки в миллисекундах
}

// Контроллеры на экспорт.
module.exports = {

// Регистрируем пользователя и сохраняем сессию
signUp: async (req, res, next) => {
    // Проверяем занята ли почта.
    let [err, user] = await to(
        User.findOne({
            'credentials.email': req.body.email
        })
        .select('+credentials.password')
    );
    if (err) {
        req.log.error('User.findOne throwed an error');
        next(err);
    }
    if (user) {
        req.log.info('User tried to register with used email');
        return res.status(403).send('Email is taken');
    }

    const newUser = new User({
        credentials: {
            email: req.body.email,
            password: req.body.password,
        }
    });

    // Создаем пользователя
    [err] = await to(
        newUser.save()
    );
    if (err) {
        req.log.error('User could not be created');
        return next(err);
    }

    saveSession(req.session, newUser);

    // Скрываем пароль для логов.
    newUser.credentials.password = undefined;

    req.log.info(
        {
            log_info: {
                newUser
            },
        },
        'User signed up'
    );

    return res.sendStatus(200);
},

// Логиним пользователя и сохраняем сессию
signIn: async (req, res, next) => {
    // Находим юзера по почте
    const [err, user] = await to(
        User.findOne({
            'credentials.email': req.body.email
        })
        .select('+credentials.password')
    );
    if (err) {
        req.log.error('User.findOne throwed an error');
        return next(err);
    }
    if (!user) {
        req.log.info(`User [${req.body.email}] not found`);
        return res.status(403).send('User not found');
    }

    // Проверяем пароль на корректность
    const isVerified = await user.credentials.isValidPassword(req.body.password);

    if (!isVerified) {
        req.log.info(`Password is not correct`);
        return res.status(403).send('Password is not correct');
    }

    saveSession(req.session, user);

    req.log.info(`User [${req.body.email}] logged in`);
    return res.sendStatus(200);
},

};
