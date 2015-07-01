/*jshint node: true */
'use strict';

var Hapi = require('hapi');

var client = {
  register: function (plugin, options, next) {

    plugin.route({
      method: 'get',
      path: '/{param*}',
      handler: {
        directory: {
          path: 'client',
          index: true
        }
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

server.connection({ port: 8000 });

server.register(client, cb);

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
