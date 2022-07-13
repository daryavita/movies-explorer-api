const routers = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { userRouter } = require('./users');
const { movieRouter } = require('./movies');
const { isAuthorized } = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/Not-found-err');

routers.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

routers.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

routers.use('/users', isAuthorized, userRouter);
routers.use('/movies', isAuthorized, movieRouter);
routers.use(isAuthorized, (req, res, next) => next(new NotFoundError('Такая страница не найдена')));

module.exports = { routers };
