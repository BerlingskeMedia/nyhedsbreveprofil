/*jshint node: true */

var http = require('http');

// var api_url = 'http://' + process.env.MDBAPI_ADDRESS + ':' + process.env.MDBAPI_PORT;

// function getProxy (request, reply) {
//   console.log(request.url, request.method)
//   http.get({
//     method: 'get',
//     hostname: process.env.MDBAPI_ADDRESS,
//     port: process.env.MDBAPI_PORT,
//     path: request.url.path.replace('/backend', '')
//   }, reply).on('error', function(e) {
//     console.log("Got error: " + e.message);
//     reply().code(500);
//   });
// }


// function requestProxy (request, reply) {
//   var req = http.request({
//     method: request.method,
//     hostname: process.env.MDBAPI_ADDRESS,
//     port: process.env.MDBAPI_PORT,
//     path: request.url.path.replace('/backend', '')
//   }); 
// }

function proxy (request, reply) {
  var options = {
    method: request.method,
    hostname: process.env.MDBAPI_ADDRESS,
    port: process.env.MDBAPI_PORT,
    path: request.url.path.replace('/backend', '')
  };

  var req = http.request(options, function( res ) {
    var data = '';
    res.setEncoding('utf8');

    res.on('data', function ( chunk ) {
      data += chunk;
    });

    res.on('end', function() {
      reply(null, data);
    });
  }).on('error', function(e) {
    console.log('Got error while requesting (' + url + '): ' + e.message);
    reply(e, null);
  });

  if (request.payload) {
    req.write(JSON.stringify(request.payload));
  }

  req.end();
}

var backend = {
  register: function (plugin, options, next) {

    plugin.route({
      method: 'GET',
      path: '/healthcheck',
      handler: proxy
    });

    plugin.route({
      method: 'POST',
      path: '/users',
      handler: proxy
    });

    plugin.route({
      method: ['GET', 'PUT'],
      path: '/users/{id}',
      handler: proxy
    });

    plugin.route({
      method: 'POST',
      path: '/users/{id}/nyhedsbreve/{nyhedsbrev_id}',
      handler: proxy
    });

    plugin.route({
      method: 'GET',
      path: '/publishers',
      handler: proxy
    });

    plugin.route({
      method: 'GET',
      path: '/nyhedsbreve',
      handler: proxy
    });

    // POST users
    // GET users{id}
    // POST users/{id}/nyhedsbreve/{id}
    // DELETE users/{id}/nyhedsbreve/{id}
    // POST mails/profile-page-link
    // GET publishers?orderBy=publisher_navn&orderDirection=asc
    // GET nyhedsbreve?orderBy=sort_id&orderDirection=asc
    // GET nyhedsbreve?permission=1&orderBy=sort_id&orderDirection=as

    next();
  }
};

backend.register.attributes = {
  name: 'backend',
  version: '1.0.0'
};

module.exports = backend;
