FROM node:16-alpine3.12

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
RUN npm install --production
RUN npm install -g pino-pretty

# APP
COPY . .

# REGISTER bot commands
RUN npm run register

# RUN
CMD ["dumb-init", "npm", "run", "bot"]

