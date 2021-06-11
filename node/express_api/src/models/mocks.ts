const joi = require("@hapi/joi")
export const movieIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/)
export const movieSchema = {
    title: joi.string().max(80).required(),
    year: joi.number().min(1888).max(3000)
}


//export const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{20}$/)
export const userSchema = {
    email: joi.string().max(80).required(),
    year: joi.number().min(1888).max(3000),
    password: joi.number().min(8).max(50)
}
