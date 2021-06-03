if (process.env.NODE_ENV!="production") console.clear();
const express = require("express")
const {errorHandler} = require("./middlewares/errors")
const {validationHandler} = require("./middlewares/validations")
const { movieIdSchema, movieSchema } = require("./models/mocks")
const { jwtAuth, jwtAuthValidation } = require("./auth/jwtAuth")

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
    users:any = {
        "liam@mail.com":{
            "id":"1",
            "secretdata":"likes chocolate",
            "username":"liam",
            "password":"exposedpassword"
        }
    }
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
        //this.router.post("/auth", this.post_auth())
        this.router.post("/auth", jwtAuth(this.app.get('secret'), 
        (usr:any,psw:any) => {
            if(usr in this.users)
                return psw === this.users[usr].password
            return false
        }) 
        )
        this.router.get("/ptime", this.authMidleware(), this.time)
        this.router.post("/movie", validationHandler(movieSchema),this.post_movie())//
        //this.router.post("/movie" ,this.post_movie())
        this.router.get("/movie/:id", validationHandler({ id: movieIdSchema }, 'params'),this.get_movie())
        

    }
    midleWares(){
        this.app.use(express.json());
        if (process.env.NODE_ENV=="production"){
            this.app.use(function (req:any, res:any, next:any) {
                console.log(Date.now(),req.ip,req.method,req.url)
                next();
            });
        }
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
    authMidleware(){
        return jwtAuthValidation(this.app.get('secret'))
    }
    post_auth(){
        return jwtAuth(this.app.get('secret'), 
        (usr:any,psw:any) => {
            return psw === this.users[usr].password
        }) 
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
        this.app.set('secret', process.env.SECRET);
    }
}

let myApp = new Aplication()
myApp.listen()