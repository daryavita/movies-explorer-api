const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validateURL = require('../middlewares/validator');

const {
  getMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().custom(validateURL),
      trailer: Joi.string().required().custom(validateURL),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      thumbnail: Joi.string().required().custom(validateURL),
      movieId: Joi.string().required(),
    }),
  }),
  createMovie,
);

router.delete(
  '/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().alphanum().length(24),
    }),
  }),
  deleteMovie,
);

module.exports.movieRouter = router;