const http = require('http')
const fs = require('fs')
const url = require('url')
var commits = require('./data/commits')
//const index = require('./public/index.html')

var port = 3000;
var host = 'localhost';

commits = JSON.stringify(commits, null, 2)


var server = http.createServer((req,res) => {
  var path = url.parse(req.url)//.pathname wierd.. pathname = commit

  fs.readFile('./public/index.html', 'utf8', (err,data) =>{
    if(err){
      res.writeHead(404);
      res.end("404 that bitch no found")
    } else {
      res.writeHead(200, {"Content-Type": "text/html"
    });
      var toReplace = /commitFeed/
      data = data.replace(toReplace, commits)
      res.end(data)
      var userName = path.href.match(/username=([^&]+)/)
      var repo = path.href.match(/repo=([a-zA-Z]+)/)
      //console.log(userName[1])
      //console.log(repo[1])
    }
  })
});

server.listen(port, host, () => {
  console.log("im listing" + host + port)
})
