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
// const hapiAuthJwt2 = require('hapi-auth-jwt2');
// const { authConfig } = require('./lib/jwt');

const init = async () => {

  const server = Hapi.server({
      port: 3000,
      host: 'localhost'
  });


  // await server.register(hapiAuthJwt2);
  // server.auth.strategy('jwt', 'jwt',
  // { key: process.env.JWT_SECRET, // Never Share your secret key
    // validate: authConfig.validateFunc  // validate function defined above
  // });

  // server.auth.default('jwt');

  // server.auth.strategy('jwt', 'jwt', authConfig);

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

// var server = new Hapi.Server({
//   connections: {
//     router: {
//       stripTrailingSlash: false
//     }
//   }
// });



// server.connection({
//   port: process.env.PORT ? process.env.PORT : 8000,
//   routes: {
//     cors: true
//   }
// });

// server.register(hapiAuthJwt2, err => {
//   if (err) {
//     console.log(err);
//   }



//   if (!module.parent) {
//     server.start((err) => {
//       if (err) {
//         throw err;
//       }

//       console.log(`Server running at: ${server.info.uri}`);
//     });
//   }
// });

// function cb (err) {
//   if (err) {
//     console.log('Error when loading plugin', err);
//     server.stop();
//   }
// }

// module.exports = server;
