/*jshint node: true */
'use strict';

const Boom = require('boom');
const bpc = require('./bpc_client');

module.exports.register = function (server, options, next) {

  server.state('console_ticket', {
    // ttl: 1000 * 60 * 60 * 24 * 30, // (one month)
    ttl: null, // session time-life - cookies are deleted when the browser is closed
    isHttpOnly: false,
    isSecure: false,
    // isSameSite: false,
    path: '/',
    encoding: 'base64json'
  });

  server.route({
    method: 'POST',
    path: '/',
    config: {
      cors: false,
      state: {
        parse: true,
        failAction: 'log'
      }
    },
    handler: userTicketHandler
  });

  server.route({
    method: 'DELETE',
    path: '/',
    config: {
      cors: false,
      state: {
        parse: true,
        failAction: 'log'
      }
    },
    handler: function(request, reply) {
      // This is not a global signout.
      reply()
        .unstate('console_ticket');
    }
  });

  next();
};


module.exports.register.attributes = {
  name: 'tickets',
  version: '1.0.0'
};

function userTicketHandler(request, reply) {
  if (request.payload && request.payload.rsvp) {

    bpc.getUserTicket(request.payload.rsvp, function (err, userTicket){
      console.log('getUserTicket', err, userTicket);
      if (err){
        return reply(err);
      }

      reply(userTicket)
        .state('console_ticket', userTicket);
    });

  } else if (request.state && request.state.console_ticket) {

    bpc.reissueTicket(request.state.console_ticket, function (err, reissuedTicket){
      if (err) {
        return reply(err);
      }
      reply(reissuedTicket)
        .state('console_ticket', reissuedTicket);
    });

  } else {

    reply(Boom.badRequest());

  }
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

module.exports.readTicket = function (){
  var ticket = readCookie('console_ticket');
  return ticket !== null ? JSON.parse(window.atob(ticket)): null;
}
