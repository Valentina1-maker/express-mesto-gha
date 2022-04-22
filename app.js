const express = require('express');
const mongoose = require('mongoose');

const { userSchema } = require('./post');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
app.post('/', async (req, res) => {
  try {
    const { name, avatar, about } = req.body;
    const user = await userSchema.create({ name, avatar, about });
    // eslint-disable-next-line no-console
    console.log(req.body);
    res.json(user);
  } catch (e) {
    res.status(500).json(e);
  }
});

async function startApp() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Ссылка на сервер: http://localhost:${PORT}`);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

startApp();

// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// });

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     minlength: 2,
//     maxlength: 30,
//   },
//   avatar: {
//     type: String,
//     required: true,
//   },
//   about: {
//     type: String,
//     required: true,
//     minlength: 2,
//     maxlength: 30,
//   },
// });

// module.exports = mongoose.model('user', userSchema);

// const cardSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     minlength: 2,
//     maxlength: 30,
//   },
//   link: {
//     type: String,
//     required: true,
//   },
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'user',
//     required: true,
//   },
//   likes: {
//     type: [mongoose.Schema.Types.ObjectId],
//     ref: 'user',
//     default: [],
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('card', cardSchema);
