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
      console.log(path.href)
      info.userNameMatch = path.href.match(/username=([^&]+)/)[1]
      info.repoMatch = path.href.match(/repo=([a-zA-Z_-]+)/)[1]
      //console.log(info.userNameMatch)
      //console.log(info.repoMatch)
      //info.userNameMatch = path.match(/username=([^&]+)/)[1]
      //info.repoMatch = path.match(/repo=([a-zA-Z_]+)/)[1]
      if (info.userNameMatch === null) {
        return
      }
      //console.log(info)
      resolve(info)
    }).then((info) => {
      var results = github_request.getCommits(info)
      //console.log(results)
      return results
    }).then((results) => {
      //console.log("these are the results" + results)
      //c;lkjonsole.log(results)
      /*
      console.log('im the results')
      console.log(results.data[0].commit.author)
      console.log(results.data[0].commit.message)
      console.log(results.data[0].commit.url)
      console.log(results.data[0].sha)
*/
      var commits = []
      var someFuckingName = {}
      for(var commit of results.data){

        commits.push(someFuckingName = {
          author: commit.commit.author ,
          message: commit.commit.message ,
          sha:   commit.sha ,
          url: commit.commit.url
        })

      //  console.log(commit.sha)
      //  console.log(commit.commit.author)
      //  console.log(commit.commit.message)
      //  console.log(commit.commit.url)
      }

      var htmlOut = data.replace("{{ commitFeed }}", JSON.stringify(commits, null, 2))//JSON.stringify(results, null, 2))
      res.end(htmlOut)
    })
  })
}

module.exports = loadPages
