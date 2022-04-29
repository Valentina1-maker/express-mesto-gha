const User = require('../models/users');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    })
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (user) {
        res.send(user)
      } else {
        res.status(404).send({ message: `Пользователь с указанным _id: ${req.params.userId} не найден.` });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный тип id' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка', err });
      }
    })
};

module.exports.createUser = (req, res) => {
  const { name, avatar, about } = req.body
  User.create({ name, avatar, about })
    .then(user => res.send(user))
    .catch((e) => {
      if (e.errors && Object.keys(e.errors).length) {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    })
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(([user]) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === "IncorrectID") {
        res.status(404)(`Пользователь с указанным _id не найден.`);
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    })
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id,{ name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send([user]);
      } else {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.'});
      }
    })
    .catch((err) => {
      if (err.errors && Object.keys(err.errors).length) {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === "IncorrectID") {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.'});
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    })
};