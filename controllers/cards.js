const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};


module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(() => res.send({ message: `Карточка c _id: ${req.params.cardId} успешно удалена.` }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link, id: _id } = req.body

  Card.create({ name, link, owner: _id })
    .then(card => res.send({ card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.likeCard = (req, res) => {
  const { userId } = req.body
  const { cardId } = req.params

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send([card]);
      } else {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.'});
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === "IncorrectID") {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.'});
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    })
}

module.exports.dislikeCard = (req, res) => {
  const { userId } = req.body
  const { cardId } = req.params

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send([card]);
      } else {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.'});
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === "IncorrectID") {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.'});
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    })
}