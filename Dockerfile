FROM node:16.14
COPY . /market
RUN chown -R node /market
WORKDIR /market
USER node
RUN npm install
