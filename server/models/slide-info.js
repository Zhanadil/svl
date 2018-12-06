const mongoose = require('mongoose');

const slideInfoSchema = require('@models/schemas/slide-info');

const slideinfo = mongoose.model('slideinfo', slideInfoSchema);

module.exports = slideinfo;
