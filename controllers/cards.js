const CommonError = require('../errors/CommonError');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new CommonError(404, 'Карточки с таким id не существует'))
    .then((card) => {
      if (String(card.owner._id) !== req.user._id) {
        return next(new CommonError(403, 'Эта карточка не Ваша и удалить ее не можете'));
      }
      return card.remove()
        .then(() => res.send({ message: 'Карточка успешно удалена' }));
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new CommonError(400, 'Переданы некорректные данные'));
      } else {
        next(new Error());
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ card });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new CommonError(400, 'Переданы некорректные данные'));
      } else {
        next(new Error());
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send([card]);
      } else {
        next(new CommonError(404, 'Карточка с указанным _id не найдена.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CommonError(400, 'Переданы некорректные данные'));
      } else {
        next(new Error());
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send([card]);
      } else {
        next(new CommonError(404, 'Карточка с указанным _id не найдена.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CommonError(400, 'Переданы некорректные данные'));
      } else if (err.message === 'IncorrectID') {
        next(new CommonError(404, 'Карточка с указанным _id не найдена.'));
      } else {
        next(new Error());
      }
    });
};
