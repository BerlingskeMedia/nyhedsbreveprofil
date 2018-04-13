'use strict';

const Boom = require('boom');
const Hawk = require('hawk');
const https = require('https');
const http = require('http');
const Url = require('url');

var appTicket = {};
var BPC_URL;

try {
  BPC_URL = Url.parse(process.env.BPC_URL);
} catch (ex) {
  console.error('Env var BPC_URL missing or invalid.');
  process.exit(1);
}

const NYHEDSBREVEPROFIL_APP_ID = process.env.NYHEDSBREVEPROFIL_APP_ID;
const NYHEDSBREVEPROFIL_APP_SECRET = process.env.NYHEDSBREVEPROFIL_APP_ID;

console.log('Connecting to BPC on', BPC_URL.host, 'AS', NYHEDSBREVEPROFIL_APP_ID);

function getAppTicket() {
  var app = {
    id: NYHEDSBREVEPROFIL_APP_ID,
    key: NYHEDSBREVEPROFIL_APP_SECRET,
    algorithm: 'sha256'
  };

  callSsoServer({path: '/ticket/app', method: 'POST', payload: {}}, app, function(err, result){
    if (err){
      console.error(err);
      setTimeout(getAppTicket, 1000 * 60 * 5); // Five minutes
    } else {
      console.log('Got the appTicket');
      appTicket = result;
      setTimeout(refreshAppTicket, result.exp - Date.now() - 10000);
    }
  });
};

getAppTicket();

function refreshAppTicket(){
  callSsoServer({path: '/ticket/reissue', method: 'POST'},  appTicket, function(err, result){
    if (err){
      console.error('refreshAppTicket:', err);
      setTimeout(getAppTicket, 1000 * 60 * 5);
    } else {
      appTicket = result;
      setTimeout(refreshAppTicket, result.exp - Date.now() - 10000);
    }
  });
};

module.exports.getUserTicket = function(rsvp, callback) {
  callSsoServer({path: '/ticket/user', method: 'POST', payload: {rsvp: rsvp}}, appTicket, callback);
};


module.exports.reissueTicket = function(ticket, callback){
  callSsoServer({path: '/ticket/reissue', method: 'POST'}, ticket, callback);
};

function callSsoServer(options, credentials, callback) {

  Object.assign(options, {
    protocol: BPC_URL.protocol,
    hostname: BPC_URL.hostname
  });

  if (BPC_URL.port){
    options.port = BPC_URL.port;
  }

  if (callback === undefined && typeof credentials === 'function') {
    callback = credentials;
    credentials = null;
  }

  if (callback === undefined) {
    callback = function(err) {
      if (err) {
        console.error(err);
      }
    }
  }

  // In case we want a request completely without any credentials, use {} as the credentials parameter to this function
  if (credentials === undefined || credentials === null){
    credentials = appTicket;
  }

  if (credentials !== undefined && credentials !== null && Object.keys(credentials).length > 1){
    var requestHref = Url.resolve(BPC_URL.href, options.path);
    var hawkHeader = Hawk.client.header(requestHref, options.method || 'GET', {credentials: credentials, app: NYHEDSBREVEPROFIL_APP_ID});
    if (hawkHeader.err) {
      console.error(hawkHeader.err);
      return callback(new Error('Hawk header: ' + hawkHeader.err));
    }

    hawkHeader.field = hawkHeader.field.replace(/\r?\n|\r/g, '');
    options.headers = {
      'Authorization': hawkHeader.field
    };
  }

  var reqHandler = https;
  if (options.protocol === 'http:') {
    reqHandler = http;
  }
  try {
    var req = reqHandler.request(options, parseReponse(callback));
  } catch (err) {
    console.error(err);
    return;
  }

  if (options.payload !== undefined && options.payload !== null){
    if (typeof options.payload === 'object'){
      req.write(JSON.stringify(options.payload));
    } else {
      req.write(options.payload);
    }
  }

  req.end();

  req.on('error', function (e) {
    console.error(e);
    callback(e);
  });
}

function parseReponse (callback) {
  return function (res) {
    var data = '';

    res.on('data', function(d) {
      data = data + d;
    });

    res.on('end', function () {
      try {
        if (data.length > 0){
          data = JSON.parse(data);
        }
      } catch (ex) {
        console.error('JSON parse error on: ', data);
        throw ex;
      }

      if (data.statusCode > 300) {

        if (data.statusCode === 401 && data.message === 'Expired ticket'){
          getAppTicket();
        }

        var error = new Error(data.error.concat(' ', data.message));
        var err = Boom.boomify(error,{
          statusCode: data.statusCode,
        });
        callback(err, null);
      }
      else
        callback(null, data);
    });
  };
}
