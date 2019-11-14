FROM node:12-alpine

RUN mkdir -p /opt && mkdir -p /opt/reflib

ADD . /opt/reflib

WORKDIR /opt/reflib

RUN npm install && npm run client:build

CMD ["npm", "run", "server:start"]
