'use strict';

const Http = require('./lib/http');
const JWT = require('./lib/jwt');

const NYHEDSBREVEPROFIL_APP_ID = process.env.NYHEDSBREVEPROFIL_APP_ID;
const NYHEDSBREVEPROFIL_APP_SECRET = process.env.NYHEDSBREVEPROFIL_APP_SECRET;

class BPC {
  constructor() {
    BPC.appTicket = null;
    BPC.timeoutId = null;
  }

  static fetchAndSaveAppTicket() {
    this.getAppTicket().then(ticket => {
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

  static getUserTicket(rsvp) {
    return BPC.callSsoServer('/ticket/user', BPC.appTicket, {rsvp});
  }

  static validateRequest(request) {
    const url = `${request.server.info.uri}${request.path}`;
    return BPC.validateUserTicket(JWT.decodeRequest(request), request.method, url);
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
