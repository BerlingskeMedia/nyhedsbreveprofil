/*jshint node: true */
'use strict';

var Hapi = require('hapi'),
    backend = require('./backend'),
    profil = require('./profil'),
    smartlinks = require('./smartlinks'),
    opdatering = require('./opdatering'),
    inert = require('inert');

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

server.register(inert, cb);
server.register(profil, cb);
server.register(opdatering, { routes: { prefix: '/opdatering' } }, cb);
server.register(backend, { routes: { prefix: '/backend' } }, cb);
server.register(smartlinks, { routes: { prefix: '/smartlinks' } }, cb);

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
