/*jshint node: true */
'use strict';

const Handlers = require('../lib/response_handlers');
const Url = require('url');
const https = require('https');
const Http = require('../lib/http');

var KUNDEUNIVERS_URL;
const NYHEDSBREVEPROFIL_APP_ID = process.env.NYHEDSBREVEPROFIL_APP_ID;

try {
  KUNDEUNIVERS_URL = Url.parse(process.env.KUNDEUNIVERS_URL);
} catch (ex) {
  console.error('Env var KUNDEUNIVERS_URL missing or invalid.');
  process.exit(1);
}

module.exports.fetchAllData = (gigyaUid) => {
  return Http.get(`${KUNDEUNIVERS_URL.href}/my/account/${gigyaUid}.json`);
};

module.exports.getUserProfileData = function (gigya_uid) {
  var path = KUNDEUNIVERS_URL.href + '/my/account/' + gigya_uid + '.json';

  return new Promise((fulfill, reject) => {
    callKundeunivers({path: path, method: 'GET'}, function (err, result) {
      if (err) {
        console.error('call kundeunivers:', err);
        reject(err);
      } else {
        console.log('Data from Kundeunivers acquired.');
        fulfill(prettifyProfileOutput(result));
      }
    });
  });
}

module.exports.getUserTransactionData = function (gigya_uid) {
  var path = KUNDEUNIVERS_URL.href + '/my/account/' + gigya_uid + '/orders.json?extended=1&transactions=1';
  callKundeunivers({path: path, method: 'GET'}, function (err, result) {
    if (err) {
      console.error('call kundeunivers:', err);
    } else {
      console.log('Data from Kundeunivers acquired.')
      return prettifyTransactionOutput(result);
    }
  });
}

function prettifyTransactionOutput(result) {
  //<TODO> talk with mateusz what data from confluence: userprofile we would like to present
  console.log(result);
  return result;
}

function prettifyProfileOutput({mail, name, city, zipcode, address, phone}) {
  //<TODO> talk with mateusz what data we would like to present
  return {
    mail, name, city, zipcode, address, phone
  };
}

function callKundeunivers(options, callback) {
  Object.assign(options, {
    protocol: KUNDEUNIVERS_URL.protocol,
    hostname: KUNDEUNIVERS_URL.hostname
  });
  // var credentials =BPC.readAppTicket(); //tickets.readTicket();
  const credentials = null;

  if (credentials !== undefined && credentials !== null && Object.keys(credentials).length > 1) {
    var requestHref = Url.resolve(KUNDEUNIVERS_URL.href, options.path);
    var hawkHeader = Hawk.client.header(requestHref, options.method || 'GET', {
      credentials: credentials,
      app: NYHEDSBREVEPROFIL_APP_ID
    });
    if (hawkHeader.err) {
      console.error(hawkHeader.err);
      return callback(new Error('Hawk header: ' + hawkHeader.err));
    }

    options.headers = {
      'Authorization': hawkHeader.field
    };
  }

  var request = https.request(options, Handlers.responseHandler(callback));
  if (options.payload !== undefined && options.payload !== null) {
    if (typeof options.payload === 'object') {
      request.write(JSON.stringify(options.payload));
    } else {
      request.write(options.payload);
    }
  }

  request.on('error', function (err) {
    console.error(err);
    callback(err);
  });
  request.end();
}
