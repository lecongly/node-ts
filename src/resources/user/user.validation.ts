import Joi from 'joi';

const register = Joi.object({
    name: Joi.string().max(30).required(),

    email: Joi.string().email().required(),

    password: Joi.string().min(6).required(),
});
const activation = Joi.object({
    activation_token: Joi.string().required(),
});

const login = Joi.object({
    email: Joi.string().required(),

    password: Joi.string().required(),
});
const forgot = Joi.object({
    email: Joi.string().required(),
});
const resetPassword = Joi.object({
    password: Joi.string().min(6).required(),
});
const update = Joi.object({
    name: Joi.string().required(),
    avatar: Joi.string().required(),
});
export default { register, activation, login, forgot, resetPassword, update };
