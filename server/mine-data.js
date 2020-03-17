const MDB = require('./api_consumers/mdb_client');
const MailChimp = require('./api_consumers/mailchimp_client');
const Boom = require('@hapi/boom');
const ZenDesk = require('./api_consumers/zendesk_client');
const {categories} = require('./api_consumers/categories_client');
const Gigya = require('./api_consumers/gigya_client');

module.exports = {
  name: 'mine-data',
  version: '1.0.0',

  register: async function (server, options) {

    // server.ext('onRequest', function (request, h) {
    //   var redirect = options.proxy !== false
    //     ? request.headers['x-forwarded-proto'] === 'http'
    //     : request.server.info.protocol === 'http'

    //   if (redirect) {
    //     return reply()
    //       .redirect('https://' + request.headers.host + request.url.path)
    //       .code(301)
    //   }
    //   return h.continue;
    // })

    // server.ext('onPreResponse', function(request, h) {

    //   if(request.route.path.startsWith('/mine-data')) {
    //     request.response.header("X-Frame-Options", "SAMEORIGIN");
    //     request.response.header("X-XSS-Protection", "1; mode=block");
    //     request.response.header("Content-Security-Policy", "default-src 'unsafe-eval' https:; style-src 'unsafe-inline' https:");
    //     request.response.header("X-Content-Type-Options", "nosniff");
    //     request.response.header("Strict-Transport-Security", "max-age=63072000");
    //   }

    //   return h.continue;

    // });

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
          trackingId: process.env.GA_TRACKING_ID || '',
          bpcUrl: process.env.BPC_URL || '',
          bpcAppId: process.env.NYHEDSBREVEPROFIL_APP_ID
        };
      }
    });

    server.route({
      method: 'get',
      path: '/category/kundeunivers',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {

        const userTicket = req.auth.credentials;
        console.log(userTicket)

        return {};
      }
    });

    server.route({
      method: 'get',
      path: '/category/mdb',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        const email = 'dako@berlingskemedia.dk';
        const user = await MDB.findUser(email);
        if (user && user.ekstern_id) {
          return await MDB.getData(user.ekstern_id);
        } else {
          throw Boom.notFound();
        }
      }
    });

    server.route({
      method: 'get',
      path: '/category/surveygizmo',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        const email = 'dako@berlingskemedia.dk';
        return MDB.findSurveyGizmoUser(email);
      }
    });

    server.route({
      method: 'get',
      path: '/category/mailchimp',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        const email = 'dako@berlingskemedia.dk';
        try {
          const a = await MailChimp.getData(email);
          console.log(a)
        } catch(err) {
          console.log(err)
        }
        return {};
      }
    });

    server.route({
      method: 'delete',
      path: '/category/mdb/permissions/{permissionId}',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        const email = 'dako@berlingskemedia.dk';
        const user = await MDB.findUser(email);
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
        const email = 'dako@berlingskemedia.dk';
        const user = await MDB.findUser(email);
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
        const email = 'dako@berlingskemedia.dk';
        const user = await MDB.findUser(email);
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
        const email = 'dako@berlingskemedia.dk';
        const user = await MDB.findUser(email);
        return MDB.deleteUser(user.ekstern_id);
      }
    });

    server.route({
      method: 'delete',
      path: '/category/surveygizmo/{surveyId}/{responseId}',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        const email = 'dako@berlingskemedia.dk';
        return MDB.deleteSurveyGizmoResponse(req.params.surveyId, email, req.params.responseId);
      }
    });

    server.route({
      method: 'delete',
      path: '/category/mailchimp/{listId}/{userId}',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        const email = 'dako@berlingskemedia.dk';
        const mailChimpData = await MailChimp.getData(email);
        if (mailChimpData.some(item => item.list_id === req.params.listId && item.id === req.params.userId)) {
          return await MailChimp.delete(req.params.listId, req.params.userId)
        }

        throw Boom.notFound();
      }
    });

    server.route({
      method: 'POST',
      path: '/zendesk/request',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        // TODO
        const uid = '_guid_dVlIynSm5Mk913pi57uG3j0l7hGnSb7hMy4GlTGJXFU=';
        const email = 'dako@berlingskemedia.dk';
        const payload = await ZenDesk.mapRequestToTicket({ payload: req.payload, uid, email });
        const response = await ZenDesk.createTicket(payload);



        BPC.addZenDeskTicket(uid, response.ticket)
          .then(() => reply(response && response.ticket.id).code(201))
      }
    });

    server.route({
      method: 'GET',
      path: '/zendesk/check',
      config: {
        auth: 'bpc'
      },
      handler: async (req, h) => {
        // TODO:
        const uid = '_guid_dVlIynSm5Mk913pi57uG3j0l7hGnSb7hMy4GlTGJXFU=';
        return ZenDesk.requestAllowed(uid)
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
        // const uid = JWT.decodeRequest(req).uid;
        const uid = "_guid_dVlIynSm5Mk913pi57uG3j0l7hGnSb7hMy4GlTGJXFU=";

        await KU.deleteAccount(uid);
        await Gigya.deleteAccount(uid);

        return 'OK';
      }
    });

  }
}
