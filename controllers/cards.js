const Card = require('../models/card');
const BadRequestError = require("../errors/bad-request-err");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send( {data: cards} ))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};


module.exports.deleteCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .then(card => res.send({ message: `Карточка c _id: ${req.params.cardId} успешно удалена.` }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body
  Card.create({ name, link, owner: req.user._id})
    .then(card => res.send({ card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(" ")}`));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)