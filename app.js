const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const bodyParser = require('body-parser');
const { userRouter } = require('./routes/users');
const { movieRouter } = require('./routes/movies');
const { putError } = require('./middlewares/errors');
const { login, createUser } = require('./controllers/users');
const { isAuthorized } = require('./middlewares/auth');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.use(putError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
