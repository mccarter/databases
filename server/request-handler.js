var urlLib = require('url');
var pathLib = require('path');
var querystringLib = require('querystring');
var fs = require('fs');
var mysql = require('mysql');

exports.handleRequest = function(request, response) {

  var url = urlLib.parse(request.url, true);

  if (url.pathname === '/classes/messages') {
    if (request.method === 'GET') {

      //TODO get messages from database and send back in response

      headers['Content-Type'] = "application/json";
      sendResponse(response,200,messagePayload);

    } else if (request.method === 'POST') {

      var statusCode = 201;
      collectData(request, function(data) {

      });
      //TODO use mysql library to add message to the messages table

    } else if (request.method === 'OPTIONS') {
      sendResponse(response,200);
    }
  } else if (url.pathname === "/classes/users") {
    //TODO use mysql library to attempt to add a user to the user table
    if (request.method === 'POST') {
      collectData(request, function(username){
        var queryString = 'insert into users (username) values (' + data + ')';
        queryDatabase(queryString, function(err, rows, fields) {
          if (err) {
            sendResponse(response, 400,"error inserting into db");
          } else {

            sendResponse(response,201,"");
          }
        });
      });
    } else {
      //405 method not allowed
      sendResponse(response, 405)
    }
  } else {
    if(url.pathname === "/") {
      url.pathname = "/index.html";
    }
    fs.readFile("../client/client" + url.pathname, function(err, data) {
      if (err) {
        sendResponse(response,404,"Sorry, not found!");
      } else {
        var filetype = pathLib.extname(url.pathname);
        headers['Content-Type'] = "text/" + filetype.substring(1);
        sendResponse(response,200,data);
      }
    });
  }
};

var defaultCorsHeaders = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE,  ",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var queryDatabase = function(queryStr, callback) {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });
  connection.connect();
  connection.query(queryStr, callback); //callback takes: err, rows, fields
  connection.end();
};

var collectData = function(req,callback) {
  var data = "";
  request.on("data", function(chunk) {
      data += chunk;
  });

  request.on('end', function () {
    callback(data);
  });

};

var sendResponse = function (res, statusCode, data, customHeaders) {
  if(customHeaders) {
    var responseHeaders = _.extend(_.clone(headers),customHeaders);
  } else {
    var responseHeaders = headers;
  }

  response.setHeader()
  res.writeHead(statusCode,responseHeaders);
  res.end(data);
}


