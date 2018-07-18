const http = require('http')
const fs = require('fs')

var port = 3000;
var host = 'localhost';


var server = http.createServer((req,res) => {
  fs.readFile('./public/index.html', 'utf8', (err,data) =>{
    if(err){
      res.writeHead(404);
      res.end("404 that bitch no found")
    } else {
      res.writeHead(200, {"Content-Type": "text/html"
    });
      res.end(data)
    }
  })
});

server.listen(port, host, () => {
  console.log("im listing" + host + port)
})
