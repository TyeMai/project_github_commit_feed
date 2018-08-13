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
        //scrubCommits = JSON.stringify(scrubCommits, null, 2)
        //fs.appendFileSync('./data/commits.json', JSON.stringify(someFuckingName, null,2))

      }
      scrubCommits = JSON.stringify(scrubCommits, null, 2)
      //  fs.appendFileSync('./data/commits.json', scrubCommits, 'utf8')//, (err)=>{
      //if(err) throw err;
      //})
      //var htmlOut = data.replace("{{ commitFeed }}", JSON.stringify(scrubCommits, null, 2))


      var htmlOut = data.replace("{{ commitFeed }}", scrubCommits)
      //console.log(commits)
      //console.log()
      res.end(htmlOut)


    })
  })
}


loadPages.webHooks = (req, res) => {
  let info = {}
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

    webhookData.then((payload) =>{

        info.userNameMatch = payload.pusher.name
        info.repoMatch = payload.repository.name

      return info
    }).then((info) => {
      var results = github_request.getCommits(info)
      return results
    }).then((results) => {
      results = JSON.stringify(results, null, 2)
      fs.writeFileSync("./data/commits.json", results , 'utf8')
      return results
    }).then((results) => {

      //var htmlOut = data.replace("{{ commitFeed }}", JSON.stringify(commits, null, 2))
      var htmlOut = data.replace("{{ commitFeed }}", results)
      res.end(htmlOut)
    })
  })
}


module.exports = loadPages
