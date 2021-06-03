const http = require('http')

export function get(options:any){
    return new Promise( (resolve:any, reject:any) =>
        {
            try {
                const req = http.request(options, (res:any) => {
                    console.log(`statusCode: ${res.statusCode}`)
                    let data = '';
                    res.on('data', (chunk:any) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        resolve(data)
                    });
                    })
                
                    req.on('error', (error:any) => {
                    console.error(error)
                    })
                
                    req.end()
            }
            catch (error){
                reject(error)
            }
        }
    )
    
}

export function post(options:any,data:any){
    return new Promise( (resolve:any, reject:any) =>
        {
            try {
                const req = http.request(options, (res:any) => {
                    console.log(`statusCode: ${res.statusCode}`)
                    let data = '';
                    res.on('data', (chunk:any) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        resolve(data)
                    });
                    })
                
                    req.on('error', (error:any) => {
                    console.error(error)
                    })
                    req.write(data)
                    req.end()
            }
            catch (error){
                reject(error)
            }
        }
    )
    
}