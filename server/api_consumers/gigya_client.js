'use strict';

const Crypto = require('crypto');
const Https = require('https');
const Querystring = require('querystring');

module.exports.getSignature = (payload) => {
  const secretBuffer = Buffer.from(process.env.GIGYA_SECRET_KEY || '', 'base64');
  const algorithm = 'sha1';
  const _message = Buffer.from(JSON.stringify(payload));
  const hmac = Crypto.createHmac(algorithm, secretBuffer).update(_message);
  return hmac.digest('base64');
}

module.exports.validNotificationRequest = function (request) {
  const signature = module.exports.getSignature(request.payload);
  const header = request.headers['x-gigya-sig-hmac-sha1'];
  return signature === header;
};


// Gigya configuration.
const GIGYA_DC = process.env.GIGYA_DC || 'eu1';
const GIGYA_HOSTNAME = process.env.GIGYA_HOSTNAME || 'gigya.com';
const GIGYA_API_KEY = process.env.GIGYA_API_KEY || process.env.GIGYA_APP_KEY;
const GIGYA_USER_KEY = process.env.GIGYA_USER_KEY;
const GIGYA_SECRET_KEY = process.env.GIGYA_SECRET_KEY;

const auth_qs = Querystring.stringify({
  apiKey: GIGYA_API_KEY,
  userKey: GIGYA_USER_KEY,
  secret: GIGYA_SECRET_KEY
});


module.exports.request = async ({ path, payload, api = 'accounts' }) => {

  const postData = Querystring.stringify(payload);

  const options = {
    hostname: `${api}.${GIGYA_DC}.${GIGYA_HOSTNAME}`,
    port: 443,
    path: `${ path }?${ auth_qs }`,
    method: 'POST',
    headers: {
      'Content-Length': Buffer.byteLength(postData),
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };


  return new Promise((resolve, reject) => {

    var req = Https.request(options, function(res) {
      var buffer = "";
      res.on('data', function(chunk) {
          buffer += chunk;
      });
      res.on('end', function(chunk) {
        try {
          if(buffer) {
            var result = JSON.parse(buffer.toString());
            resolve(result);
          } else {
            resolve();
          }

          // TODO: 
          // if(body.statusCode === 200 || body.statusCode === 206) {

          //   return resolve({ response, body });
    
          // } else if(body.errorCode > 0 || body.statusCode >= 400) {

        } catch(err) {
          reject(err);
        }
      });
    });
    
    req.on('error', (err) => {
      console.err(err.toString());
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
};


module.exports.deleteAccount = async (UID) => {
 return module.exports.request({
  path: '/accounts.deleteAccount',
  payload: { UID }
 });
};
