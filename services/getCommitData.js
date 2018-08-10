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
      //console.log(path.href)
      info.userNameMatch = path.href.match(/username=([^&]+)/)[1]
      info.repoMatch = path.href.match(/repo=([a-zA-Z_-]+)/)[1]
      //console.log(info.userNameMatch)
      //console.log(info.repoMatch)
      //info.userNameMatch = path.match(/username=([^&]+)/)[1]
      //info.repoMatch = path.match(/repo=([a-zA-Z_]+)/)[1]
      if (info.userNameMatch === null) {
        return
      }
      resolve(info)
    }).then((info) => {
      var results = github_request.getCommits(info)
      return results
    }).then((results) => {
      var scrubCommits = []
      var someFuckingName = {}
      for (var commit of results.data) {
        scrubCommits.push(someFuckingName = {
          author: commit.commit.author,
          message: commit.commit.message,
          sha: commit.sha,
          url: commit.commit.url
        })
      }
      //scrubCommits = JSON.stringify(scrubCommits, null, 2)
      //fs.writeFile('./data/commits.json', scrubCommits, 'utf8', (err)=>{
      //  if(err) throw err;
      //})
      //  console.log(commits)
        //var htmlOut = data.replace("{{ commitFeed }}", JSON.stringify(scrubCommits, null, 2))
        var htmlOut = data.replace("{{ commitFeed }}", commits)

        res.end(htmlOut)



    })
  })
}

module.exports = loadPages
