const mongoose = require('mongoose');
const bcrypt = require("bcrypt")

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "no email given"],
        unique: true,
    },
    name: {
        type: String,
        required: [true, "no name given"]
    },
    password: {
        type: String,
        required: [true, "no password given"]
    },
});
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "no title given"]
    },
    year: {
        type: Number,
        required: [true, "no year given"]
    },
    category: {
        type: String,
        required: false,
        enum: { values: ['action', 'drama', 'mistery', 'romance', 'horror'], message: '{VALUE} is not a category' }
    },
});
const schemas = {
    userSchema,
    movieSchema
}
const movieModel = mongoose.model("Movie", schemas.movieSchema)
const userModel = mongoose.model("User", schemas.userSchema)

const models = {
    userModel,
    movieModel
}

/*
async function testData(db:MongoDB){
    let hulk = await db.createMovie({ title: "the big green guy", year: 2077 });
    hulk.save(function (err:any, movie:any) {
        if (err) return console.error(err);
        console.log(movie)
    });

    let matrix = db.createMovie({ title: "slow mo the movie", year: 3001 }, true);
    console.log(matrix)
    let admin = await db.createUser({ email: "admin@mail.com", name: "the_admin", password: "admin123"}, true);
    console.log(admin)
    console.log( "fail:",await db.authUser("admin@mail.com","admin1234") )
    console.log( "pass:",await db.authUser("admin@mail.com","admin123") )
    
}*/

async function compare(psw:string ,hash:string){
    let res = await bcrypt.compare(psw, hash)
    return res
}
export class MongoDB{
    db:any
    schemas:any = schemas
    //models:any = models
    constructor(){
        // nothinbg DB related can be done here
        //testData(this)
        //this.getMovies()
        
    }
    connectDB(MDB_USER:string,MDB_PASSWORD:string,MDB_CLUSTER:string,MDB_DATABASE:string){
        let ddbb = this.db
        return new Promise(
            async function(resolve, reject) {
                let uri = `mongodb+srv://${MDB_USER}:${MDB_PASSWORD}@${MDB_CLUSTER}/${MDB_DATABASE}?retryWrites=true&w=majority`;
                mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
                ddbb = mongoose.connection

                ddbb.on('error', (err:any) => {
                    console.error("-<>Connection Failed<>-",err)
                    resolve(err)
                })
                console.debug("<--Connecting to DB-->")
                ddbb.once('open', function() {
                    // we're connected!
                    console.debug("-->Connected to DB<--")
                    resolve(true)
                });
            }
        )
        
    }
    createMovie(movie:{title: String, year: Number}, save:boolean=false){ // HACK: add validation here
        return new Promise(
            async function(resolve, reject) {
                let newMovie = new models.movieModel(movie);          
                if(save){
                    let res = newMovie.save(function (err:any) {      
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve({id:newMovie._id})
                        }
                        // saved!
                      })
                }
                else{
                    resolve(newMovie)
                }
            }
        )
    }
    getMovie(_id:String){
        return new Promise(
            async function(resolve, reject) {
                let movie = await models.movieModel.find({_id},(err:any, movies:any) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        if(movie.length == 0)
                            reject({msg:"no movie with that ID"});
                        else
                            resolve(movie)
                    }
                })
            }
        )
    }
    async getMovies(){
        return await models.movieModel.find((err:any, movies:any) => {
            if (err) return console.error(err);
        })
    }
    createUser(user:{email: String, name: String, password: String}, save:boolean=false){
        return new Promise(
            async function(resolve, reject) {
                user.password = await bcrypt.hash(user.password, parseInt(process.env.HASH_ROUNDS as string))
                let newUser = new models.userModel(user);
                if(save){
                    let res = newUser.save(function (err:any) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve({id:newUser._id})
                        }
                        // saved!
                      })
                }
            }
        )
        
    }
    async authUser(email:string, psw:string){
        let user = await models.userModel.find({email})
        if(user.length == 0){
            return false
        }
        let authed = await compare(psw, user[0].password)
        if(authed)
            return user
        else
            return authed

    }
    close(){
        this.db.close()
    }
    /*getUser(){
        models.userModel.find(function (err:any, user:any) {
            if (err) return console.error(err);
        })
    }*/
}
