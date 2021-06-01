"use strict";
console.clear();
var express = require("express");
var errorHandler = require("./middlewares/errors").errorHandler;
var validationHandler = require("./middlewares/validations").validationHandler;
var _a = require("./models/mocks"), movieIdSchema = _a.movieIdSchema, movieSchema = _a.movieSchema;
var Aplication = (function () {
    function Aplication() {
        this.db = {
            "1111": { muvi: "lel" }
        };
        this.app = express();
        this.router = express.Router();
        this.midleWares();
        this.routes();
        this.app.use('/', this.router);
        this.errorMidleWares();
    }
    Aplication.prototype.routes = function () {
        this.router.get("/", this.home);
        this.router.get("/time", this.time);
        this.router.post("/movie", validationHandler(movieSchema), this.post_movie());
        this.router.get("/movie/:id", validationHandler({ id: movieIdSchema }, 'params'), this.get_movie());
    };
    Aplication.prototype.midleWares = function () {
        this.app.use(express.json());
        this.app.use(function (req, res, next) {
            console.log(Date.now(), req.ip, req.method, req.url);
            next();
        });
    };
    Aplication.prototype.errorMidleWares = function () {
        this.app.use(errorHandler);
    };
    Aplication.prototype.home = function (req, res, next) {
        res.status(200).send("hellow there");
    };
    Aplication.prototype.time = function (req, res, next) {
        res.status(200).json({
            message: 'server time',
            date: Date.now()
        });
    };
    Aplication.prototype.post_movie = function () {
        var ddbb = this.db;
        return function (req, res, next) {
            try {
                ddbb[req.body.id] = req.body;
                res.status(201).json({
                    message: 'recieved',
                    date: Date.now()
                });
            }
            catch (err) {
                console.error(err);
                next(err);
            }
        };
    };
    Aplication.prototype.get_movie = function () {
        var ddbb = this.db;
        return function (req, res, next) {
            if (req.query.id in ddbb) {
                try {
                    var obj_res = {
                        message: 'found',
                        date: Date.now(),
                        data: ddbb[req.query.id]
                    };
                    res.status(200).json(obj_res);
                }
                catch (err) {
                    next(err);
                }
            }
            else {
                throw (new Error('Invalid id'));
            }
        };
    };
    Aplication.prototype.listen = function () {
        console.log("Listening in port", process.env.PORT);
        this.app.listen(process.env.PORT);
    };
    return Aplication;
}());
var myApp = new Aplication();
myApp.listen();
