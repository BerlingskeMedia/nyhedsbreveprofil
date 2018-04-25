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

When merging changes into the `Production` branch on GitHub, Jenkins will
automatically build and deploy the Docker images for that release.

Deployment time varies, but is somewhere between 5-15 minutes after the build
has finished in Jenkins.
