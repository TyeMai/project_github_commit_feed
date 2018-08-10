var Router = {}
var url = require('url')



Router.methods = [
  "get"
]

Router.routes = {}

// I realize theres just one method soo theres no need for this loop, but just incase i wanted to add post.
for (var method of Router.methods) {
  Router.routes[method] = Router.routes[method] || {}

  Router[method] = (path, callback) => {
//    console.log(router +  " before")
    Router.routes[method][path] = callback;
  //  console.log(router + " after")
  }
}


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


module.exports = Router
