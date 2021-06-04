const { get, post } = require('./utils')

async function main(){
  let data:string = JSON.stringify({
    "email":"liam@mail.com",
    "password":"exposedpassword"
  })
  let options:any = {
    hostname: 'localhost',
    port: 3000,
    path: '/auth',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    },
  }
  let tokenRes = await post(options,data)
  let token = JSON.parse(tokenRes).token
  console.log("logged!!")
  options = {
    hostname: 'localhost',
    port: 3000,
    path: '/ptime',
    method: 'GET',
    headers: {
      'access-token':token
    },
  }
  let Res = await post(options,data)
  console.log(Res)
}
main()
