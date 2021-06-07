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
    //*/
    
}

async function compare(psw:string ,hash:string){
    let res = await bcrypt.compare(psw, hash)
    return res
}
export class MongoDB{
    db:any
    schemas:any = schemas
    models:any = models
    constructor(MDB_USER:string,MDB_PASSWORD:string,MDB_CLUSTER:string,MDB_DATABASE:string){
        let uri = `mongodb+srv://${MDB_USER}:${MDB_PASSWORD}@${MDB_CLUSTER}/${MDB_DATABASE}?retryWrites=true&w=majority`;
        mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
        this.db = mongoose.connection

        this.db.on('error', console.error.bind(console, 'connection error:'));
        this.db.once('open', function() {
            // we're connected!
            if (process.env.NODE_ENV!="production") console.log("Sir, we are in")
        });
        //testData(this)
        if (process.env.NODE_ENV!="production") console.log("loading movies...")
        //this.getMovies()
        
    }
    async createMovie(movie:{title: String, year: Number}, save:boolean=false){ // HACK: add validation here
        let newMovie = new models.movieModel(movie);
        if(save){
            newMovie.save((err:any, movie:any) => {
                if (err) return err;
                if (process.env.NODE_ENV!="production") console.log("created movie:",movie.id)
              });
        }
        return newMovie
    }
    async getMovies(){
        return await models.movieModel.find((err:any, movies:any) => {
            if (err) return console.error(err);
        })
    }
    async createUser(user:{email: String, name: String, password: String}, save:boolean=false){
        user.password = await bcrypt.hash(user.password, parseInt(process.env.HASH_ROUNDS as string))
        let newUser = new models.userModel(user);
        console.log("SAVING->");
        if(save){
            let res = await newUser.save()
            console.log("CREATED USERRRRRRRRRRRRRRRRR",res)
        }
        console.log("SAVED<-");
        return newUser
    }
    async authUser(email:string, psw:string){
        let user = await models.userModel.find({email})
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
/*
const kittySchema = new mongoose.Schema({
    name: String
  });
const Kitten = mongoose.model('Kitten', kittySchema);
const silence = new Kitten({ name: 'Silence' });

kittySchema.methods.speak = function () {
    const greeting = this.name
      ? "Meow name is " + this.name
      : "I don't have a name";
    console.log(greeting);
  }
  
const fluffy = new Kitten({ name: 'fluffy' });
fluffy.speak();

fluffy.save(function (err:any, fluffy:any) {
    if (err) return console.error(err);
    fluffy.speak();
  });

Kitten.find(function (err:any, kittens:any) {
    if (err) return console.error(err);
    console.log(kittens);
})

*/