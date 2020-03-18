/*jshint node: true */
'use strict';

// To remain compatible with the puppet-scripts
if(process.env.NYHEDSBREVEPROFIL_APP_ID && !process.env.BPC_APP_ID) {
  process.env.BPC_APP_ID = process.env.NYHEDSBREVEPROFIL_APP_ID;
  process.env.BPC_APP_KEY = process.env.NYHEDSBREVEPROFIL_APP_SECRET;
}

const Hapi = require('@hapi/hapi');
const inert = require('@hapi/inert');
const HapiBpc = require('hapi-bpc');
const backend = require('./backend');
const nyhedsbreve = require('./nyhedsbreve');
const smartlinks = require('./smartlinks');
const opdatering = require('./opdatering');
const mineData = require('./mine-data');

const init = async () => {

  const server = Hapi.server({ port: process.env.PORT || 8000 });

  server.route({
    method: 'GET',
    path: '/healthcheck',
    handler: function (request, h) {
      return 'OK';
    }
  });

  await server.register(inert);
  
  await server.register(HapiBpc);
  await server.bpc.connect();

  await server.register(nyhedsbreve);
  await server.register(opdatering, {routes: {prefix: '/opdatering'}});
  await server.register(backend, {routes: {prefix: '/backend'}});
  await server.register(smartlinks, {routes: {prefix: '/smartlinks'}});
  await server.register(mineData, {routes: {prefix: '/mine-data'}});

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
