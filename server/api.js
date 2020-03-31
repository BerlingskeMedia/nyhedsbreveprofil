/*jshint node: true */
'use strict';

const Http = require('http');
const Url = require('url');
const Boom = require('@hapi/boom');

var route_prefix = '';

var MDBAPI_PROTOCOL;
var MDBAPI_HOSTNAME;
var MDBAPI_PORT;


try {
  var temp = Url.parse(process.env.MDBAPI_ADDRESS);
  
  // Sometimes the ENV var is including the protocol, eg: MDBAPI_ADDRESS=http://mdbapi-test.bemit.dk

  if(['http:', 'https:'].indexOf(temp.protocol) > -1) {
    
    MDBAPI_PROTOCOL = temp.protocol;
    MDBAPI_HOSTNAME = temp.hostname;
    MDBAPI_PORT = temp.port;
    

  // Other times (eg. in puppet) there are two seperate ENV vars, eg: MDBAPI_ADDRESS=mdbapi-test.bemit.dk MDBAPI_PORT=80

  } else if (process.env.MDBAPI_PORT) {
    
    MDBAPI_PROTOCOL = 'http:';
    MDBAPI_HOSTNAME = process.env.MDBAPI_ADDRESS;
    MDBAPI_PORT = process.env.MDBAPI_PORT;
    
  } else {
    
    throw new Error();
    
  }
  
} catch (ex) {
  console.error('Env var MDBAPI_ADDRESS missing or invalid.');
  process.exit(1);
}


console.log('Connecting backend to MDBAPI on hostname', MDBAPI_HOSTNAME, 'and port', MDBAPI_PORT);

async function proxy (request, h) {

  var path = request.raw.req.url;
  if(path.startsWith(route_prefix)){
    path = path.slice(route_prefix.length)
  }

  var options = {
    protocol: MDBAPI_PROTOCOL,
    hostname: MDBAPI_HOSTNAME,
    port: MDBAPI_PORT,
    method: request.method,
    path: path,
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

  return new Promise((resolve, reject) => {

    const req = Http.request(options, function( res ) {

      let data = '';

      res.setEncoding('utf8');
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {

        if(res.statusCode >= 400) {
          const err = new Error(res.statusMessage);
          return reject(Boom.boomify(err, { statusCode: res.statusCode }));
        }

        try {
          resolve(JSON.parse(data));
        } catch(ex) {
          console.log(ex)
          reject(ex);
        }
      });
  
    })
    
    req.on('error', function(e) {
      console.log('Got error while requesting (' + request.url + '): ' + e.message);
      reject(e);
    });
  
    if (request.payload) {
      req.write(JSON.stringify(request.payload));
    }
  
    req.end();
  });
}


module.exports = {
  name: 'api',
  version: '1.0.0',

  proxy: proxy,

  register: async (server, options) => {

    route_prefix = server.realm.modifiers.route.prefix;

    server.route({
      method: 'GET',
      path: '/healthcheck',
      options: {
        auth: false
      },
      handler: proxy
    });

    server.route({
      method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      path: '/{obj}/{id?}',
      options: {
        auth: {
          strategy: 'bpc',
          access: {
            scope: ['mdbadmin'],
            entity: 'any',
          }
        }
      },
      handler: proxy
    });

    server.route({
      method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      path: '/{obj}/{paths*2}',
      options: {
        auth: {
          strategy: 'bpc',
          access: {
            scope: ['mdbadmin'],
            entity: 'any',
          }
        }
      },
      handler: proxy
    });

    server.route({
      method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      path: '/{obj}/{paths*3}',
      options: {
        auth: {
          strategy: 'bpc',
          access: {
            scope: ['mdbadmin'],
            entity: 'any',
          }
        }
      },
      handler: proxy
    });
  }
};
