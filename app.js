const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const { userRouter } = require('./routes/users');
const { movieRouter } = require('./routes/movies');
const { putError } = require('./middlewares/errors');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('/users', userRouter);
app.use('/movies', movieRouter);

app.use(putError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
