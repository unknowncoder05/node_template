require('dotenv').config({ path: './.env' })
const request = require("supertest")
const { Aplication } = require('./../dist/app')
const app = new Aplication().app
const testData = {
    token: null
}


describe("GET /time", () => {
    it("respond server time", (done) => {
        request(app)
            .get("/time")
            .set("Accept", /json/)
            .expect("Content-Type", /json/)
            .expect(200, done)
    })
})

describe("AUTHENTIACATION", () => {
    it("/auth respond not authed", (done) => {
        let data = {
            "email": "admin@mail.com",
            "password": "wrongpassword"
        }
        request(app)
            .post("/auth")
            .send(data)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(401)
            .end((err, res) => {
                if (err) {
                    console.log("ERROR!!", res.body.error)
                    console.log(res.body)
                    return done(err);
                }
                //console.log(res.body)
                if (res.body.msg != "email or password are not valid")
                    return done(new Error("Expected an other msg"));
                testData.token = res.body.token
                done();
            });
    })
    it("/auth respond jwt token", (done) => {
        let data = {
            "email": "admin@mail.com",
            "password": "admin123"
        }
        request(app)
            .post("/auth")
            .send(data)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log("ERROR!!", res.body.error)
                    return done(err);
                }
                //console.log(res.body)
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
                if (err) {
                    console.log("ERROR!!", res.body.error)
                    return done(err);
                }
                //console.log(res.body)
                if (res.body.msg != "server time")
                    return done(new Error("Expected an other msg"));
                done();
            });
    })
})