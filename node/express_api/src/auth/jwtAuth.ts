const jwt = require('jsonwebtoken');


export function jwtAuthValidation(secret:any){
    return (req:any, res:any, next:any) => {
        let token = req.headers['access-token'];
     
        if (token) {
          jwt.verify(token, secret, (err:any, decoded:any) => {      
            if (err) {
              return res.json({ mensaje: 'Invalid token' });    
            } else {
              req.decoded = decoded;    
              next();
            }
          });
        } else {
          res.send({ 
              mensaje: 'This endpoint requires a token' 
          });
        }
     }
}

export function jwtAuth(secret:any,validateCredentials:Function){
    return (req:any,res:any,next:any) => {
        console.log(req.body.password)
        if(validateCredentials(req.body.email,req.body.password) ) { // HACK: add some SEC here
            let payload = {
            check:  true
        };
        let token = jwt.sign(payload, secret, {
            expiresIn: 1440
        });
        res.json({
            msg: 'You are you, congrats!',
            token: token
        });
        } else {
            res.json({ mensaje: "email or password are not valid"})
        }
    }
}



