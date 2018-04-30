'use strict';

const Http = require('./lib/http');

const NYHEDSBREVEPROFIL_APP_ID = process.env.NYHEDSBREVEPROFIL_APP_ID;
const NYHEDSBREVEPROFIL_APP_SECRET = process.env.NYHEDSBREVEPROFIL_APP_SECRET;

class BPC {
  constructor() {
    BPC.appTicket = null;
  }

  static getAppTicket() {
    const app = {
      id: NYHEDSBREVEPROFIL_APP_ID,
      key: NYHEDSBREVEPROFIL_APP_SECRET,
      algorithm: 'sha256'
    };

    BPC.callSsoServer('/ticket/app', app)
      .then(result => BPC.persistAppTicket(result));
  };

  static refreshAppTicket() {
    BPC.callSsoServer('/ticket/reissue', BPC.appTicket)
      .then(result => BPC.persistAppTicket(result));
  };

  static persistAppTicket(ticket) {
    BPC.appTicket = ticket;
    setTimeout(() => BPC.refreshAppTicket(), ticket.exp - Date.now());
  }

  static callSsoServer(path, credentials) {
    return Http.request('post', `${process.env.BPC_URL}${path}`, credentials)
      .catch(err => {
        console.error('callSsoServer:', err);
        setTimeout(BPC.getAppTicket(), 1000 * 60 * 5);
      });
  }
}

module.exports = BPC;
