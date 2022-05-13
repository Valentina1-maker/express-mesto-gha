const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());

const {
  celebrate, Joi, errors: celebrateError, Segments,
} = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const regExp = require('./regExp/regExp');
const errorHandler = require('./middlewares/error');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', login);
app.post(
  '/signup',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().min(2).max(30),
      email: Joi.string().email(),
      about: Joi.string().min(2).max(30),
      password: Joi.string().required().min(8),
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

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Ссылка на сервер: http://localhost:${PORT}`);
});
