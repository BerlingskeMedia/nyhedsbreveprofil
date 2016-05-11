/*jshint node: true */
'use strict';

var http = require('http');

function proxy (request, reply) {

  if (reply === undefined) {
    reply = function(){};
  }

  var options = {
    method: request.method,
    hostname: process.env.MDBAPI_ADDRESS,
    port: process.env.MDBAPI_PORT,
    path: request.url.path.replace('/backend', ''),
    headers: {}
  };

  if (request.headers.origin) {
    options.headers.origin = request.headers.origin;
  }

  if (request.headers.referer) {
    options.headers.referer = request.headers.referer;
  }

  if (request.headers['user-agent']) {
    options.headers['user-agent'] = request.headers['user-agent'];
  }

  var req = http.request(options, function( res ) {
    reply(null, res);

  }).on('error', function(e) {
    console.log('Got error while requesting (' + request.url + '): ' + e.message);
    reply(e, null);
  });

  if (request.payload) {
    req.write(JSON.stringify(request.payload));
  }

  req.end();
}

function updateUser (request, reply) {
  proxy(request, function (error, response) {
    if (error) {
      return reply(error);
    } else if (response.statusCode !== 200) {
      return reply(response);
    }

    proxy({
      method: 'POST',
      url: {
        path: '/mails/send'
      },
      payload: {
        to: request.payload.email,
        template: '26a0a5b3-46ff-49a4-9201-afd4c6050aeb',
        category: 'update-user',
        substitutions: request.payload !== null ? request.payload : {}
      },
      headers: {}
    }, function (error2, response2) {
      if (error2) {
        return reply(error2);
      }

      // We want to return the first response from POST /users/{id} - not the response from email
      reply(response);
    });
  });
}


function createDoubleopt (request, reply) {
  proxy(request, function (error, response) {
    if (error) {
      return reply(error);
    }

    proxy({
      method: 'POST',
      url: {
        path: '/mails/send'
      },
      payload: {
        to: request.payload.email,
        template: 'bebc5061-2da1-4995-85ab-a0e9f3f66241',
        category: 'doubleopt-confirm-link',
        substitutions: request.payload !== null ? request.payload : {}
      },
      headers: {}
    });

    reply(response);
  });
}


var backend = {
  proxy: proxy,
  register: function (server, options, next) {

    /* These are the URL's we're allowing to proxy */

    server.route({
      method: 'GET',
      path: '/healthcheck',
      handler: proxy
    });

    server.route({
      method: 'GET',
      path: '/publishers',
      handler: proxy
    });

    server.route({
      method: 'GET',
      path: '/nyhedsbreve',
      handler: proxy
    });

    server.route({
      method: 'GET',
      path: '/interesser',
      handler: proxy
    });

    server.route({
      method: 'GET',
      path: '/interesser/toplevels',
      handler: proxy
    });

    server.route({
      method: 'GET',
      path: '/users/{user_id}',
      handler: proxy
    });

    server.route({
      method: 'POST',
      path: '/users/{user_id}',
      handler: updateUser
    });

    server.route({
      method: 'POST',
      path: '/doubleopt',
      handler: createDoubleopt
    });

    server.route({
      method: 'POST',
      path: '/doubleopt/{confirm_key}/confirm',
      handler: proxy
    });

    server.route({
      method: 'POST',
      path: '/doubleopt/{double_opt_key}/interesser',
      handler: proxy
    });

    server.route({
      method: 'GET',
      path: '/users/{user_id}/nyhedsbreve',
      handler: proxy
    });

    server.route({
      method: ['POST', 'DELETE'],
      path: '/users/{user_id}/nyhedsbreve/{nyhedsbrev_id}',
      handler: proxy
    });

    server.route({
      method: ['GET', 'POST'],
      path: '/users/{user_id}/interesser',
      handler: proxy
    });

    server.route({
      method: ['POST', 'DELETE'],
      path: '/users/{user_id}/interesser/{interesse_id}',
      handler: proxy
    });

    server.route({
      method: 'POST',
      path: '/users/{user_id}/nyhedsbreve/delete',
      handler: proxy
    });

    server.route({
      method: 'POST',
      path: '/mails/profile-page-link',
      handler: proxy
    });

    next();
  }
};

backend.register.attributes = {
  name: 'backend',
  version: '1.0.0'
};

module.exports = backend;
