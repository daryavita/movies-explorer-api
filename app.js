require('dotenv').config();
const express = require('express');

const { PORT = 3001 } = process.env;
const { NODE_ENV, DB_CONNECTION } = process.env;
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { routers } = require('./routes/index');
const { putError } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rateLimit');
const { mongoUrl, corsOptions } = require('./utils/utils');

const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB_CONNECTION : mongoUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(limiter);

app.use('/', routers);

app.use(errorLogger);

app.use(errors());

app.use(putError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
