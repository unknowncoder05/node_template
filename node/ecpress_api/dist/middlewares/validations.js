"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationHandler = void 0;
var joi = require("@hapi/joi");
function validate(data, schema) {
    var error = joi.object(schema).validate(data).error;
    return error;
}
function validationHandler(schema, check) {
    if (check === void 0) { check = 'body'; }
    return function (req, res, next) {
        var error = validate(req[check], schema);
        error ? next(error) : next();
    };
}
exports.validationHandler = validationHandler;
