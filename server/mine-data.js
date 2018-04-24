const KU = require('./api_consumers/kundeunivers_client');
const MDB = require('./api_consumers/mdb_client');
const {wrap} = require('boom');

module.exports.register = function (server, options, next) {

  server.route({
    method: 'get',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'mine-data/build'
      }
    }
  });

  server.route({
    method: 'get',
    path: '/category/kundeunivers/{gigyaUID}',
    handler: (req, reply) => {
      KU.fetchAllData(req.params.gigyaUID)
        .then(allData => reply(allData))
        .catch(err => reply(wrap(err)));
    }
  });

  server.route({
    method: 'get',
    path: '/category/mdb/{email}',
    handler: (req, reply) => {
      MDB.getData(req.params.email)
        .then(allData => reply(allData))
        .catch((err) => {
          console.error('MDB error:', err);
          reply(wrap(err))
        });
    }
  });

  next();
};

module.exports.register.attributes = {
  name: 'mine-data',
  version: '1.0.0'
};
