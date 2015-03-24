/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var storage = {results:[]};

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


//If statement based on the method type (GET or POST)

  //GET - give last 100 arrays in collection
  if(request.method === "GET"){

    var statusCode = 200;

    var headers = defaultCorsHeaders;

    headers['Content-Type'] = "text/plain";
    response.writeHead(statusCode, headers);
    console.log( "get this " + JSON.stringify(storage) );
    response.write(JSON.stringify(storage));

    response.end();
    return

  }


  //POST - add text from message to collection ID++
  //storage.push(response)

  if(request.method === "POST"){
    var buffer = '';
// {"username":"dsa","text":"sfad","roomname":"lobby"}
    request.on('data', function(chunk) {
      buffer += chunk.toString();

      //console.log(storage.results.length)
      //console.log(storage.results);
    });

    var statusCode = 201;

    var headers = defaultCorsHeaders;

    headers['Content-Type'] = "text/plain";

    request.on('end', function() {
      console.log(buffer);
      console.log(storage['results']);
      storage["results"].push(JSON.parse(buffer));
      console.log(storage['results']);
      response.writeHead(statusCode, headers);
      response.end();
    });

    return

  }
  var statusCode = 200;

  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";
  response.writeHead(statusCode, headers);
  response.end("Hello, World!");

// sample post info  url: app.server,
//         type: 'POST',
//         data: JSON.stringify(data),
//         contentType: 'application/json',



  //OPTIONS ? ignore?

//sample response/header info
// [ 'ConTent-Length', '123456',
//   'content-LENGTH', '123',
//   'content-type', 'text/plain',
//   'CONNECTION', 'keep-alive',
//   'Host', 'mysite.com',
//   'accepT', '*/*' ]



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
