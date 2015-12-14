/*jshint node: true */
'use strict';

var Joi = require('joi'),
    Boom = require('boom'),
    backend = require('./backend');

module.exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      execute(request.query, reply);
    },
    config: {
      pre: [appendReferrer],
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
      pre: [appendReferrer],
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
  action: Joi.string().valid('signup', 'signout'),
  lid: Joi.number().required(),
  nid: [Joi.number(), Joi.array().items(Joi.number())],
  iid: [Joi.number(), Joi.array().items(Joi.number())],
  pid: [Joi.number(), Joi.array().items(Joi.number())],
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

function appendReferrer (request, reply) {
  if (request.query)
    request.query.referrer = request.info.referrer;
  if (request.payload)
    request.payload.referrer = request.info.referrer;
  return reply();
}

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

// http://profil.berlingskemedia.dk/smartlink?
  // ?nlids=6
  // &intids=14
  // &pids=54
  // &flow=simple
  // &action=subscribe
  // &customerfield=email
  // &startdate=1450083944
  // &enddate=1450220400
  // &lid=1728

function execute (smartlink, callback) {
  if (smartlink.action === undefined) {
    smartlink.action = 'signup';
  }

  console.log('execute', smartlink);

  //action=signup
  //action=signout

  // ==== simple, email

  // ==== simple, ekstern_id

  // ==== doubleopt, email/ekstern_id


  // ==== doubleopt, ekstern_id

  if (smartlink.flow === 'simple' && smartlink.email) {
    // TODO
    var message = 'Flow simple and email is not supported.';
    console.log(message, smartlink);
    callback(Boom.badRequest(message));

  } else if (smartlink.flow === 'doubleopt' && smartlink.ekstern_id) {
    // TODO
    var message = 'Flow doubleopt and ekstern_id is not supported.';
    console.log(message, smartlink);
    callback(Boom.badRequest(message));

  } else if (smartlink.flow === 'doubleopt' && smartlink.action === 'signout') {
    // TODO
    var message = 'Flow doubleopt and action signout is not supported.';
    console.log(message, smartlink);
    callback(Boom.badRequest(message));

  } else if (smartlink.flow === 'simple') {

    if (smartlink.ekstern_id === undefined) {
      var message = 'Missing ekstern_id for flow simple.';
      console.log(message, smartlink);
      return callback(Boom.badRequest(message));
    }
    var payload = copyUserData(smartlink);

    backend.mdbapi('PATCH', '/users/'.concat(smartlink.ekstern_id), payload, function (err, result) {
      if (err) {
        console.log('PATCH users error', err);
        return callback(err);
      }

      if (result.statusCode === 404) {
        var message = 'User not found.';
        console.log(message, smartlink);
        return callback(Boom.badRequest(message));
      }

      var http_method = smartlink.action === 'signout' ? 'DELETE' : 'POST';

      // Newsletters
      if (smartlink.nid) {
        console.log('sds');
        if (smartlink.nid instanceof Array) {
          backend.mdbapi(http_method, ''.concat('/users/', smartlink.ekstern_id, '/nyhedsbreve'), {nyhedsbreve: smartlink.nid, location_id: smartlink.lid});
        } else {
          backend.mdbapi(http_method, ''.concat('/users/', smartlink.ekstern_id, '/nyhedsbreve/', smartlink.nid, '?location_id=', smartlink.lid));
        }
      }

      // Permissions
      if (smartlink.pid) {
        if (smartlink.iid instanceof Array) {
          backend.mdbapi(http_method, ''.concat('/users/', smartlink.ekstern_id, '/nyhedsbreve'), {nyhedsbreve: smartlink.pid, location_id: smartlink.lid});
        } else {
          backend.mdbapi(http_method, ''.concat('/users/', smartlink.ekstern_id, '/nyhedsbreve/', smartlink.pid, '?location_id=', smartlink.lid));
        }
      }

      // Interests
      if (smartlink.iid) {
        if (smartlink.iid instanceof Array) {
          backend.mdbapi(http_method, ''.concat('/users/', smartlink.ekstern_id, '/interesser'), {nyhedsbreve: smartlink.iid, location_id: smartlink.lid});
        } else {
          backend.mdbapi(http_method, ''.concat('/users/', smartlink.ekstern_id, '/interesser/', smartlink.iid, '?location_id=', smartlink.lid));
        }
      }

      callback();
    });

  } else if (smartlink.flow === 'doubleopt') {

    var payload = copyUserData(smartlink);

    if (smartlink.nid) {
      if (smartlink.nid instanceof Array) {
        payload.nyhedsbreve = smartlink.nid;
      } else {
        payload.nyhedsbreve = [smartlink.nid];
      }
    }

    if (smartlink.pid) {
      if (smartlink.pid instanceof Array) {
        payload.nyhedsbreve = payload.nyhedsbreve.concat(smartlink.pid)
      } else {
        payload.nyhedsbreve.push(smartlink.pid);
      }
    }

    if (smartlink.iid) {
      if (smartlink.iid instanceof Array) {
        payload.interesser = smartlink.iid;
      } else {
        payload.interesser = [smartlink.iid];
      }
    }

    backend.mdbapi('POST', '/doubleopt', payload, function (err, result) {
      if (err) {
        console.log('PATCH users error', err);
        callback(err);
      } else {
        callback();
      }
    });

  } else {
    var message = 'Smartlink is not supported.';
    console.log(message, smartlink)
    callback(Boom.badRequest(message));
  }
}

function copyUserData (obj) {
  var temp = {};
  append(obj, 'email');
  append(obj, 'user_id', 'ekstern_id');
  append(obj, 'id', 'ekstern_id');
  append(obj, 'ekstern_id');
  append(obj, 'lid', 'location_id');
  append(obj, 'fornavn');
  append(obj, 'efternavn');
  append(obj, 'co_navn');
  append(obj, 'vejnavn');
  append(obj, 'husnummer');
  append(obj, 'husbogstav');
  append(obj, 'etage');
  append(obj, 'sidedoer');
  append(obj, 'stednavn');
  append(obj, 'bynavn');
  append(obj, 'postnummer');
  append(obj, 'postnummer_dk');
  append(obj, 'land');
  append(obj, 'firma');
  append(obj, 'firma_adresse');
  append(obj, 'lande_kode');
  append(obj, 'udland_flag');
  append(obj, 'alder');
  append(obj, 'foedselsaar');
  append(obj, 'foedselsdato');
  append(obj, 'koen');
  append(obj, 'telefon');
  append(obj, 'brugernavn');
  append(obj, 'adgangskode');
  append(obj, 'komvej_kode');
  append(obj, 'vilkaar');
  append(obj, 'status_kode');
  append(obj, 'bbs_abo_nr');
  append(obj, 'mol_bbs_nr');
  append(obj, 'robinson_flag');
  append(obj, 'active');
  return temp;

  function append(objA, field, alias) {
    if (alias === '' || alias === undefined)
      alias = null;

    var y = objA[field];
    if (y!== undefined && y !== null && y !== '') {
      temp[alias !== null ? alias : field] = y;
    }
  }
}
