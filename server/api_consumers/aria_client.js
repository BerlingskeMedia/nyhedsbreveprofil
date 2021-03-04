const Crypto = require('crypto');
const Https = require('https');
const Path = require('path');
const Url = require('url');
const logger = require('./../logger');

module.exports.client = ({ARIA_HOST, ARIA_AUTH_KEY, ARIA_CLIENT_NO}) => {
    const _ARIA_HOST = Url.parse(ARIA_HOST);
    logger.debug(`Using ${ _ARIA_HOST.href } as ARIA endpoint`);

    const createMsgAuthDetails = function ({ ariaAccountID, ariaAccountNo }) {
        // Aria requires data format:
        // yyyy-MM-ddTHH:mm:ssZ
        const msgAuthDetails = {
            clientNo: ARIA_CLIENT_NO,
            authKey: null,
            requestDateTime: `${ new Date().toISOString().substring(0,19) }Z`,
            signatureValue: '',
            signatureVersion: 1,
            ariaAccountID: ariaAccountID || null,
            ariaAccountNo: ariaAccountNo || 0,
            userID: null,
        };
        return msgAuthDetails;
    };
    const createSignatureValueInput = function(msgAuthDetails) {
        const fields = [
            msgAuthDetails.clientNo,
            msgAuthDetails.requestDateTime,
            msgAuthDetails.ariaAccountID,
            msgAuthDetails.ariaAccountNo,
            msgAuthDetails.userID,
            ARIA_AUTH_KEY
        ];
        const concatValue = fields.join('|');
        return concatValue;
    };
    const calculateSignatureValue = function(input) {
        const sha256 = Crypto.createHash('sha256').update(input, 'utf16le').digest();
        const base64 = Buffer.from(sha256).toString('base64');
        return base64;
    };
    const ariaRequest = async function ({ url, data, ariaAccountID, ariaAccountNo }) {
        let msgAuthDetails = createMsgAuthDetails({ ariaAccountID, ariaAccountNo });
        const signatureValueInput = createSignatureValueInput(msgAuthDetails);
        const signatureValue = calculateSignatureValue(signatureValueInput);
        msgAuthDetails.signatureValue = signatureValue;
        const path = Path.join(_ARIA_HOST.path, url);
        const payload = {
            msgAuthDetails,
            ...data,
        };
        const postData = JSON.stringify(payload);
        const options = {
            hostname: _ARIA_HOST.hostname,
            port: 443,
            path: path,
            method: 'POST',
            headers: {
                'Content-Length': Buffer.byteLength(postData),
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json'
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
                            let result = buffer.toString();
                            try {
                                result = JSON.parse(buffer.toString());
                            } catch(err) {}
                            resolve(result);
                        } else {
                            resolve();
                        }
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
    return {
        request: ariaRequest
    };
};

const ARIA_HOST = process.env.ARIA_HOST;
const ARIA_AUTH_KEY = process.env.ARIA_AUTH_KEY;
const ARIA_CLIENT_NO = process.env.ARIA_CLIENT_NO;

const aria_client = module.exports.client({ ARIA_HOST, ARIA_AUTH_KEY, ARIA_CLIENT_NO });

module.exports.SubsRetrieveSubscription = async function ({
    ariaAccountNo,
    ariaAccountID,
    returnLevelOfDetail = 'DETAILS',
    returnLevelOfHistory = 'ACTIVE-ONLY',
}) {
    const res = await aria_client.request({
        url: '/PostDataToFlow/ARIAMediaSuite/SubscriptionManagement/SubsRetrieveSubscription',
        data: {
            subsRetrieveSubscriptionCriteria: {
                ariaAccountID,
                ariaAccountNo,
                returnLevelOfDetail,
                returnLevelOfHistory
            }
        },
        ariaAccountNo,
        ariaAccountID
    });

    return res;
};



