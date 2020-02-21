FROM node:10.17-alpine

MAINTAINER Daniel Kokott <dako@berlingskemedia.dk>

# Set the working directory.
WORKDIR /app

# Copying the code into image. Be aware no config files are including.
COPY ./node_modules /app/node_modules
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
