const mongoose = require('mongoose');
const config = require('@project_root/config');

const credentialsSchema = require('@models/schemas/credentials');

// Схема юзеров, на данный момент хранит только авторизационные данные.
const userSchema = mongoose.Schema({
    credentials: credentialsSchema,
    isAdmin: {
        type: Boolean,
        default: false,
        select: false,
    }
});

module.exports = userSchema;
