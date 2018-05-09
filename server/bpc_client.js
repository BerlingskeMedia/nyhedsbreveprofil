'use strict';

const Http = require('./lib/http');

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

  static saveAppTicket(ticket) {
    BPC.appTicket = ticket;
  }

  static callSsoServer(path, credentials) {
    return Http.request('post', `${process.env.BPC_URL}${path}`, credentials)
      .catch(err => {
        if (err.response) {
          console.error('callSsoServer:', err.response.statusCode, err.response.statusMessage);
        } else {
          console.error('callSsoServer:', err);
        }
      });
  }
}

module.exports = BPC;
