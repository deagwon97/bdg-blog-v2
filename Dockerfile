FROM node:18 AS builder
LABEL builder=true
RUN npm install -g npm@9.3.1
RUN npm install -g prisma@5.1.1
COPY ./src /workdir/src
WORKDIR /workdir/src
RUN yarn install
# for e2e test by playwright
RUN yarn playwright install-deps
# for prisma type generation
RUN prisma generate
# build project
RUN yarn build
RUN apt update -y
# for visualizing project dependency
RUN apt install graphviz -y

FROM node:18 AS server
LABEL builder=false
WORKDIR /build
COPY --from=builder /workdir/src/package*.json /build
COPY --from=builder /workdir/src/next.config.js /build
COPY --from=builder /workdir/src/.next /build/.next
COPY --from=builder /workdir/src/public /build/public
COPY --from=builder /workdir/src/node_modules /build/node_modules
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]