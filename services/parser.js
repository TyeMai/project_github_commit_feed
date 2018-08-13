
const parser = {};

parser._extractPostData = (req) => {
 return new Promise( function(resolve){
   var body = '';
   req.on('data', (data) => {
     body += data;
   });
   req.on('end', () => {
     req.body = body;
     var stringify = JSON.parse(req.body)
     resolve(stringify)
   });
})

};

module.exports = parser
