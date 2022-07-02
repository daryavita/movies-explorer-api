const User = require('../models/user');

const ValidationError = require('../errors/Validation-err');
const NotFoundError = require('../errors/Not-found-err');
// const ConflictError = require('../errors/Conflict-err');
// const AuthError = require('../errors/Auth-err');

const getUserProfile = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => res.send(user))
    .catch((err) => {
      next(err);
    });
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
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные при обновлении пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  updateUser,
  getUserProfile,
};
