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
  console.log(tokenRes)
}
main()