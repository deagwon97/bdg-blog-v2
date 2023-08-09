FROM node:16 AS builder
LABEL builder=true
RUN apt-get update -y 
RUN apt-get install git -y
RUN npm install -g npm@9.3.1
RUN npm install --global yarn@1.22.19 --force
RUN npm install -g prisma
COPY ./src /workdir/src
WORKDIR /workdir/src
RUN prisma generate
RUN yarn build

FROM node:16 AS server
LABEL builder=false
WORKDIR /build
RUN apt-get update -y 
RUN apt-get install git -y
RUN npm install -g npm@9.3.1
RUN npm install --global yarn@1.22.19 --force
COPY --from=builder /workdir/src/package*.json /build
COPY --from=builder /workdir/src/next.config.js /build
COPY --from=builder /workdir/src/.next /build/.next
COPY --from=builder /workdir/src/public /build/public
COPY --from=builder /workdir/src/node_modules /build/node_modules
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]