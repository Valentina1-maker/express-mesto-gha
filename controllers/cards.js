const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId, { runValidators: true })
    .then((result) => {
      if (result) {
        res.send({message: `Карточка c _id: ${req.params.cardId} успешно удалена.` })
      } else {
        res.status(404).send({ message: 'Карточки с таким id несуществует' });
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({message: 'Произошла ошибка'})
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body

  Card.create({ name, link, owner: req.user._id })
    .then(card => {
      // eslint-disable-next-line no-console
      console.log(card)
      res.send({ card })
    })
    .catch((e) => {
      if (e.errors && Object.keys(e.errors).length) {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({message: 'Произошла ошибка'})
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
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
  const { cardId } = req.params

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
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