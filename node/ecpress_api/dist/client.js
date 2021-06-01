"use strict";
var http = require('http');
var options = {
    hostname: 'localhost',
    port: 3000,
    path: '/movie/111',
    method: 'GET',
};
var getter = http.request(options, function (res) {
    console.log("statusCode: " + res.statusCode);
    res.on('data', function (d) {
        console.log("get:", d.toString());
    });
    res.on('error', function (error) {
        console.error("get err:", error);
    });
});
var data = JSON.stringify({
    id: "112",
    title: "the walking kong",
    year: 2000
});
options = {
    hostname: 'localhost',
    port: 3000,
    path: '/movie',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};
var req = http.request(options, function (res) {
    console.log("statusCode: " + res.statusCode);
    res.on('data', function (d) {
        process.stdout.write(d);
    });
    res.on('error', function (error) {
        console.error(error);
    });
}, data);
req.write(data);
req.end();
getter.end();
