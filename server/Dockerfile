# syntax=docker/dockerfile:1

ARG NODE_VERSION=24

# ---- Base ----
FROM node:${NODE_VERSION}-alpine AS base
RUN apk --no-cache add dumb-init
RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
&& tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.6.1.tar.gz \
&& rm dockerize-linux-amd64-v0.6.1.tar.gz
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN mkdir tmp

# ---- Development ----
FROM base AS development

COPY --chown=node:node package.json package-lock.json* ./
RUN npm ci

COPY --chown=node:node . .

EXPOSE 8000
CMD ["dumb-init", "node", "ace.js", "serve", "--watch", "--no-clear"]

# ---- Build ----
FROM development AS build
RUN node ace.js build

# ---- Production ----
FROM node:${NODE_VERSION}-alpine AS production
RUN apk add --no-cache dumb-init
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node

COPY --from=build --chown=node:node /home/node/app/build ./
RUN npm ci --omit=dev

EXPOSE 8000
CMD ["dumb-init", "node", "bin/server.js"]
