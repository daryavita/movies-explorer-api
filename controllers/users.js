const bcrypt = require('bcryptjs');
const { generateToken } = require('../middlewares/auth');
const User = require('../models/user');
const ValidationError = require('../errors/Validation-err');
const NotFoundError = require('../errors/Not-found-err');
const ConflictError = require('../errors/Conflict-err');
const AuthError = require('../errors/Auth-err');

const saltRounds = 10;
const MONGO_DUPLICATE_KEY_CODE = 11000;

const getUserProfile = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => res.send(user))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { id } = req.user;
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_KEY_CODE) {
        next(new ConflictError('Этот email уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные при обновлении пользователя'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, saltRounds).then((hash) => {
    User.create({
      name,
      email,
      password: hash,
    })
      .then((user) => {
        const resUser = {
          name: user.name,
          email: user.email,
          _id: user._id,
        };

        res.send(resUser);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new ValidationError('Некорректные данные при создании пользователя'));
        } else if (err.code === MONGO_DUPLICATE_KEY_CODE) {
          return next(new ConflictError('Этот email уже зарегистрирован'));
        }
        return next(err);
      });
  })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Email или пароль неверный');
      }

      const isPasswordValid = bcrypt.compare(password, user.password);

      return Promise.all([isPasswordValid, user]);
    })
    .then(([isPasswordValid, user]) => {
      if (!isPasswordValid) {
        throw new AuthError('Email или пароль неверный');
      }
      return generateToken({ id: user._id });
    })
    .then((token) => res.send({ token }))
    .catch(next);
};

module.exports = {
  updateUser,
  getUserProfile,
  createUser,
  login,
};
