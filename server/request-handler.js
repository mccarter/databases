/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var urlLib = require('url');
var pathLib = require('path');
var querystringLib = require('querystring');
var fs = require('fs');

var messages = [];

exports.handleRequest = function(request, response) {
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

  // console.log("Serving request type " + request.method + " for url " + request.url);

  var url = urlLib.parse(request.url, true);
  var headers = defaultCorsHeaders;

  if (url.pathname === '/classes/messages') {

    if (request.method === 'GET') {


      fs.readFile('.' + url.pathname, {encoding: 'utf8'}, function(err, data) {
          if (err) {
            console.log(err);
           //TODO: check if msgs file doesn't exist, if so create empty messages file
          } else {
            var messages = [];
            var objStrings = data.split('\n');
            objStrings.forEach(function(string) {
              if (string) {
                messages.push(JSON.parse(string));
              }
            });


            var statusCode = 200;
            headers['Content-Type'] = "application/json";
            response.writeHead(statusCode, headers);
            response.end(JSON.stringify({results: messages}));
          }
      });

    } else if (request.method === 'POST') {

      var statusCode = 201;
      headers['Content-Type'] = "text/plain";
      response.writeHead(statusCode, headers);

      var data = "";

      request.on("data", function(chunk) {
          data += chunk;
      });

      request.on("end", function() {
          fs.appendFile('classes/messages', data + '\n', function (err) {
            response.end();
          })
      });

    } else if (request.method === 'OPTIONS') {

      var statusCode = 200;
      //headers['Content-Type'] = "text/plain";
      headers['Allow'] = ["GET", "POST", "OPTIONS"];
      response.writeHead(statusCode, headers);
      response.end();
    } else {
      //method not allowed?
    }
  } else {
    fs.readFile("../client/client" + url.pathname, function(err, data) {
      if (err) {
        var statusCode = 404;
        //headers['Content-Type'] = "text/plain";
        response.writeHead(statusCode, headers);
        //response.end(url.pathname);
        console.dir(err);
        // response.end("client/client" + url.pathname);
        //response.end("Go to hell");
      } else {
        var statusCode = 200;
        var filetype = pathLib.extname(url.pathname);
        headers['Content-Type'] = "text/" + filetype.substring(1);
        response.writeHead(statusCode, headers);
        response.end(data);
      }
    });
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
  "access-control-allow-methods": "GET, POST, PUT, DELETE,  ",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};


