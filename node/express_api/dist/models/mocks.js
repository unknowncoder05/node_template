"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieSchema = exports.movieIdSchema = void 0;
var joi = require("@hapi/joi");
exports.movieIdSchema = joi.string().regex(/^[0-9a-fA-F]{3}$/);
exports.movieSchema = {
    id: exports.movieIdSchema,
    title: joi.string().max(80).required(),
    year: joi.number().min(1888).max(3000)
};
