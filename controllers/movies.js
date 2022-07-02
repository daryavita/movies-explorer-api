const Movie = require('../models/movie');

const ForbiddenError = require('../errors/Forbidden-err');
const NotFoundError = require('../errors/Not-found-err');
const ValidationError = require('../errors/Validation-err');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      next(err);
    });
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user.id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      const owner = movie.owner.toString();
      if (owner !== req.user.id) {
        throw new ForbiddenError('Вы не можете удалить чужой фильм');
      }
      return Movie.findByIdAndRemove(req.params._id).then(() => {
        res.send({ message: 'Фильм удален' });
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getMovies,
  deleteMovie,
  createMovie,
};