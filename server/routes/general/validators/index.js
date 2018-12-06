const joi = require('joi');

module.exports = {

getJobNumber: joi.object().keys({
    occupation: joi.string().required(),
}),

};
