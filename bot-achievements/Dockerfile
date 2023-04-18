FROM node:18-alpine

ENV NODE_ENV production
ENV LANG C.UTF-8
ENV EDITOR nano
ENV DATA_PATH /data

RUN apk add dumb-init
RUN mkdir /data

# APP dir
WORKDIR /app

# NODE_MODULES
COPY package*.json ./
RUN npm install --omit=dev          
RUN npm install -g pino-pretty

# APP
COPY . .

# REGISTER bot commands
RUN npm run register

# RUN
CMD ["dumb-init", "npm", "run", "start"]

