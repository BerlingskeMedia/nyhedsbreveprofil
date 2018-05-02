# Nyhedsbreveprofil

This is the customer-facing part of the newsletter application portfolio, which
covers functionality for signing up to newsletters as a new user, and making
changes to newsletter subscriptions as well as personal profile information.


## Technology Stack

- React.js
- Less.js
- Hapi.js
- Webpack


## Description

The application is mostly a frontend and doesn't have its own database. Instead,
it communicates with MDBAPI via a basic proxy middleware written in `Hapi.js`.


## For Developers

You'll need a recent version of node.js, _v4.2.2 or newer_. You'll need to setup
the following environment variables before you start;

```bash
export NODE_ENV="development"
export TZ="Europe/Copenhagen"
export MDBAPI_ADDRESS=mdbapi.bemit.dk
export MDBAPI_PORT=80

# variables consumed by mine-data web application
export API_URL=http://localhost:8082
export GIGYA_API_KEY=5__cAWpT5nWdkxSuly0T2OJd2svumYf1dvKWweeUeUddlIrbgnoZLzxxtky7eQasdASDAsd
```

These can of course be reconfigured as required. You'll also need `bower.js`, if
you don't have it already. Webpack is not a prerequisite as it will be installed
with the application itself.


You can build the application by running;

```
npm install && bower update
```

There's a simple node-based web server included that can serve the application
as static files. Simply run;

```
gulp start_server
```

You'll also need to watch the frontend files for changes so Webpack will rebuild
them automatically;

```
gulp start_webpack
```


## Deploying to Production

When merging changes into the `master` branch on GitHub, Jenkins will
automatically build and a Docker image.

The release to `ta-docker-mdb-as` is currently done manually.

When the build in Jenkins is promoted,

Deployment time varies, but is somewhere between 5-15 minutes after the build
has finished in Jenkins.

## Mine data (GSP)

The webpages on `/mine-data` is the GDPR Self-service Page (GSP).

### ZenDesk

ZenDesk API documentation:

* [API introduction](https://developer.zendesk.com/rest_api/docs/core/introduction)
* [API tickets](https://developer.zendesk.com/rest_api/docs/core/tickets)


The following code snippet explains how to create a ticket in the code:

```
const Zendesk = require('./server/api_consumers/zendesk_client');

const firstCommentBody = 'This is the body-content of the first public comment.\n \
            This means that the user gets this in an auto reply.\n \
            \n \
            I have requested insight into the following data:\n \
            - Abonnementsregister\n \
            - Internt produktionsregister til rapportering mv.\n \
            - Register for markedsundersøgelser, quizzer, spørgeundersøgelser og konkurrencer\n \
            \n \
            Thank you';

const newTicket = {
  subject: 'This is the subject - also email subject',
  comment: {
    body: firstCommentBody
  },
  custom_fields: [
    {
      "id": 360003795594,
      "value": "Kanye West"
    },
    {
      "id": 360003774853,
      "value": "Pilestræde 34\nDK-1147 København K"
    },
    {
      "id": 360003795614,
      "value": "kanyewest@northpole.int"
    },
    {
      "id": 360003718633,
      "value": "12345678"
    },
    {
      "id": 360004449334,
      "value": "17e3f9338f42ed83785b9549f68148d7"
    },
    {
      "id": 360003718813,
      "value": [
        "abonnement",
        "annoncering",
        "markedsundersogelse",
        "kundeservice",
        "rapportering",
        "tracking"
      ]
    }
  ],
  requester: {
    name: 'Kanye West',
    email: 'kanyewest@northpole.int'
  }
};

Zendesk.createTicket(newTicket)
.then(response => {
  console.log(response);
})
.catch(err => {
  console.error(err);
});

```

#### Ticket custom fields

| ID | Name | Type | Comment |
| --- | --- | --- | --- |
| 114101503914 | Kontakt årsag (Contact reason) | Drop-down | |
| 114102932874 | Regning (Payment) | Drop-down | |
| 360000605233 | Ordrenummer (Order number) | Numeric | |
| 360003795594 | Navn (Name) | Text | |
| 360003795614 | E-mail | Text | |
| 360003718633 | Telefonnummer (Telephone number) | Text | |
| 360003774853 | Adresse (Address) | Multi-line | |
| 360004449334 | Ekstern ID | Text | |
| 360003718813 | System | Multi-select |  Possible values: *Abonnement* (abonnement), *Annoncering* (annoncering), *Kundeservice* (kundeservice), *Markedsundersøgelse* (markedsundersogelse), *Rapportering* (rapportering), *Sweetdeal og Shops* (sweetdeal_og_shops), *Telemarketing* (telemarketing), *Tracking* (tracking) |
