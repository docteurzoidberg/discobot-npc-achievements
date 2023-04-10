require('dotenv').config();

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const middlewares = require('./middlewares/common');
const achievements = require('./routes/achievements');

const api_port = process.env.API_PORT || 5000;
const hostname = process.env.HOSTNAME || 'localhost';
const datapath = process.env.DATA_PATH || './data';

if (!fs.existsSync(datapath + '/achievements'))
  fs.mkdirSync(datapath + '/achievements');

const app = express();
app.use(morgan('combined'));

//allow all origin for other docker containers
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', middlewares.noIndexHandler);
app.use('/achievement', achievements);
app.use(middlewares.errorHandler);

app.listen(api_port, () =>
  console.log(
    `npc-achievements-internal-api listening on port http://${hostname}:${api_port}/ !`
  )
);
