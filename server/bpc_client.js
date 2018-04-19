'use strict';

const request = require('request');

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

    BPC.callSsoServer('/ticket/app', app, (err, result) => {
      if (err){
        console.error(err);
        setTimeout(BPC.getAppTicket(), 1000 * 60 * 5); // Five minutes
      } else {
        console.log('Got the appTicket');
        BPC.appTicket = result;
        BPC.scheduleAppTicketRefresh(result.exp);
      }
    });
  };

  static refreshAppTicket() {
    BPC.callSsoServer('/ticket/reissue', BPC.appTicket, (err, result) => {
      if (err){
        console.error('refreshAppTicket:', err);
        setTimeout(BPC.getAppTicket(), 1000 * 60 * 5);
      } else {
        BPC.appTicket = result;
        BPC.scheduleAppTicketRefresh(result.exp);
      }
    });
  };

  static scheduleAppTicketRefresh(exp) {
    setTimeout(() => BPC.refreshAppTicket(), exp - Date.now());
  }

  static callSsoServer(path, credentials, callback) {
    const requestHref = `${process.env.BPC_URL}${path}`;

    request({
      uri: requestHref,
      method: 'POST',
      hawk: {
        credentials,
        app: credentials.id
      }
    }, (err, response, body) => {
      if (err) {
        callback(err);
      } else {
        console.log(body);
        callback(null, BPC.parseResponse(body));
      }
    });
  }

  static parseResponse(response) {
    if (typeof response === 'string') {
      try {
        return JSON.parse(response);
      } catch (e) {
        return null;
      }
    }

    return response;
  }
}

module.exports = BPC;
