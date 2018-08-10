const http = require('http')
const router = require('./router/router.js')
const routes = require('./router/routes.js')

var port = 6003;
var host = 'localhost';


var server = http.createServer(router.handle)

server.listen(port, host, () => {
  console.log("im listening " + host + port)
})
