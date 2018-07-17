const octokit = require('@octokit/rest')()
const secretToken = require('./secretToken')

//var octokit = new Octokit()

octokit.authenticate({
  type: "token",
  token: "a044ff8ab889c1817d0e0642219dfcd6263bb898"//secretToken.token
})

var options = {
  name: 'TyeMai',
  repo: "assignment_royalty_free_music_player"
}


octokit.repos.getCommits({owner: options.name,
  repo: options.repo }).then(result => {
    //result.forEach(result => {
      console.log(result)
    //})
})

//octokit.repos.getCommits({})

//results.forEach(result => {
//  console.log(result)
//})
