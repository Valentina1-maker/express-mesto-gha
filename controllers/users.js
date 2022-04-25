const User = require('../models/users');



module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .then(users => res.send({ data: users }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: 'Переданы некорректные данные'});
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar, about } = req.body
  User.create({ name, avatar, about })
    .then(users => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя'});
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    })
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id,
    { avatar })
    .then((user) => { res.status(200).send(user); })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
  };

  module.exports.updateProfile = (req, res) => {
    const { name, about } = req.body;
    User.findByIdAndUpdate(req.user._id,
      { name, about })
      .then((user) => { res.status(200).send(user); })
      .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
  };
