const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { userRouter } = require('./routes/users');
const { movieRouter } = require('./routes/movies');
const { putError } = require('./middlewares/errors');
const { login, createUser } = require('./controllers/users');
const { isAuthorized } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/Not-found-err');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.use('/users', isAuthorized, userRouter);
app.use('/movies', isAuthorized, movieRouter);

app.use(errorLogger);

app.use(isAuthorized, (req, res, next) => next(new NotFoundError('Такая страница не найдена')));

app.use(errors());

app.use(putError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
