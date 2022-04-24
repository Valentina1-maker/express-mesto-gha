const router = require('express').Router();
const { getUsers, getUsersById } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUsersById);
router.post('./users', createUser)
// router.get("/users/me", getMyInfo);

// router.get("/users/:userId", celebrate({
//   params: Joi.object().keys({
//     userId: Joi.string().length(24).hex(),
//   }),
// }), getUserByID);

module.exports = router;
