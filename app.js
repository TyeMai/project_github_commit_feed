const fs = require('fs')
const url = require('url')
const http = require('http')
var commits = require('./data/commits')
commits = JSON.stringify(commits, null, 2)
const secretToken = require('./secretToken')
const github_request = require('./octokit_requester.js')

var port = 6002;
var host = 'localhost';


var server = http.createServer((req, res) => {
  let info = {}
  var path = url.parse(req.url)

  fs.readFile('./public/index.html', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("404 that bitch no found")
      return
    }
    res.writeHead(200, {
      "Content-Type": "text/html"
    })

    if (path.pathname !== '/') { //first time the page is displayed htere wont be a uswername...
     var p = new Promise((resolve) => {
        //console.log(path)
        info.userNameMatch = path.href.match(/username=([^&]+)/)[1]
        info.repoMatch = path.href.match(/repo=([a-zA-Z_]+)/)[1]
        if (info.userNameMatch === null) {
          return
        }
        console.log(info)
        resolve(info)
   }).then((info) => {
         console.log(info)
         var results = github_request.getCommits(info)
         //console.log(results)
         return results
       }).then((results) => {
         //console.log("these are the results" + results)
         //console.log(results)
         var htmlOut = data.replace("{{ commitFeed }}", results)
         res.end(htmlOut)
       })

    } //matches line 17 didnt have ) boefre
    else {
      res.end(data)
    }
  })
})
server.listen(port, host, () => {
  console.log("im listening" + host + port)
})
