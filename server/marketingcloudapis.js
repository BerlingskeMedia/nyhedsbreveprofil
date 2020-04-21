
const Https = require('https');
const Url = require('url');
const Boom = require('@hapi/boom');


// Client Id
const MARKETINGCLIUD_CLIENT_ID = process.env.MARKETINGCLIUD_CLIENT_ID;
// Client Secret
const MARKETINGCLIUD_CLIENT_SECRET = process.env.MARKETINGCLIUD_CLIENT_SECRET;
// Integration TypeInformation
  // Server-to-Server
// Authentication Base URI 
const MARKETINGCLOUDAPIS_AUTH = Url.parse(process.env.MARKETINGCLOUDAPIS_AUTH);

// REST Base URI Information
const MARKETINGCLOUDAPIS_REST = Url.parse(process.env.MARKETINGCLOUDAPIS_REST);





async function marketingcloudapisAuthRequest(options) {  
  return marketingcloudapisRequest(options, MARKETINGCLOUDAPIS_AUTH);
}


async function marketingcloudapisRestRequest(options) {
  return marketingcloudapisRequest(options, MARKETINGCLOUDAPIS_REST);
}


async function marketingcloudapisRequest(options, MARKETINGCLOUDAPIS_URL) {

  Object.assign(options, {
    protocol: MARKETINGCLOUDAPIS_URL.protocol,
    hostname: MARKETINGCLOUDAPIS_URL.hostname,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (MARKETINGCLOUDAPIS_URL.port){
    options.port = MARKETINGCLOUDAPIS_URL.port;
  }

  return new Promise((resolve, reject) => {

    var req = Https.request(options, (res) => {

      var data = '';

      res.on('data', function(d) {
        data = data + d;
      });

      res.on('end', function () {

        if(res.statusCode >= 400) {
          const err = new Error(res.statusMessage);
          return reject(Boom.boomify(err, { statusCode: res.statusCode }));
        }

        try {
          resolve(JSON.parse(data));
        } catch(ex) {
          console.error(ex)
          console.error(data)
          resolve(data);
        }
      });
    });

    if (options.payload !== undefined && options.payload !== null){
      if (typeof options.payload === 'object') {
        req.write(JSON.stringify(options.payload));
      } else {
        req.write(options.payload);
      }
    }

    req.end();

    req.on('error', function (e) {
      console.log(Date().toString(), 'Error on request to ' + path, e);
      reject(e);
    });
  });
}



// Data in request.auth, is successful authenticated, will look like:
// request.auth.credentials.user is the Internal ID in BPC.
// Now get the Gigya UID (HTTPS GET /me) from BPC.
// Use the Gigya UID and User Key in Markeing Cloud.

//         { isAuthenticated: true,
//           isAuthorized: true,
//           credentials:
//            { exp: 1587116049511,
//              app: 'bpp_api',
//              scope:
//               [ 'role:bpp_api:companies:admin',
//                 'role:bpp_api:accessrules:admin' ],
//              grant: 'dafa15cc7854c3bba483b38307ac0f0c58e57282',
//              user: '5bd1b40b1f5b7ae5f13d7cf2',
//              algorithm: 'sha256',
//              status: 'ok' },
//           artifacts: undefined,
//           strategy: 'bpc',
//           mode: 'required',
//           error: null }


async function proxy (request, h) {
  
  // console.log(h.bpc)
  // console.log(request.state)
  // console.log(request.auth.credentials)

  let me;

  const userTicket = request.state[h.bpc.env.state_name];
  const credentials = request.auth.credentials;


  if(userTicket) {

    me = await h.bpc.request({
      path: `/me`,
      method: 'GET'
    }, userTicket);

  } else {
  
    me = await h.bpc.request({
      path: `/me/${ credentials.user }`,
      method: 'GET'
    });
  }

  console.log(me);
  

  // Responds
  // { _id: '5bd45abd1f5b7ae5f143f2df',
  // id: '97b75fa8a2f842aba44a64b1d963fef0',
  // email: 'dako@berlingskemedia.dk',
  // provider: 'gigya' }


  return 'ok';

}


module.exports = {
  name: 'marketingcloudapis',
  version: '1.0.0',

  proxy: proxy,

  register: async (server, options) => {

    const bpc_app_id = server.bpc.app.id;

    server.route({
      method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      path: '/{obj}/{id?}',
      options: {
        auth: {
          strategy: 'bpc',
          access: {
            entity: 'user',
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
            entity: 'user',
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
            entity: 'user',
          }
        }
      },
      handler: proxy
    });
  }
};
