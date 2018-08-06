const fs = require('fs')
var commits = require('../data/commits')
commits = JSON.stringify(commits, null, 2)
const url = require('url')
const secretToken = require('../secretToken')
const github_request = require('../octokit_requester.js')


const loadPages = {}

loadPages.index = (req, res) => {
  //var path = url.parse(req.url) //.pathname wierd.. pathname = commit
  fs.readFile('./public/index.html', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("404 that bitch no found")
    } else {
      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      //var toReplace = /commitFeed/
      //data = data.replace(toReplace, commits)
      res.end(data)
    }
  })
}

loadPages.form = (req, res) => {
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
    var p = new Promise((resolve) => {
      console.log(path.href)
      info.userNameMatch = path.href.match(/username=([^&]+)/)[1]
      info.repoMatch = path.href.match(/repo=([a-zA-Z_]+)/)[1]

      //info.userNameMatch = path.match(/username=([^&]+)/)[1]
      //info.repoMatch = path.match(/repo=([a-zA-Z_]+)/)[1]
      if (info.userNameMatch === null) {
        return
      }
      //console.log(info)
      resolve(info)
    }).then((info) => {
      //console.log(info)
      var results = github_request.getCommits(info)
      //console.log(results)
      return results
    }).then((results) => {
      //console.log("these are the results" + results)
      //c;lkjonsole.log(results)
      var htmlOut = data.replace("{{ commitFeed }}", JSON.stringify(results, null, 2))

      res.end(htmlOut)
    })
  })
}

module.exports = loadPages
