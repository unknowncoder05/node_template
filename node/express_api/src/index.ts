console.clear()
const express = require("express")
const {errorHandler} = require("./middlewares/errors")
const {validationHandler} = require("./middlewares/validations")
const { movieIdSchema, movieSchema } = require("./models/mocks")
const passport = require("passport")
const GoogleStrategy = require('passport-google').Strategy;
//import express from "express";

class Aplication{
    app
    router
    db:any = {
        "1111":{
            title:"revenge III",
            year: 2010
          }
    }
    port:string = process.env.PORT as string|"3000"
    users:any = {}
    constructor(){
        this.app = express()
        this.router = express.Router();
        this.midleWares() // before everything
        this.configAuth()
        this.routes()
        this.app.use('/', this.router) // after midle wares
        this.finalMidleWares() // after everything
    }
    routes(){
        this.router.get("/",this.home)
        this.router.get("/time", this.time)
        this.router.post("/movie", validationHandler(movieSchema),this.post_movie())//
        //this.router.post("/movie" ,this.post_movie())
        this.router.get("/movie/:id", validationHandler({ id: movieIdSchema }, 'params'),this.get_movie())

        this.app.get('/auth/google', passport.authenticate('google'));

        this.app.get('/auth/google/return', 
        passport.authenticate('google', { failureRedirect: '/' }),
        function(req:any, res:any) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });
    }
    midleWares(){
        this.app.use(express.json());
        if (process.env.NODE_ENV=="production"){
            this.app.use(function (req:any, res:any, next:any) {
                console.log(Date.now(),req.ip,req.method,req.url)
                next();
            });
        }
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }
    finalMidleWares(){
        this.app.use(errorHandler)
    }
    home(req:any,res:any,next:any){
        res.status(200).send("hellow there")
    }
    time(req:any,res:any,next:any){
        res.status(200).json({
            message: 'server time',
            date : Date.now()
          });
    }
    post_movie(){
        let ddbb = this.db
        return function(req:any,res:any,next:any){
            try {
                ddbb[req.body.id] = req.body
                res.status(201).json({
                    message: 'recieved',
                    date : Date.now()
                });
            } catch(err){
                console.error(err)
                next(err)
            }
            
        }
        
    }
    get_movie(){
        let ddbb = this.db
        return function(req:any,res:any,next:any){
            if (req.query.id in ddbb){
                try {
                    let obj_res = {
                        message: 'found',
                        date : Date.now(),
                        data: ddbb[req.query.id]//req.params.id
                    }
                    res.status(200).json(obj_res);
                } catch(err){
                    next(err)
                }
            } else {
                throw(new Error('Invalid id'))
            }
            
        }
        
    }
    listen(){
        console.log("Listening in port", this.port)
        this.app.listen(this.port)
    }
    configAuth(){
        let users = this.users
        passport.use(new GoogleStrategy({
            returnURL: `http://localhost:${this.port}/auth/google/return`,
            realm: `http://localhost:${this.port}/`
          },
          function(identifier:any, done:any) {
            users.findByOpenID({ openId: identifier }, function (err:any, user:any) {
              return done(err, user);
            });
          }
        ));
    }
}

let myApp = new Aplication()
myApp.listen()