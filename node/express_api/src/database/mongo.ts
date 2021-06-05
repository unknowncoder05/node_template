const mongoose = require('mongoose');
const movieSchema = new mongoose.Schema({
    title: String,
    year: Number
});
const schemas = {
    movieSchema
}
const movieModel = mongoose.model('Movie', schemas.movieSchema)

const models = {
    movieModel
}

function testData(db:MongoDB){
    let hulk = db.createMovie({ title: 'the big green guy', year: 2077 });
    hulk.save(function (err:any, movie:any) {
        if (err) return console.error(err);
        console.log(movie)
      });

      let matrix = db.createMovie({ title: 'slow mo the movie', year: 3001 }, true);
      console.log(matrix)
}
export class MongoDB{
    db:any
    schemas:any = schemas
    models:any = models
    constructor(MDB_USER:string,MDB_PASSWORD:string,MDB_CLUSTER:string){
        let uri = `mongodb+srv://${MDB_USER}:${MDB_PASSWORD}@${MDB_CLUSTER}/myFirstDatabase?retryWrites=true&w=majority`;
        mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
        this.db = mongoose.connection

        this.db.on('error', console.error.bind(console, 'connection error:'));
        this.db.once('open', function() {
            // we're connected!
            console.log("Sir, we are in")
        });
        //testData(this)
        console.log("loading movies...")
        this.getMovies()
    }
    createMovie(movie:{title: String, year: Number}, save:boolean=false){ // HACK: add validation here
        let newMovie = new models.movieModel(movie);
        if(save){
            newMovie.save(function (err:any, movie:any) {
                if (err) return console.error(err);
                //console.log("uploaded")
              });
        }
        return newMovie
    }
    getMovies(){
        models.movieModel.find(function (err:any, movies:any) {
            if (err) return console.error(err);
            console.log(movies);
        })
    }
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