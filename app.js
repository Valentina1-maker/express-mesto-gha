const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());

const {
  celebrate, Joi, errors: celebrateError, Segments,
} = require('celebrate');
const CommonError = require('./errors/CommonError');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const regExp = require('./regExp/regExp');
const errorHandler = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.post(
  '/signin',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      about: Joi.string().min(2).max(30),
      password: Joi.string().required(),
      avatar: Joi.string().pattern(regExp),
    },
  }),
  createUser,
);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

// celebrate errors
app.use(celebrateError());

app.use((req, res, next) => {
  next(new CommonError(404, 'Страница не найдена'));
});

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Ссылка на сервер: http://localhost:${PORT}`);
});
