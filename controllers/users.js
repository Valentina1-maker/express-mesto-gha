const User = require('../models/users');
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUsersById = (req, res, next) => {
  User.findById(req.params.userId)
    .then(users => res.send({ data: users }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else if (err.message === "IncorrectID") {
        next(new NotFoundError(`Карточка с указанным _id: ${req.params.userId} не найдена.`));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, avatar, about } = req.body
  User.create({ name, avatar, about })
    .then(users => res.send({ data: users }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(" ")}`));
      } else {
        next(err);
      }
    });
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
