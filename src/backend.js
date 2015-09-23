/*jshint node: true */

var http = require('http');

function proxy (request, reply) {
  var options = {
    method: request.method,
    hostname: process.env.MDBAPI_ADDRESS,
    port: process.env.MDBAPI_PORT,
    path: request.url.path.replace('/backend', '')
  };

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

var backend = {
  register: function (plugin, options, next) {

    /* These are the URL's we're allowing to proxy */

    plugin.route({
      method: 'GET',
      path: '/healthcheck',
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

    plugin.route({
      method: 'GET',
      path: '/interesser',
      handler: proxy
    });

    plugin.route({
      method: ['GET', 'PUT'],
      path: '/users/{user_id}',
      handler: proxy
    });

    plugin.route({
      method: 'POST',
      path: '/doubleopt',
      handler: proxy
    });

    plugin.route({
      method: 'POST',
      path: '/doubleopt/{confirm_key}/confirm',
      handler: proxy
    });

    plugin.route({
      method: 'POST',
      path: '/doubleopt/{double_opt_key}/interesser',
      handler: proxy
    });

    plugin.route({
      method: 'GET',
      path: '/users/{user_id}/nyhedsbreve',
      handler: proxy
    });

    plugin.route({
      method: ['POST', 'DELETE'],
      path: '/users/{user_id}/nyhedsbreve/{nyhedsbrev_id}',
      handler: proxy
    });

    plugin.route({
      method: ['GET', 'POST'],
      path: '/users/{user_id}/interesser',
      handler: proxy
    });

    plugin.route({
      method: ['POST', 'DELETE'],
      path: '/users/{user_id}/interesser/{interesse_id}',
      handler: proxy
    });

    plugin.route({
      method: 'POST',
      path: '/users/{user_id}/nyhedsbreve/delete',
      handler: proxy
    });

    plugin.route({
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
