/*jshint node: true */
'use strict';

const logger = require('./logger');

// To remain compatible with the puppet-scripts
if(process.env.NYHEDSBREVEPROFIL_APP_ID && !process.env.BPC_APP_ID) {
  process.env.BPC_APP_ID = process.env.NYHEDSBREVEPROFIL_APP_ID;
  process.env.BPC_APP_KEY = process.env.NYHEDSBREVEPROFIL_APP_SECRET;
}

const Hapi = require('@hapi/hapi');
const inert = require('@hapi/inert');
const HapiBpc = require('hapi-bpc');
const api = require('./api');
const backend = require('./backend');
const nyhedsbreve = require('./nyhedsbreve');
const smartlinks = require('./smartlinks');
const opdatering = require('./opdatering');
const mineData = require('./mine-data');

const maintenancePage = process.env.MAINTENANCE_PAGE === 'true' || false;
const cookieAuthString = process.env.COOKIE_AUTH_STRING;
const goThoughMaintenancePageCookieName = process.env.GO_THOUGH_MAINTENANCE_PAGE_COOKIE_NAME || 'go_thought_maintenance_page';
const goThoughMaintenancePageString = process.env.GO_THOUGH_MAINTENANCE_PAGE_STRING || 'allowed';

const existsPathInArray = function(elementsArray, url) {
  let result = false;
  for (let i=0; i < elementsArray.length; ++i) {
    if (url.match(elementsArray[i])) {
      result = true;
      break;
    }
  }
  return result;
}

const init = async () => {

  const server = Hapi.server({ port: process.env.PORT || 8000 });

  await server.ext('onPreResponse', function (request, reply) {
    const {response} = request;
    const maintenanceIgnoredPaths = ['/setauthcookie', '/maintenance', '/healthcheck', '/api', '/smartlinks', '/backend'];

    if (maintenancePage &&
        request.state[goThoughMaintenancePageCookieName] !== goThoughMaintenancePageString &&
        !existsPathInArray(maintenanceIgnoredPaths, request.route.path)
    ) {
      return reply.redirect('/maintenance').temporary();
    }

    if (response.isBoom) {
      response.output.headers['X-Frame-Options'] = 'DENY';
    } else {
      response.header('X-Frame-Options', 'DENY');
    }

    return reply.continue;
  });

  server.route({
    method: 'GET',
    path: '/healthcheck',
    handler: function (request, h) {
      return 'OK';
    }
  });

  server.route({
    method: 'GET',
    path: '/setauthcookie',
    handler: function (request, h) {
      const authString = request.query.authstring;

      if (typeof cookieAuthString === 'undefined' || cookieAuthString.length === 0) {
        return 'Cookie auth string not configured.';
      }

      if (authString === cookieAuthString) {
        h.state(goThoughMaintenancePageCookieName,
            goThoughMaintenancePageString,
            {
              ttl: 7* 24 * 60 * 60 * 1000,
              isSecure: false,
            }
        );
        return 'COOKIE SET.';
      }
      return 'COOKIE NOT SET.';
    }
  });

  await server.register(inert);
  await server.register(HapiBpc);
  await server.bpc.connect(null, process.env.BPC_URL);

  await server.register(nyhedsbreve);
  await server.register(api, {routes: {prefix: '/api'}});
  await server.register(backend, {routes: {prefix: '/backend'}});
  await server.register(opdatering, {routes: {prefix: '/opdatering'}});
  await server.register(smartlinks, {routes: {prefix: '/smartlinks'}});
  await server.register(mineData, {routes: {prefix: '/mine-data'}});

  await server.start();
  logger.info('Server running on %s', server.info.uri);
};

init();
