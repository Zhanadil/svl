const joi = require('joi');

module.exports = {

createJob: joi.object().keys({
    occupation: joi.string().required(),
    country: joi.string().required(),
    averageSalary: joi.number().min(0).required(),
    monthlyExpenses: joi.number().min(0).required(),
    ticketCost: joi.number().min(0).required(),
}),

createSlideInfo: joi.object().keys({
    page: joi.number().required(),
    capitalText: joi.string(),
    mainText: joi.string(),
    additionalText: joi.string(),
    requirements: joi.object().keys({
        branch: joi.string(),
    }),
}),

};
