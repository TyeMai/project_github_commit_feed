var Router = {}
var url = require('url')



Router.methods = [
  "get"//,
  //"post"
]

Router.routes = {}

// I realize theres just one method soo theres no need for this loop, but just incase i wanted to add post.
for(var method of Router.methods ){
  Router.routes[method] = Router.routes[method] || {}

  Router[method] = (path, callback) => {
    Router.routes[method][path] = callback
  }
}

Router.handle = (req, res) => {
  let method = req.method.toLowerCase();
  let path = url.parse(req.url).pathname;
  //var path = url.parse(req.url)
  // returns the matches object from the parser. that object will validate that the route is correct and pass back a params object if route was parameterized.
  // let matches = parser(Router.routes, path, method);
  if (Router.routes[method][path]) {
    Router.routes[method][path](req, res);
  } else {
    res.end("404 Not Found");
  }
};




module.exports = Router
