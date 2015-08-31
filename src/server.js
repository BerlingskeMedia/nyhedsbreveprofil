/*jshint node: true */
'use strict';

var Hapi = require('hapi'),
    backend = require('./backend');

var client = {
  register: function (plugin, options, next) {

    plugin.route({
      method: 'get',
      path: '/bower_components/{param*}',
      handler: {
        directory: {
          path: 'bower_components',
          index: true
        }
      }
    });

    plugin.route({
      method: 'get',
      path: '/assets/{param*}',
      handler: {
        directory: {
          path: 'assets'
        }
      }
    });

    plugin.route({
      method: 'get',
      path: '/{param*}',
      handler: {
        file: 'client/index.html'
      }
    });

    next();
  }
};

client.register.attributes = {
  name: 'client',
  version: '1.0.0'
};

var server = new Hapi.Server({
  connections: {
    router: {
      stripTrailingSlash: false
    }
  }
});

server.connection({ port: process.env.PORT ? process.env.PORT : 8000 });

server.route({
  method: 'GET',
  path: '/healthcheck',
  handler: function (request, reply) {
    return reply('OK');
  }
});

server.register(client, cb);
server.register(backend, { routes: { prefix: '/backend' } }, cb);

if (!module.parent) {
  server.start(function() {
    console.log('Server started on ' + server.info.uri + '.');
  });
}


function cb (err) {
  if (err) {
    console.log('Error when loading plugin', err);
    server.stop();
  }
}


module.exports = server;
