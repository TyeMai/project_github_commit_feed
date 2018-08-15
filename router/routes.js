const router = require('./router.js')

const getCommitData = require('../services/getCommitData.js')

router.get("/", (req, res) => {
  getCommitData.index(req, res)
})




router.get('/commits', (req, res) => {
  getCommitData.form(req, res)

})


router.post('/github/webhooks', (req, res) => {
  getCommitData.webHooks(req, res)
})


//console.log(router.routes)

module.exports = router.routes
