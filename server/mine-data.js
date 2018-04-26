const KU = require('./api_consumers/kundeunivers_client');
const MDB = require('./api_consumers/mdb_client');
const {badImplementation, notFound} = require('boom');

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
        .catch(err => reply(badImplementation(err)));
    }
  });

  server.route({
    method: 'get',
    path: '/category/mdb/{email}',
    handler: (req, reply) => {
      MDB.findUser(req.params.email)
        .then(user => {
          if (user && user.eksternId) {
            return MDB.getData(user.eksternId).then(allData => reply(allData));
          } else {
            reply(notFound());
          }
        })
        .catch(err => {
          console.error('MDB error:', err);
          reply(badImplementation(err));
        });
    }
  });

  next();
};

module.exports.register.attributes = {
  name: 'mine-data',
  version: '1.0.0'
};
