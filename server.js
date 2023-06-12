const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const checkToken = require('./utils/checkToken.js');
const {registerValidation, loginValidation, postValidation} = require('./validation.js');
const {login, register, getMe} = require('./controllers/userController.js');
const { createPost, getAllPosts, getPost, removePost, updatePost } = require('./controllers/postController.js'); 


const app = express();

app.set('view engine', 'ejs');

const PORT = 3000;

const db = 'mongodb+srv://Anton:*em)9O8RV9@cluster0.popjz.mongodb.net/full_stask_blog?retryWrites=true&w=majority';

mongoose.connect(db)
  .then(() => console.log('DB connected!!!'))
  .catch((e) => console.log(e));

app.listen(PORT, (error) => { // запуск сервера на указанном порту
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(express.urlencoded({ extended: false }));

app.use(express.static('views'));

// app.use((req, res, next) => { // Middleware показывающее по какому пути прошли, и какой метод был использован
//   console.log(`METHOD: ${req.method} URL REQ: ${req.url}`);
//   next();
// });

app.use(methodOverride('_method'));

app.get('/', (req, res) => { // рендер домашней страницы
  const title = 'Home';
  res.render('index', { title });
});

app.post('/auth/login', loginValidation, login);
app.post('/auth/register', registerValidation, register);
app.get('/auth/me', checkToken, getMe);

app.get('/posts', getAllPosts);
app.get('/posts/:id', getPost);
app.post('/posts', checkToken, postValidation, createPost);
app.delete('/posts/:id', checkToken, removePost);
app.patch('/posts/:id', checkToken, updatePost);

app.use((req, res) => { // Приведенный код определяет промежуточную функцию, использующую метод app.use() для обработки определенного цикла запрос-ответ для ошибки HTTP 404.
  const title = 'Error Page';
  res
    .status(404)
    .render('error', { title });
});