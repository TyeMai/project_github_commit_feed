const router = require('./router.js')
const getCommitData = require('../services/getCommitData.js')

router.get('/', (req, res) => {
  getCommitData.index(req, res)
});


router.get('/commits', (req, res) => {
  getCommitData.form(req, res)
});




module.exports = router.routes
