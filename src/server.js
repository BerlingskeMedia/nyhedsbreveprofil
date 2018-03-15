/*jshint node: true */
'use strict';

const Hapi = require('hapi');
const backend = require('./backend');
const nyhedsbreve = require('./nyhedsbreve');
const smartlinks = require('./smartlinks');
const opdatering = require('./opdatering');
const mineData = require('./mine-data');
const inert = require('inert');
const good = require('good');
const goodConsole = require('good-console');

var server = new Hapi.Server({
  connections: {
    router: {
      stripTrailingSlash: false
    }
  }
});

var goodOpts = {
  reporters: {
    cliReporter: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ log: '*', response: '*' }]
    }, {
      module: 'good-console'
    }, 'stdout']
  }
};

server.connection({ port: process.env.PORT ? process.env.PORT : 8000 });

server.route({
  method: 'GET',
  path: '/healthcheck',
  handler: function (request, reply) {
    return reply('OK');
  }
});

server.register({register: good, options: goodOpts}, cb);
server.register(inert, cb);
server.register(nyhedsbreve, cb);
server.register(opdatering, { routes: { prefix: '/opdatering' } }, cb);
server.register(mineData, { routes: { prefix: '/mine-data' } }, cb);
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
