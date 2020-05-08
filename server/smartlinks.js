/*jshint node: true */
'use strict';

const backend = require('./backend');

module.exports = {
  name: 'smartlinks',
  version: '1.0.0',

  register: async function (server, options) {

    server.route({
      method: 'GET',
      path: '/',
      config: {
        cors: true,
      },
      handler: backend.proxy
    });

    server.route({
      method: 'POST',
      path: '/',
      config: {
        cors: true,
      },
      handler: backend.proxy
    });

    server.route({
      method: 'OPTIONS',
      path: '/',
      config: {
        cors: true,
      },
      handler: backend.proxy
    });
  }
}
