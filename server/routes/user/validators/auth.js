const joi = require('joi');

const User = require('@models/user');

module.exports = {

signUp: joi.object().keys({
    email: joi.string().email({ minDomainAtoms: 2 }).required(),
    password: joi.string().required(),
}),

signIn: joi.object().keys({
    email: joi.string().email({ minDomainAtoms: 2 }).required(),
    password: joi.string().required(),
}),

};
