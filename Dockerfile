MAINTAINER Daniel Kokott <dako@berlingskemedia.dk>


FROM node:10.17-alpine as build

WORKDIR /build

ADD package.json /build
COPY ./mine-data /build/mine-data
ADD webpack.mine-data.config.js /build
COPY ./opdatering /build/opdatering
ADD webpack.opdatering.config.js /build
ADD .babelrc /build

RUN npm i
RUN npm i -g webpack@3.11.0


FROM node:10.17-alpine

# Set the working directory.
WORKDIR /app

COPY --from=build /build/mine-data /app/mine-data
COPY --from=build /build/opdatering /app/opdatering
COPY ./nyhedsbreve /app/nyhedsbreve
COPY ./server /app/server
ADD package.json /app

RUN npm i --production

# Exposing our endpoint to Docker.
EXPOSE  8000

# When starting a container with our image, this command will be run.
CMD ["node", "server/index.js"]
