const octokit = require('@octokit/rest')()
const secretToken = require('./secretToken')

let github_request = {};

github_request.getCommits = (info) => {
  return new Promise((resolve) => {
    octokit.authenticate({
      type: "token",
      token: secretToken.code
    })

    var options = {
      //owner: 'TyeMai',
      //repo: "assignment_royalty_free_music_player"
      owner: info.userNameMatch,
      repo: info.repoMatch
    };

    octokit.repos.getCommits(options).then(result => {

      //result.forEach(result => {
      resolve(result)
      //console.log(result)
      //})
      //github_request.result = result
      //return result
    })
  })
}

//github_request.getCommits()

module.exports = github_request
