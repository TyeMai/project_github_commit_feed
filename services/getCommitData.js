const fs = require('fs')
var commits = require('../data/commits')
const url = require('url')
const secretToken = require('../secretToken')
const github_request = require('../octokit_requester.js')
const parser = require('./parser')
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
    let userNameMatch = path.href.match(/username=([^&]+)/)[1]
    let repoMatch = path.href.match(/repo=([a-zA-Z_-]+)/)[1]
    if (userNameMatch === null || repoMatch === null) {
      return
    }
    let formInfo = {}
    formInfo.userNameMatch = path.href.match(/username=([^&]+)/)[1]
    formInfo.repoMatch = path.href.match(/repo=([a-zA-Z_-]+)/)[1]
    github_request.getCommits(formInfo)
      .then((gitResults) => {
        var scrubCommits = []

        let scrubCommit;
        for (var commit of gitResults.data) {
          scrubCommit = {
            author: commit.commit.author,
            message: commit.commit.message,
            sha: commit.sha,
            url: commit.commit.url
          }
          scrubCommits.push(scrubCommit)
        }
        scrubCommits = JSON.stringify(scrubCommits, null, 2)
        //var htmlOut = data.replace("{{ commitFeed }}", JSON.stringify(scrubCommits, null, 2))
        var htmlOut = data.replace("{{ commitFeed }}", scrubCommits)
        res.end(htmlOut)
      })
  })
}


loadPages.webHooks = (req, res) => {
  let userAndRepoInfo = {}
  var path = url.parse(req.url)
  var _headers = {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
  };

  fs.readFile('./public/index.html', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("404 that bitch no found")
      return
    }
    res.writeHead(200, _headers)
    var webhookData = parser._extractPostData(req)
    webhookData.then((payload) => {
      userAndRepoInfo.userNameMatch = payload.pusher.name
      userAndRepoInfo.repoMatch = payload.repository.name
      return userAndRepoInfo
    }).then((userAndRepoInfo) => {
      let gitResults = github_request.getCommits(userAndRepoInfo)
      return gitResults
    }).then((gitResults) => {
      gitResults = JSON.stringify(gitResults, null, 2)
      fs.writeFileSync("./data/commits.json", gitResults, 'utf8')
      return gitResults
    }).then((gitResults) => {
      var htmlOut = data.replace("{{ commitFeed }}", gitResults)
    }).then((htmlOut) => {
      res.end(htmlOut)
    })
  })
}


module.exports = loadPages
