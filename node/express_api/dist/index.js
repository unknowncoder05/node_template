"use strict";
if (process.env.NODE_ENV == "production")
    console.clear();
var express = require("express");
var errorHandler = require("./middlewares/errors").errorHandler;
var validationHandler = require("./middlewares/validations").validationHandler;
var _a = require("./models/mocks"), movieIdSchema = _a.movieIdSchema, movieSchema = _a.movieSchema;
var _b = require("./auth/jwtAuth"), jwtAuth = _b.jwtAuth, jwtAuthValidation = _b.jwtAuthValidation;
var Aplication = (function () {
    function Aplication() {
        this.db = {
            "1111": {
                title: "revenge III",
                year: 2010
            }
        };
        this.port = process.env.PORT;
        this.users = {
            "liam@mail.com": {
                "id": "1",
                "secretdata": "likes chocolate",
                "username": "liam",
                "password": "exposedpassword"
            }
        };
        this.app = express();
        this.router = express.Router();
        this.midleWares();
        this.configAuth();
        this.routes();
        this.app.use('/', this.router);
        this.finalMidleWares();
    }
    Aplication.prototype.routes = function () {
        var _this = this;
        this.router.get("/", this.home);
        this.router.get("/time", this.time);
        this.router.post("/auth", jwtAuth(this.app.get('secret'), function (usr, psw) {
            if (usr in _this.users)
                return psw === _this.users[usr].password;
            return false;
        }));
        this.router.get("/ptime", this.authMidleware(), this.time);
        this.router.post("/movie", validationHandler(movieSchema), this.post_movie());
        this.router.get("/movie/:id", validationHandler({ id: movieIdSchema }, 'params'), this.get_movie());
    };
    Aplication.prototype.midleWares = function () {
        this.app.use(express.json());
        if (process.env.NODE_ENV == "production") {
            this.app.use(function (req, res, next) {
                console.log(Date.now(), req.ip, req.method, req.url);
                next();
            });
        }
    };
    Aplication.prototype.finalMidleWares = function () {
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
    Aplication.prototype.authMidleware = function () {
        return jwtAuthValidation(this.app.get('secret'));
    };
    Aplication.prototype.post_auth = function () {
        var _this = this;
        return jwtAuth(this.app.get('secret'), function (usr, psw) {
            return psw === _this.users[usr].password;
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
        console.log("Listening in port", this.port);
        this.app.listen(this.port);
    };
    Aplication.prototype.configAuth = function () {
        this.app.set('secret', process.env.SECRET);
    };
    return Aplication;
}());
var myApp = new Aplication();
myApp.listen();
