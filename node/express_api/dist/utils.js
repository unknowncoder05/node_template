"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
var http = require('https');
function get(options) {
    return new Promise(function (resolve, reject) {
        try {
            var req_1 = http.request(options, function (res) {
                console.log("statusCode: " + res.statusCode);
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    resolve(data);
                });
            });
            req_1.on('error', function (error) {
                console.error(error);
            });
            req_1.end();
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.get = get;
