const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('./models/user.js');

const registerValidation = require('./validations/auth.js');
const { validationResult } = require('express-validator');

const app = express();

app.set('view engine', 'ejs');

const PORT = 3000;

const db = 'mongodb+srv://Anton:*em)9O8RV9@cluster0.popjz.mongodb.net/full_stask_blog?retryWrites=true&w=majority';

mongoose.connect(db)
  .then(() => console.log('DB connected!!!'))
  .catch((e) => console.log(e))

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

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await UserModel.findOne({ email, })

  if(!user) {
    return res.status(404).json({ 
      message: 'Пользователь не найден' // правильно писать 'неверный логин или пароль'
     });
  }

  const isValidPass = await bcrypt.compare(password, user._doc.passwordHash);

  if(!isValidPass) {
    return res.status(400).json({ 
      message: 'Неверный логин или пароль'
     });
  }

  const token = jwt.sign(
    {
      _id: user._id,
    },
    'secret123',
    {
      expiresIn: '30d',
    })

  const {passwordHash, ...userData} = user._doc
  res.json({
    userData, token
  })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удолось авторизироваться'
    })
  }
});

app.post('/auth/register', registerValidation, async (req, res) => {

  try {
    const { email, password, fullName, avatarURL } = req.body
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const user = new UserModel({
      email,
      passwordHash: hash,
      fullName,
      avatarURL
    })

    await user.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      })

    const {passwordHash, ...userData} = user._doc
    res.json({
      userData, token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться'
    })
  }

});

app.use((req, res) => { // Приведенный код определяет промежуточную функцию, использующую метод app.use() для обработки определенного цикла запрос-ответ для ошибки HTTP 404.
  const title = 'Error Page';
  res
    .status(404)
    .render('error', { title });
});