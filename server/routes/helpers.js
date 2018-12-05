const joi = require('joi');
const to = require('await-to-js').default;

const User = require('@models/user');

module.exports = {
    // Валидатор тела запросов, проверяет что запрос подходит по значениям
    // Пример:
    // Схема запроса /user/auth/signin:
    // {
    //   email: email,
    //   password: string,
    // }
    // То валидатор проверит, что тело запроса подходит под эту схему
    // Все лишние/недостающие аргументы будут зачтены за ошибку.
    // Все аргументы не подходящие по типу также будут считаться ошибкой.
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = joi.validate(req.body, schema);

            if (result.error) {
                return res.status(400).json(result.error);
            }

            if (!req.value) {
                req.value = {};
            }

            req.value['body'] = result.value;

            next();
        }
    },

    // Проверяет куки
    validateUser: async (req, res, next) => {
        if (!req.session.userId) {
            return res.status(403).send('User is not logged in');
        }

        // Находим пользователя по айди сохраненному в сессии
        const [err, user] = await to(
            User.findById(req.session.userId)
        );
        if (err) {
            req.log.error('User.findById throwed an error');
            return next(err);
        }
        if (!user) {
            req.log.warning(`Userid [${req.session.userId}] in session data is incorrect`);
            return res.status(403).send('User is not logged in');
        }

        // Передаем пользователя далее
        req.user = user;

        next();
    },

    validateAdmin: async (req, res, next) => {
        if (!req.session.userId) {
            return res.status(403).send('User is not logged in');
        }

        // Находим пользователя по айди сохраненному в сессии
        const [err, user] = await to(
            User.findById(req.session.userId)
            .select('+isAdmin')
        );
        if (err) {
            req.log.error('User.findById throwed an error');
            return next(err);
        }
        if (!user) {
            req.log.warning(`Userid [${req.session.userId}] in session data is incorrect`);
            return res.status(403).send('User is not logged in');
        }

        if (!user.isAdmin) {
            req.log.info('User has no admin rights');
            return res.status(403).send('Unauthorized');
        }

        // Передаем пользователя далее
        req.user = user;

        next();
    },
};
