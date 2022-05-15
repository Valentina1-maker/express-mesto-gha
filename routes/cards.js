const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regExp = require('../regExp/regExp');

const {
  getCards, deleteCardById, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteCardById);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regExp),
  }),
}), createCard);
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), likeCard);
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), dislikeCard);

module.exports = router;
