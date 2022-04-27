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
    .then(user => res.send(user))
    .catch((err) => {
     if (err.message === "IncorrectID") {
        res.status(404)(`Пользователь с указанным _id: ${req.params.userId} не найден.`);
      }
        res.status(500).send({ message: 'Произошла ошибка' });
    })
};


module.exports.createUser = (req, res) => {
  const { name, avatar, about } = req.body
  User.create({ name, avatar, about })
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    })
};

module.exports.updateAvatar = (req, res) => {
  const { avatar, id: _id } = req.body;
  User.findByIdAndUpdate(_id,
    { avatar }, {new: true})
    .then((user) => { res.status(200).send(user); })
    .catch((err) => {
      if (err.message === "IncorrectID") {
        res.status(404)(`Пользователь с указанным _id не найден.`);
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    })
};


module.exports.updateProfile = (req, res) => {
  const { name, about, id:_id } = req.body;
  User.findByIdAndUpdate(_id,
    { name, about }, {new: true})
    .then((user) => { res.status(200).send(user); })
    .catch((err) => {
      if (err.message === "IncorrectID") {
        res.status(404)(`Пользователь с указанным _id не найден.`);
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    })
};
