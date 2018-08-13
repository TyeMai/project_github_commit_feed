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
Router.methods.forEach(method => {

  Router.routes[method] = Router.routes[method] || {}

  Router[method] = (path, callback) => {
    //  console.log(Router +  " before")
    //console.log(Router)
    Router.routes[method][path] = callback;
    //  console.log(Router + " after")
  }
})


/*
for (var method of Router.methods) {
  Router.routes[method] = Router.routes[method] || {}

  Router[method] = (path, callback) => {
    //  console.log(Router +  " before")
    console.log(Router)
    Router.routes[method][path] = callback;
    //  console.log(Router + " after")
  }
}
*/

Router.handle = (req, res) => {
  let method = req.method.toLowerCase();
  let path = url.parse(req.url).pathname;


  // returns the matches object from the parser. that object will validate that the route is correct and pass back a params object if route was parameterized.

    if (Router.routes[method][path]) {
      Router.routes[method][path](req, res);

    } else {
      res.statusCode = 404
      res.end("404 Not Found");
    }
  };

  /*
  if (Router.routes[method][path]) {

    // Use a promise to always resolve
    // but allow async post data extraction
    var p = new Promise((resolve) => {
      if (method !== 'get') {
        parser._extractPostData(req, resolve);
      } else {
        resolve();
      }
    });
    p.then(function() {
      Router.routes[method][path](req, res);
    });
  } else {
    res.statusCode = 404
    res.end("404 Not Found");
  }
  */


module.exports = Router
