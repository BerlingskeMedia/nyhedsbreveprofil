const MDB = require('./api_consumers/mdb_client');
const Boom = require('@hapi/boom');
const ZenDesk = require('./api_consumers/zendesk_client');
const {categories} = require('./api_consumers/categories_client');
const Gigya = require('./api_consumers/gigya_client');
const ARIA = require('./api_consumers/aria_client');

module.exports = {
  name: 'mine-data',
  version: '1.0.0',

  register: async function (server, options) {

    server.route({
      method: 'get',
      path: '/{param*}',
      config: {
        auth: false
      },
      handler: {
        directory: {
          path: 'mine-data/build'
        }
      }
    });

    ['/register', '/valider-email', '/verserende-email', '/reset-password'].forEach(route => {
      server.route({
        method: 'get',
        path: route,
        config: {
          auth: false
        },
        handler: {
          file: 'mine-data/build/index.html'
        }
      });
    });

    server.route({
      method: 'get',
      path: '/config',
      config: {
        auth: false
      },
      handler: async (req, h) => {
        return {
          gigyaApiKey: process.env.GIGYA_API_KEY || '',
          trackingId: process.env.GA_TRACKING_ID || ''
        };
      }
    });

    server.route({
      method: 'get',
      path: '/category/mdb',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {

        const me = await h.bpc.request({ path: `/me` }, req.auth.credentials);

        const user = await MDB.findUser(me.email);

        if (user && user.ekstern_id) {
          return await MDB.getData(user.ekstern_id);
        } else {
          throw Boom.notFound();
        }
      }
    });

    server.route({
      method: 'get',
      path: '/category/aria',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        const me = await h.bpc.request({ path: `/me` }, req.auth.credentials);
        return await ARIA.SubsRetrieveSubscription({
          "returnLevelOfHistory": 'ACTIVE-ONLY',
          "ariaAccountID": me.id
        })
      }
    });

    server.route({
      method: 'get',
      path: '/category/surveygizmo',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        const me = await h.bpc.request({ path: `/me` }, req.auth.credentials);
        return MDB.findSurveyGizmoUser(me.email);
      }
    });

    server.route({
      method: 'delete',
      path: '/category/mdb/permissions/{permissionId}',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        const me = await h.bpc.request({ path: `/me` }, req.auth.credentials);

        const user = await MDB.findUser(me.email);
        return MDB.deletePermissions(user.ekstern_id, req.params.permissionId);
      }
    });
    
    server.route({
      method: 'delete',
      path: '/category/mdb/nyhedsbreve/{newsletterId}',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        const me = await h.bpc.request({ path: `/me` }, req.auth.credentials);

        const user = await MDB.findUser(me.email);
        return MDB.deleteNewsletter(user.ekstern_id, req.params.newsletterId);
      }
    });

    server.route({
      method: 'delete',
      path: '/category/mdb/interesser/{interestId}',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        const me = await h.bpc.request({ path: `/me` }, req.auth.credentials);

        const user = await MDB.findUser(me.email);
        return MDB.deleteIterests(user.ekstern_id, req.params.interestId);
      }
    });

    server.route({
      method: 'delete',
      path: '/category/mdb/user',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        const me = await h.bpc.request({ path: `/me` }, req.auth.credentials);
        const user = await MDB.findUser(me.email);

        return MDB.deleteUser(user.ekstern_id, me.email);
      }
    });

    server.route({
      method: 'delete',
      path: '/category/surveygizmo/{surveyId}/{responseId}',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        const me = await h.bpc.request({ path: `/me` }, req.auth.credentials);

        return MDB.deleteSurveyGizmoResponse(req.params.surveyId, me.email, req.params.responseId);
      }
    });

    server.route({
      method: 'POST',
      path: '/zendesk/request',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        const me = await h.bpc.request({ path: `/me` }, req.auth.credentials);
        const uid = me.id;
        const email = me.email;

        const payload = await ZenDesk.mapRequestToTicket({ payload: req.payload, uid, email });
        const response = await ZenDesk.createTicket(payload);

        await h.bpc.request({
          path: `/permissions/${uid}/zendesk`,
          method: 'PATCH',
          payload: {
            $addToSet: { tickets: { id: response.ticket.id, createdAt: Date.parse(response.ticket.created_at) }}
          }
        });

        return h.response(response && response.ticket.id).code(201);
      }
    });

    server.route({
      method: 'GET',
      path: '/zendesk/check',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        const me = await h.bpc.request({ path: `/me` }, req.auth.credentials);
        const zendeskScope = await h.bpc.request({
          path: `/permissions/zendesk`,
        }, req.auth.credentials);

        const tickets = zendeskScope.tickets;

        const latestTicket = tickets && tickets.reduce((latest, ticket) => {
          if (!latest || ticket.createdAt > latest.createdAt) {
            return ticket;
          }

          return latest;
        }, null);

        if (!latestTicket) {
          return true;
        }

        return ZenDesk.requestAllowed(latestTicket);
      }
    });

    server.route({
      method: 'GET',
      path: '/categories',
      config: {
        auth: false
      },
      handler: async (req, h) => {
        return { categories };
      }
    });

    server.route({
      method: 'DELETE',
      path: '/account',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        const me = await h.bpc.request({ path: `/me` }, req.auth.credentials);
        await Gigya.deleteAccount(me.id);
        return 'OK';
      }
    });

  }
}
