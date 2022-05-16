const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CommonError = require('../errors/CommonError');
const User = require('../models/users');

module.exports.getUsers = (req, res, next) => User.find({})
  .then((users) => res.send(users))
  .catch(next);

module.exports.getUserById = (req, res, next) => User.findById(req.params.userId)
  .then((user) => {
    if (user) {
      res.send(user);
    } else {
      next(new CommonError(404, `Пользователь с указанным _id: ${req.params.userId} не найден.`));
    }
  })
  .catch((e) => {
    if (e.name === 'CastError') {
      next(new CommonError(400, 'Некорректный тип id'));
    } else {
      next(new Error());
    }
  });

module.exports.getMyInfo = (req, res) => User.findById(req.user._id)
  .then((user) => { res.status(200).send(user); });

module.exports.createUser = (req, res, next) => {
  const {
    name, avatar, about, email, password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new CommonError(409, 'Пользователь с указанным email уже есть'));
      }
    })
    .then(() => bcrypt.hash(password, 10))
    .then((hash) => User.create({
      name, avatar, about, email, password: hash,
    }))
    .then((user) => res.send({
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new CommonError(400, 'Переданы некорректные данные'));
      } else {
        next(new Error());
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new CommonError(400, 'Переданы некорректные данные'));
      } else {
        next(new Error());
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        next(new CommonError(404, 'Пользователь с указанным _id не найден.'));
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (user) {
        return [bcrypt.compare(password, user.password), user];
      }
      return Promise.reject(new CommonError(401, 'Неправильные почта или пароль'));
    })
    .then(([matched, user]) => {
      if (matched) {
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
        res.status(200).send({ token });
      } else {
        // хеши не совпали — отклоняем промис
        throw new CommonError(401, 'Неправильные почта или пароль');
      }
    })
    .catch(next);
};
