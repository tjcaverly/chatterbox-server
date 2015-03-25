/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var url = require('url');
var storage = {results:[]};
var validPaths = {"classes":true}
var fs = require("fs");
var counter = 0;
fs.readFile('messages.txt', function read(err, data) {
  if (err) {
    throw err;
  }
  storage = JSON.parse(data);
  console.log(storage['results']);
  counter = storage.results[storage.results.length-1]['objectId']+1;
  console.log(counter);
})


exports.requestHandler = function(request, response) {
  // var storage = {results:[{user:"trevor",
  //                     room: "lobby",
  //                     text: "hello neighbors"},
  //                     {user:"yoda",
  //                     room: "dagoba",
  //                     text: "use the force"}]}; //will all the messages will eventually be stored


  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain"

  //GET - give last 100 arrays in collection
  if(request.method === "GET"){
    headers['Content-Type'] = "application/json";
    var parsedUrl = url.parse(request.url);
    var tempPath = parsedUrl.pathname.slice(1).split("/")[0];

    if(tempPath in validPaths) {

      var statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(storage));

    } else {
      var statusCode = 404;
      response.writeHead(statusCode, headers);
      response.end();
    }
  }
  //POST - add text from message to collection ID++
  //storage.push(response)

  if(request.method === "POST"){
    var buffer = '';

    request.on('data', function(chunk) {
      buffer += chunk.toString();
    });

    var statusCode = 201;

    request.on('end', function() {

      var tempBuffer = JSON.parse(buffer);
      tempBuffer["objectId"] = counter;
      console.log(tempBuffer);
      storage["results"].push(tempBuffer);
      fs.writeFile("messages.txt", JSON.stringify(storage));
      counter++;

      response.writeHead(statusCode, headers);
      response.end();
    });
  }

  if(request.method === "OPTIONS"){

    var statusCode = 200;

    response.writeHead(statusCode, headers);
    response.end();


  }

};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
