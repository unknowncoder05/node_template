require('dotenv').config({ path: './.env' })
const request = require("supertest")
const { Aplication } = require('./../dist/app')
let myApp = new Aplication()
myApp.listen()
const app = myApp.app
const testData = {
    token: null
}
const testCredentials = {
    "email": "admin@mail.com",
    "password": "admin123"
}
before(function(done) {
    app.on("serverStart", function() {
        done();
    });
});

describe("TEST", () => {
    it("/time respond server time", (done) => {
        request(app)
            .get("/time")
            .set("Accept", /json/)
            .expect("Content-Type", /json/)
            .expect(200, done)
    })
})

describe("AUTHENTIACATION", () => {
    it("/register respond email or password not valid", (done) => {
        let data = {
            "email": "1" + testCredentials.email,
            "name": "tester",
            "password": "epicpassword"
        }
        request(app)
            .post("/register")
            .send(data)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400)
            .end((err, res) => {
                console.log("body:", res.body)
                if (err) {
                    console.log("ERROR!!", err)
                    return done(err);
                }
                if (res.body.msg != "email or password are not valid") {
                    return done(new Error("Expected an other msg"));
                }
                done()
            })
    })
    it("/auth respond not authed", (done) => {
        let data = {
            "email": testCredentials.email,
            "password": "wrongpassword"
        }
        request(app)
            .post("/auth")
            .send(data)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(401)
            .end((err, res) => {
                console.log("body:", res.body)
                if (err) {
                    console.log("ERROR!!", res.body.error)
                    console.log(res.body)
                    return done(err);
                }
                if (res.body.msg != "email or password are not valid")
                    return done(new Error("Expected an other msg"));
                testData.token = res.body.token
                done();
            });
    })
    it("/auth respond invalid jwt token", (done) => {
        request(app)
            .get("/ptime")
            .set("Accept", "application/json")
            .set("access-token", "testDatatoken")
            .expect("Content-Type", /json/)
            .expect(401)
            .end((err, res) => {
                console.log("body:", res.body)
                if (err) {
                    console.log("ERROR!!", res.body.error)
                    return done(err);
                }
                if (res.body.msg != "Invalid token")
                    return done(new Error("Expected an other msg"));
                done();
            });
    })
    it("/auth respond jwt token", (done) => {
        request(app)
            .post("/auth")
            .send(testCredentials)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                console.log("body:", res.body)
                if (err) {
                    console.log("ERROR!!", res.body.error)
                    return done(err);
                }
                if (res.body.msg != "You are you, congrats!")
                    return done(new Error("Expected an other msg"));
                testData.token = res.body.token
                done();
            });
    })
    it("/ptime respond server time", (done) => {
        request(app)
            .get("/ptime")
            .set("Accept", "application/json")
            .set("access-token", testData.token)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                console.log("body:", res.body)
                if (err) {
                    console.log("ERROR!!", res.body.error)
                    return done(err);
                }
                if (res.body.msg != "server time")
                    return done(new Error("Expected an other msg"));
                done();
            });
    })
})

describe("MOVIES", () => {
    var all_movies = [];
    var created_movie = null;
    it("/movie respond movies", (done) => {
        request(app)
            .get("/movies")
            .set("Accept", "application/json")
            .set("access-token", testData.token)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                console.log("body:", res.body)
                if (err) {
                    console.log("ERROR!!", err)
                    return done(err);
                }
                all_movies = res.body.data
                if (res.body.msg != "found")
                    return done(new Error("Expected an other msg"));
                done();
            })
    })
    it("/movie respond created", (done) => {
        let data = {
            title: "test movie",
            year: 2021
        }
        let exists = false
        all_movies.forEach(function(value) {
            if (value.title == data.title) exists = true
        });
        if (exists) {
            console.log("NOT EXECUTING CREATE TEST BECAUSE A MOVIE WITH THIS NAME EXISTS ALREADY")
            done();
        } else
            request(app)
            .post("/movie")
            .send(data)
            .set("Accept", "application/json")
            .set("access-token", testData.token)
            .expect("Content-Type", /json/)
            .expect(201)
            .end((err, res) => {
                console.log("body:", res.body)
                created_movie = res.body.data
                if (err) {
                    console.log("ERROR!!", err)
                    return done(err);
                }
                if (res.body.msg != "created")
                    return done(new Error("Expected an other msg"));
                done();
            })
    })
    it("/movie respond found", (done) => {
        if (!created_movie) {
            console.log("NOT EXECUTING MOVIE GET BECAUSE NO MOVIE WAS CREATED")
            done();
        } else
            request(app)
            .get("/movie/" + created_movie.id)
            .set("Accept", "application/json")
            .set("access-token", testData.token)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                console.log("body:", res.body)
                if (err) {
                    console.log("ERROR!!", err)
                    return done(err);
                }
                if (res.body.msg != "found")
                    return done(new Error("Expected an other msg"));
                done();
            })
    })
    it("/movie respond deleted", (done) => {
        if (!created_movie) {
            console.log("NOT EXECUTING DELETE BECAUSE NO MOVIE WAS CREATED")
            done();
        } else
            request(app)
            .delete("/movie/" + created_movie.id)
            .set("Accept", "application/json")
            .set("access-token", testData.token)
            .expect("Content-Type", /json/)
            .expect(202)
            .end((err, res) => {
                console.log("body:", res.body)
                if (err) {
                    console.log("ERROR!!", err)
                    return done(err);
                }
                if (res.body.msg != "deleted")
                    return done(new Error("Expected an other msg"));
                done();
            })
    })
})