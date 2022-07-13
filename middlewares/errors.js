const putError = (err, req, res, next) => {
  if (err.statusCode) {
    return res
      .status(err.statusCode)
      .send({ message: err.message || 'Что-то пошло не так' });
  }
  res.status(500).send({ message: 'Ошибка сервера' });
  return next(err);
};

module.exports = { putError };
