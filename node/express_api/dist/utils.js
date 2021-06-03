"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.post = exports.get = void 0;
var http = require('http');
function get(options) {
    return new Promise(function (resolve, reject) {
        try {
            var req = http.request(options, function (res) {
                console.log("statusCode: " + res.statusCode);
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    resolve(data);
                });
            });
            req.on('error', function (error) {
                console.error(error);
            });
            req.end();
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.get = get;
function post(options, data) {
    return new Promise(function (resolve, reject) {
        try {
            var req = http.request(options, function (res) {
                console.log("statusCode: " + res.statusCode);
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    resolve(data);
                });
            });
            req.on('error', function (error) {
                console.error(error);
            });
            req.write(data);
            req.end();
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.post = post;
