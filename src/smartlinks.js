/*jshint node: true */
'use strict';

var Joi = require('joi');

module.exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      execute(request.query, reply);
    },
    config: {
      validate: {
        query: smartlink_scheme
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/',
    handler: function (request, reply) {
      execute(request.payload, reply);
    },
    config: {
      validate: {
        payload: smartlink_scheme
      }
    }
  });

  next();
};

module.exports.register.attributes = {
    name: 'smartlinks',
    version: '1.0.0'
};

var smartlink_scheme = Joi.object().keys({
  email: Joi.string().email(),
  ekstern_id: Joi.string().length(32), //4a5a6199fa07bf76054e93c3e53aeb9f
  flow: Joi.string().valid('simple', 'doubleopt').required(),
  action: Joi.string().valid('signup', 'signout').required(),
  lid: Joi.number().required(),
  nid: Joi.number(),
  iid: Joi.number(),
  pid: Joi.number(),
  start: Joi.string().isoDate(),
  end: Joi.string().isoDate(),
  url: Joi.string().uri({scheme: ['http','https']}),
  fornavn: Joi.string(),
  efternavn: Joi.string(),
  land: Joi.string(),
  postnummer: Joi.number().min(999).max(9999),
  bynavn: Joi.string(),
  vejnavn: Joi.string(),
  husnummer: Joi.string(),
  husbogstav: Joi.string(),
  etage: Joi.string(),
  sidedoer: Joi.string(),
  telefon: Joi.string(),
  mobil: Joi.string(),
  foedselsaar: Joi.number().min(1900).max(3000),
  firma: Joi.string(),
  firma_adresse: Joi.string(),
  koen: Joi.string().valid('M', 'K')
}).or('nid', 'iid', 'pid').or('email', 'ekstern_id');

// <form action="http://apps.adlifter.com/plugin/" method="POST">
//    <input name="stack_key" type="hidden" value="dcc741e9544beb16005993da368b855c"/>
//    <input name="application_key" type="hidden" value="70c4dd8af56f5dad9d5483513f049eb6"/>
//    <input name="command" type="hidden" value="cmd_berlingske_quicksignup"/>
//    <input name="customer_key" type="hidden" value="a40e4703a823d1d11977928620c6ead0"/>
//    <input name="lid" type="hidden" value="1799"/>
//    <input name="mid" type="hidden" value="1"/>
//    <input name="rtype" type="hidden" value="1"/>
//    <input name="nlids" type="hidden" value="300"/>
//    <input name="intids" type="hidden" value=""/>
//    <input name="url" type="hidden" value=""/>
//    <input name="action" type="hidden" value="1"/>
//    email: <input name="email"/>
//    <input name="firma"/>
//    <input name="fornavn"/>
//    <input name="efternavn"/>
//    <input name="land"/>
//    <input name="postnummer"/>
//    <input name="bynavn"/>
//    <input name="vejnavn"/>
//    <input name="husnummer"/>
//    <input name="husbogstav"/>
//    <input name="etage"/>
//    <input name="sidedoer"/>
//    <input name="telefon"/>
//    <input name="mobil"/>
//    <input name="foedselsaar"/>
//    <input name="firma_adresse"/>
//    <input type="radio" name="koen" value="K">Kvinde</input>
//    <input type="radio" name="koen" value="M">Mand</input>
//    <input type="submit" value="Tilmeld" />
//  </form>

function execute (smartlink, callback) {

  callback();
}