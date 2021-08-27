##
## Copyright 2021 Ocean Protocol Foundation
## SPDX-License-Identifier: Apache-2.0
##
FROM ubuntu:18.04
FROM node:latest
LABEL maintainer="Ocean Protocol <devops@oceanprotocol.com>"

ARG VERSION

RUN apt-get update && apt-get install -y -q --no-install-recommends \
    	curl && \
    rm -rf /var/lib/apt/lists/*

ENV NVM_DIR /usr/local/nvm
ENV NVM_VERSION 0.38.0
ENV NODE_VERSION 16.0.0

RUN mkdir -p ${NVM_DIR} \ 
    && curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v${NVM_VERSION}/install.sh | bash

RUN . ${NVM_DIR}/nvm.sh \
  && nvm install ${NODE_VERSION} \
  && nvm alias default ${NODE_VERSION} \
  && nvm use default

ENV NODE_PATH ${NVM_DIR}/v${NODE_VERSION}/lib/node_modules
ENV PATH ${NVM_DIR}/versions/node/v${NODE_VERSION}/bin:$PATH

COPY . /ocean-market
WORKDIR /ocean-market

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install && \
    npm update -g && \
    cp .env.example .env
    
ENTRYPOINT ["npm", "start"]

EXPOSE 8000
