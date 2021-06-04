"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtAuth = exports.jwtAuthValidation = void 0;
var jwt = require('jsonwebtoken');
function jwtAuthValidation(secret) {
    return function (req, res, next) {
        var token = req.headers['access-token'];
        if (token) {
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    return res.json({ mensaje: 'Invalid token' });
                }
                else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
        else {
            res.send({
                mensaje: 'This endpoint requires a token'
            });
        }
    };
}
exports.jwtAuthValidation = jwtAuthValidation;
function jwtAuth(secret, validateCredentials) {
    return function (req, res, next) {
        if (validateCredentials(req.body.email, req.body.password)) {
            var payload = {
                check: true
            };
            var token = jwt.sign(payload, secret, {
                expiresIn: 1440
            });
            res.json({
                msg: 'You are you, congrats!',
                token: token
            });
        }
        else {
            res.json({ mensaje: "email or password are not valid" });
        }
    };
}
exports.jwtAuth = jwtAuth;
