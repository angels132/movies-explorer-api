const express = require('express');
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/moviesdb')
  .then(() => {
    console.log('Соединение с MongoDB установлено');
  })
  .catch((err) => console.log(`Возникла ошибка при соединении с MongoDB: ${err}`));

const app = express();

const { PORT = 3000 } = process.env;

app.listen(PORT, (err) => {
  err ? console.log(`В процессе соединения с портом возникла ошибка: ${err}`) : console.log(`Соединение с портом № ${PORT} успешно установлено`);
});