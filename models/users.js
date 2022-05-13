const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getMyInfo, getUserById, createUser, updateProfile, updateAvatar,
} = require('../controllers/users');
const regExp = require('../regExp/regExp');

router.get('/users', getUsers);
router.get('/users/me', getMyInfo);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regExp),
  }),
}), updateAvatar);

router.post('/users', createUser);

module.exports = router;
