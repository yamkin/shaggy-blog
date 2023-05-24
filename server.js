const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app  = express();

app.set('view engine', 'ejs');

const PORT = 3000;

app.listen(PORT, (error) => { // запуск сервера на указанном порту
    error ? console.log(error) : console.log(`listening port ${PORT}`);
  });

app.use(express.urlencoded({ extended: false }));

app.use(express.static('views'));

app.use((req, res, next) => { // Middleware показывающее по какому пути прошли, и какой метод был использован
    console.log(`METHOD: ${req.method} URL REQ: ${req.url}`);
    next();
  });

app.use(methodOverride('_method'));

app.get('/', (req, res) => { // рендер домашней страницы
  const title = 'Home';
  res.render('index', { title });
});

app.use((req, res) => { // Приведенный код определяет промежуточную функцию, использующую метод app.use() для обработки определенного цикла запрос-ответ для ошибки HTTP 404.
  const title = 'Error Page';
  res
    .status(404)
    .render('error', { title });
});