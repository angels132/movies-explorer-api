require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimiter');

const router = require('./routes/index');

const errorHandler = require('./middlewares/errorHandler');

const { MONGODB_URL } = require('./utils/config');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(helmet());

mongoose.set('strictQuery', true);
mongoose.connect(MONGODB_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(limiter);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
