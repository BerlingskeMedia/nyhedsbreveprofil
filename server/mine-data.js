const KU = require('./api_consumers/kundeunivers_client');
const MDB = require('./api_consumers/mdb_client');
const MailChimp = require('./api_consumers/mailchimp_client');
const Http = require('./lib/http');
const {notFound} = require('boom');
const ZenDesk = require('./api_consumers/zendesk_client');

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
    path: '/config',
    handler: (req, reply) => {
      reply({
        gigyaApiKey: process.env.GIGYA_API_KEY || ''
      });
    }
  });

  server.route({
    method: 'get',
    path: '/category/kundeunivers/{gigyaUID}',
    handler: (req, reply) => {
      KU.fetchAllData(req.params.gigyaUID)
        .then(allData => reply(allData))
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'get',
    path: '/category/mdb/{email}',
    handler: (req, reply) => {
      MDB.findUser(req.params.email)
        .then(user => {
          if (user && user.ekstern_id) {
            return MDB.getData(user.ekstern_id).then(allData => reply(allData));
          } else {
            reply(notFound());
          }
        })
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'get',
    path: '/category/mailchimp/{email}',
    handler: (req, reply) => {
      MailChimp.getData(req.params.email)
        .then(allData => reply(allData))
        .catch((err) => {
          console.error('MailChimp error:', err);
          reply(Http.wrapError(err))
        });
    }
  });

  server.route({
    method: 'POST',
    path: '/zendesk/request',
    handler: (req, reply) => {
      ZenDesk.createTicket(
        ZenDesk.mapPayloadToTicket(req.payload)
      ).then(() => {
        reply(null, '');
      }).catch(err => reply(Http.wrapError(err)));
    }
  });

  next();
};

module.exports.register.attributes = {
  name: 'mine-data',
  version: '1.0.0'
};
