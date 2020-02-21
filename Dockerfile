FROM node:10.17-alpine

MAINTAINER Daniel Kokott <dako@berlingskemedia.dk>

# Set the working directory.
WORKDIR /app

COPY ./mine-data /app/mine-data
COPY ./nyhedsbreve /app/nyhedsbreve
COPY ./opdatering /app/opdatering
COPY ./server /app/server

RUN npm i --production

RUN webpack --config webpack.mine-data.config.js
RUN webpack --config webpack.opdatering.config.js

# Exposing our endpoint to Docker.
EXPOSE  8000

# When starting a container with our image, this command will be run.
CMD ["node", "server/index.js"]
