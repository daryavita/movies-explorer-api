const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateUser,
  getUserProfile,
} = require('../controllers/users');

router.get('/me', getUserProfile);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateUser,
);

module.exports.userRouter = router;
