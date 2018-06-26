FROM ubuntu:14.04

MAINTAINER Daniel Kokott <dako@berlingskemedia.dk>

# Installing wget - needed to download node.js
RUN apt-get update
RUN apt-get install -y wget

ENV NODE_VERSION v6.10.3

# Downloading and installing Node.
RUN wget -O - https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-linux-x64.tar.gz \
    | tar xzf - --strip-components=1 --exclude="README.md" --exclude="LICENSE" \
    --exclude="ChangeLog" -C "/usr/local"

# Set the working directory.
WORKDIR /app

# Copying the code into image. Be aware no config files are including.
COPY ./mine-data /app/mine-data
COPY ./node_modules /app/node_modules
COPY ./nyhedsbreve /app/nyhedsbreve
COPY ./opdatering /app/opdatering
COPY ./server /app/server

# Exposing our endpoint to Docker.
EXPOSE  8000

# When starting a container with our image, this command will be run.
CMD ["node", "server/index.js"]
