FROM node:12-alpine

RUN apk add --no-cache yarn --repository="http://dl-cdn.alpinelinux.org/alpine/edge/community" 

ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package.json .

RUN yarn install

COPY . ./