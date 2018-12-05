const joi = require('joi');

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
    validateUser: (req, res, next) => {
        if (!req.session.user) {
            return res.status(403).send('User is not logged in');
        }

        next();
    },
};
