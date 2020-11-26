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

  } else if(!temp.protocol && process.env.MDBAPI_ADDRESS) {
    console.log('TEST 4back');
    MDBAPI_PROTOCOL = 'https:';
    MDBAPI_HOSTNAME = process.env.MDBAPI_ADDRESS;
    MDBAPI_PORT = '443';
  
  } else {

    throw new Error('unknown protocol or port');

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

        // Redirect when the smartlink is using parameter "url"
        if(res.statusCode === 302) {
          if(res.headers && res.headers.location) {
            return resolve(h.response().redirect(res.headers.location));
          }
        }
        
        if(res.statusCode >= 400) {
          const err = new Error(res.statusMessage);
          return reject(Boom.boomify(err, { statusCode: res.statusCode }));
        }

        console.log(`-- ${ options.method } ${ options.path }`);
        console.log(`--    ${ JSON.stringify(options.headers) }`);

        if(data.length > 0) {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch(ex) {
            resolve(data);
          }
        } else {
          resolve('OK');
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


async function updateUser (request, h) {
  const response = await proxy(request);
  
  if (response.statusCode === 200) {
    // We send a reciept for all updateUser request thats
    // a) not from our site (usually a smartlink) and
    // b) not from a silenced location eg. opdateringskampagnen
    // TODO: This should be done using cookies or OAuth to be secure
    const requestIsFromTheMainSite = request.headers.referer.indexOf('profil.berlingskemedia.dk') > -1;
    const locationIdsForOpdateringskampagnen = [2059, 2077, 2635];
    const requestHasOpdateringskampagnenLocation = locationIdsForOpdateringskampagnen.indexOf(request.payload.location_id) > -1;
    const requestIsFromOpdateringskampagnen = requestIsFromTheMainSite && requestHasOpdateringskampagnenLocation;
  
    if (!requestIsFromOpdateringskampagnen) {
      await proxy({
        method: 'POST',
        url: {
          path: '/mails/send'
        },
        payload: {
          to: request.payload.email,
          template: '26a0a5b3-46ff-49a4-9201-afd4c6050aeb',
          category: 'update-user',
          substitutions: request.payload !== null ? request.payload : {}
        },
        headers: {}
      });
    }
  }

  // We want to return the first response from POST /users/{id} - not the response from email
  return response;
}


module.exports = {
  name: 'backend',
  version: '1.0.0',

  proxy: proxy,

  register: async function (server, options) {

    route_prefix = server.realm.modifiers.route.prefix;

    /* These are the URL's we're allowing to proxy */

    // server.route({
    //   method: 'GET',
    //   path: '/healthcheck',
    //   handler: proxy
    // });

    server.route({
      method: 'GET',
      path: '/publishers',
      handler: proxy
    });

    server.route({
      method: 'GET',
      path: '/nyhedsbreve',
      handler: proxy
    });

    server.route({
      method: 'GET',
      path: '/nyhedsbreve/{nyhedsbrev_id}',
      handler: proxy
    });

    server.route({
      method: 'GET',
      path: '/interesser',
      handler: proxy
    });

    server.route({
      method: 'GET',
      path: '/interesser/toplevels',
      handler: proxy
    });

    server.route({
      method: 'GET',
      path: '/interesser/full',
      handler: proxy
    });

    server.route({
      method: 'GET',
      path: '/users/{user_id}',
      handler: proxy
    });

    server.route({
      method: 'POST',
      path: '/users/{user_id}',
      handler: updateUser
    });

    server.route({
      method: 'POST',
      path: '/doubleopt',
      handler: proxy
    });

    server.route({
      method: 'POST',
      path: '/doubleopt/{confirm_key}/confirm',
      handler: proxy
    });

    server.route({
      method: 'POST',
      path: '/doubleopt/{double_opt_key}/interesser',
      handler: proxy
    });

    server.route({
      method: ['POST', 'DELETE'],
      path: '/users/{user_id}/nyhedsbreve/{nyhedsbrev_id}',
      handler: proxy
    });

    server.route({
      method: ['POST', 'DELETE'],
      path: '/users/{user_id}/permissions/{permission_id}',
      handler: proxy
    });

    server.route({
      method: 'POST',
      path: '/users/{user_id}/nyhedsbreve/delete',
      handler: proxy
    });

    server.route({
      method: 'POST',
      path: '/mails/profile-page-link',
      handler: proxy
    });

    server.route({
      method: ['POST', 'DELETE'],
      path: '/users/{user_id}/interesser/{interesse_id}',
      handler: proxy
    });

    server.route({
      method: 'POST',
      path: '/kampagner/kampagnelinie',
      handler: proxy
    });
  }
};
