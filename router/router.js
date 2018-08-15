var Router = {}
var url = require('url')
const parser = ('../services/parser.js')



Router.methods = [
  "get",
  "post",
  "patch"
]

Router.routes = {}


//forOf loops have strange behavior in this case.
//Router.methods.forEach(method => {
for (let method of Router.methods){
  Router.routes[method] = Router.routes[method] || {}
  Router[method] = (path, callback) => {
    Router.routes[method][path] = callback;
  }

}//)


Router.handle = (req, res) => {
  let method = req.method.toLowerCase();
  let path = url.parse(req.url).pathname;

    if (Router.routes[method][path]) {
      Router.routes[method][path](req, res);
    } else {
      res.statusCode = 404
      res.end("404 Not Found");
    }
  };



module.exports = Router
