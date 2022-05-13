const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

module.exports.getUsers = (req, res) => User.find({})
  .then((users) => res.send(users));

module.exports.getUserById = (req, res) => User.findById(req.params.userId)
  .then((user) => {
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: `Пользователь с указанным _id: ${req.params.userId} не найден.` });
    }
  });

module.exports.getMyInfo = (req, res) => User.findById(req.user._id)
  .then((user) => { res.status(200).send(user); });

module.exports.createUser = (req, res) => {
  const {
    name, avatar, about, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, avatar, about, email, password: hash,
    }))
    .then((user) => res.send(user));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send(user);
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // пользователь не найден — отклоняем промис
        // с ошибкой и переходим в блок catch
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        Promise.reject(new Error('Неправильные почта или пароль'));
      } else {
        const token = jwt.sign({ _id: User._id }, 'some-secret-key', { expiresIn: '7d' });
        res.status(201).send({ token });
      }
    });
};
