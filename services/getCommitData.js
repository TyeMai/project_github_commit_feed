const fs = require('fs')
var commits = require('../data/commits')
//commits = JSON.stringify(commits, null, 2)
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

//this is the function to get and display info if the form is used.
loadPages.form = (req, res) => {
  let formInfo = {}
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
      formInfo.userNameMatch = path.href.match(/username=([^&]+)/)[1]
      formInfo.repoMatch = path.href.match(/repo=([a-zA-Z_-]+)/)[1]
      if (formInfo.userNameMatch === null) {
        return
      }
      resolve(formInfo)
    }).then((formInfo) => {
      let gitResults = github_request.getCommits(formInfo)
      return gitResults
    }).then((gitResults) => {
      var scrubCommits = []
      var someFuckingName = {}
      for (var commit of gitResults.data) {
        scrubCommits.push(someFuckingName = {
          author: commit.commit.author,
          message: commit.commit.message,
          sha: commit.sha,
          url: commit.commit.url
        })
        //scrubCommits = JSON.stringify(scrubCommits, null, 2)
        //fs.appendFileSync('./data/commits.json', JSON.stringify(someFuckingName, null,2))
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
      fs.writeFileSync("./data/commits.json",gitResults, 'utf8')
      return gitResults
    }).then((gitResults) => {
      //var htmlOut = data.replace("{{ commitFeed }}", JSON.stringify(commits, null, 2))
      var htmlOut = data.replace("{{ commitFeed }}", gitResults)
      console.log(gitResults)
      res.end(htmlOut)
      //res.end('200 ok')
    }).then((htmlOut) => {
      res.end(htmlOut)
    })
  })
}


module.exports = loadPages
