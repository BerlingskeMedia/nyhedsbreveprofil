const Http = require('./lib/http');
const JWT = require('./lib/jwt');

const NYHEDSBREVEPROFIL_APP_ID = process.env.NYHEDSBREVEPROFIL_APP_ID;
const NYHEDSBREVEPROFIL_APP_SECRET = process.env.NYHEDSBREVEPROFIL_APP_SECRET;

class BPC {
  static addZenDeskTicket(uid, ticket) {
    return BPC.callSsoServer(`/permissions/${uid}/zendesk`, BPC.appTicket, {
      $addToSet: {tickets: {id: ticket.id, createdAt: Date.parse(ticket.created_at)}}
    }, 'patch');
  }

  static fetchAndSaveAppTicket() {
    this.getAppTicket().then(ticket => {
      console.log('BPC ticket fetched and saved');
      BPC.saveAppTicket(ticket);

      if (BPC.timeoutId) {
        clearTimeout(BPC.timeoutId);
      }

      BPC.timeoutId = setTimeout(() => BPC.fetchAndSaveAppTicket(), ticket.exp - Date.now());
    });
  }

  static getAppTicket() {
    const app = {
      id: NYHEDSBREVEPROFIL_APP_ID,
      key: NYHEDSBREVEPROFIL_APP_SECRET,
      algorithm: 'sha256'
    };

    return BPC.callSsoServer('/ticket/app', app);
  };

  static getUserScopeData(uid, scope) {
    return BPC.callSsoServer(`/permissions/${uid}/${scope}`, BPC.appTicket, null, 'get');
  }

  static getUserTicket(rsvp) {
    return BPC.callSsoServer('/ticket/user', BPC.appTicket, {rsvp});
  }

  static validateRequest(request) {
    const url = `${request.server.info.uri}${request.path}`;
    return BPC.validateUserTicket(JWT.decodeRequest(request).userTicket, request.method, url);
  }

  static validateUserTicket(userTicket) {
    return BPC.callSsoServer('/permissions', userTicket, null, 'get');
  }

  static saveAppTicket(ticket) {
    BPC.appTicket = ticket;
  }

  static callSsoServer(path, credentials, payload, method = 'post') {
    return Http.request(method, `${process.env.BPC_URL}${path}`, credentials, payload)
      .catch(err => {
        if (err.response) {
          console.error('callSsoServer:', err.response.statusCode, err.response.statusMessage);
        } else {
          console.error('callSsoServer:', err);
        }

        throw err;
      });
  }
}

module.exports = BPC;
