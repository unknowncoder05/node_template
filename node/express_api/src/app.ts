if (process.env.NODE_ENV!="production") console.clear();
const express = require("express")
const cors = require("cors");
const { errorHandler } = require("./middlewares/errors")
const { validationHandler } = require("./middlewares/validations")
const { movieIdSchema, movieSchema } = require("./models/mocks")
const { jwtAuth, jwtAuthValidation } = require("./auth/jwtAuth")
const { DB } = require("./database/db")

//import express from "express";

export class Aplication{
    app
    router
    db:typeof DB
    port:string = process.env.PORT as string|"3000"
    constructor(){
        this.app = express()
        this.router = express.Router();
        this.db = new DB(process.env.MDB_USER,process.env.MDB_PASSWORD,process.env.MDB_CLUSTER,process.env.MDB_DATABASE)
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
        this.router.post("/auth", this.post_auth())
        this.router.post("/register", this.post_register)
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
        else{
            this.app.use(cors());
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
            msg: 'server time',
            date : Date.now()
          });
    }
    authMidleware(){
        return jwtAuthValidation(this.app.get('secret'))
    }
    post_auth(){
        return jwtAuth(this.app.get('secret'), 
        async (usr:any,psw:any) => {
            let auth = await this.db.authUser(usr, psw)
            return auth
        })
    }
    post_register(email:string, name:string, password:string){
        return this.db.createUser({email, name, password}, true)
    }
    post_movie(){
        let ddbb = this.db
        return (req:any,res:any,next:any) => {
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
        this.app.listen(this.port,() =>{
            console.log("Listening in port", this.port)
        })
    }
    configAuth(){
        //console.log("SECRET:",process.env.SECRET)
        this.app.set('secret', process.env.SECRET);
    }
}