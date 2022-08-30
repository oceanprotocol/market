FROM node:16

RUN apt-get update

COPY . /ocean-market
WORKDIR /ocean-market

RUN npm install

ENTRYPOINT ["npm", "run", "start"]
