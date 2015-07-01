FROM ubuntu:14.04

MAINTAINER Daniel Kokott <dako@berlingskemedia.dk>

# Installing wget - needed to download node.js
RUN apt-get update
RUN apt-get install -y wget

# Downloading and installing Node.
RUN wget -O - http://nodejs.org/dist/v0.12.0/node-v0.12.0-linux-x64.tar.gz \
    | tar xzf - --strip-components=1 --exclude="README.md" --exclude="LICENSE" \
    --exclude="ChangeLog" -C "/usr/local"

# Set the working directory.
WORKDIR /nyhedsbreve

# Copying the code into image. Be aware no config files are including.
COPY ./client /nyhedsbreve/client
COPY ./node_modules /nyhedsbreve/node_modules
COPY ./src /nyhedsbreve/src

# Exposing our endpoint to Docker.
EXPOSE  8000

# When starting a container with our image, this command will be run.
CMD ["node", "src/server.js"]