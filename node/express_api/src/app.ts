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
        this.db = new DB()
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
        this.router.post("/auth", this.postAuth())
        this.router.post("/register", this.postRegister())

        this.router.get("/ptime", this.authMidleware(), this.time)
        this.router.post("/movie", this.authMidleware(), validationHandler(movieSchema),this.postMovie())//
        //this.router.post("/movie" ,this.post_movie())
        this.router.get("/movie/:id", validationHandler({ id: movieIdSchema }, 'params'),this.getMovie())
        

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
    postAuth(){
        return jwtAuth(this.app.get('secret'), 
        async (usr:any,psw:any) => {
            let auth = await this.db.authUser(usr, psw)
            return auth
        })
    }
    postRegister(){
        let ddbb = this.db
        return async (req:any,res:any,next:any) => {
            try {
                let new_user = await ddbb.createUser({
                    email:req.body.email,
                    name:req.body.name,
                    password:req.body.password
                }, true)
                res.status(201).json(new_user)
            } catch (error) {
                if(error.code == 11000){
                    res.status(400).json({ msg:"email or password are not valid" })
                }
                else{
                    res.status(500).json({ msg:"internal server error" })
                }
                
            }
            
            
            
        }
    }
    postMovie(){
        let ddbb = this.db
        return async (req:any,res:any,next:any) => {
            try {
                let movie = await ddbb.createMovie(req.body, true) 
                
                res.status(201).json({
                    msg: 'created',
                    data : movie
                });
            } catch(err){
                console.log("GOTCHAAAAAAAAAA",err)
                next(err)
            }
            
        }
        
    }
    getMovie(){
        let ddbb = this.db
        return async (req:any,res:any,next:any) => {
            try {
                let movie = await ddbb.getMovie(req.query.id) 
                res.status(201).json({
                    msg: 'created',
                    data : movie
                });
            } catch(err){
                next(err)
            }
            
        }
        
    }
    
    
    async listen(){
        let connected = await this.db.connectDB(process.env.MDB_USER,process.env.MDB_PASSWORD,process.env.MDB_CLUSTER,process.env.MDB_DATABASE)
        if(connected){
            this.app.listen(this.port,() =>{
                console.log("Listening in port", this.port)
            })
        }
        
    }
    configAuth(){
        //console.log("SECRET:",process.env.SECRET)
        this.app.set('secret', process.env.SECRET);
    }
}