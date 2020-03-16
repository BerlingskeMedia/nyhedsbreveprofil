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
      handler: backend.proxy
    });

    server.route({
      method: 'POST',
      path: '/',
      handler: backend.proxy
    });

    server.route({
      method: 'OPTIONS',
      path: '/',
      handler: backend.proxy
    });
  }
}
