const mongoUrl = 'mongodb://127.0.0.1:27017/moviesdb';

const jwtSecret = '12341234';

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://explore.movies.nomoredomains.sbs',
    'https://explore.movies.nomoredomains.sbs',
  ],
  optionsSuccessStatus: 200,
};

module.exports = {
  mongoUrl,
  jwtSecret,
  corsOptions,
};
