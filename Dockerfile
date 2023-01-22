FROM node:16 AS builder

COPY ./src /workdir/src

WORKDIR /workdir/src

RUN npm install -g npm@9.1.3 && npm install --global yarn --force && npm install -g prisma

# RUN yarn install

# RUN yarn build
