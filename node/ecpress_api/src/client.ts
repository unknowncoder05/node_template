const http = require('http')
let options:any = {
  hostname: 'localhost',
  port: 3000,
  path: '/movie/111',
  method: 'GET',
}

const getter = http.request(options, (res:any) => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', (d:any) => {
    console.log("get:",d.toString())
  })
  res.on('error', (error:any) => {
      console.error("get err:",error)
  })
})

const data = JSON.stringify({
  id:"112",
  title:"the walking kong",
  year: 2000
})
options = {
  hostname: 'localhost',
  port: 3000,
  path: '/movie',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}
const req = http.request(options, (res:any) => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', (d:any) => {
        process.stdout.write(d)
    })
    res.on('error', (error:any) => {
        console.error(error)
    })
},data)
  

req.write(data)
req.end()
getter.end()