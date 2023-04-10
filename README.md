# npc-achievement bot

## folders

### bot-achievements

The discord bot. uses le intern www-api

### www-api

The not exposed, npc-achievements api

### www-front

Nuxt3 website with front and back.
Nuxt backend uses www-api internally

## Docker

### Setup docker compose file

cp docker-compose.sample.yml docker-compose.yml
nano docker-compose.yml

-> check/change volume for api service /data
-> check/change services names, ports

### Setup env files

cp bot_achievements/.env.sample bot_achievements/.env
nano bot_achievements/.env

-> setup bot token, version, client id , guild id, etc

### Create and run

docker compose up -d --force-recreate --build

### Check logs

docker compose logs --follow
