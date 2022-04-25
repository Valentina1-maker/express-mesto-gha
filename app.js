const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use("/", require("./routes/users"));
app.use("/", require("./routes/cards"));
app.use((req, res, next) => {
  req.user = {
    _id: '62665b28d6891543a9192150'
  };

  next();
});

app.use((req, res) => {
  res.status(404).send({message: 'Страница не найдена'});
})

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: http://localhost:${PORT}`);
});

