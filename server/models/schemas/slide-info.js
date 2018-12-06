const mongoose = require('mongoose');
const config = require('@project_root/config');

// Схема информации о слайде
const slideInfoSchema = mongoose.Schema({
    page: Number,
    capitalText: String,
    mainText: String,
    additionalText: String,
    requirements: {
        branch: String,
    },
});

module.exports = slideInfoSchema;
