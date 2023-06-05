const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const UserModel = require('../models/user.js');
 
 const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден' // правильно писать 'неверный логин или пароль'
        });
      }
  
      const isValidPass = await bcrypt.compare(password, user._doc.passwordHash);// сравнение пароля введенного пользователем с паролем хранящемся в базе
  
      if (!isValidPass) {
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
  
      const { passwordHash, ...userData } = user._doc
      res.json({
        userData, token
      })
  
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Не удолось авторизироваться'
      });
    }
  }

  const register = async (req, res) => {

    try {
      const { email, password, fullName, avatarURL } = req.body;
      const salt = await bcrypt.genSalt(10); // генерация алгоритма шифрования пароля
      const hash = await bcrypt.hash(password, salt); // Шифрование пароля
  
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
  
      await user.save(); // сохранение пользователя в БД
  
      const token = jwt.sign(
        {
          _id: user._id,
        },
        'secret123',
        {
          expiresIn: '30d',
        });
  
      const { passwordHash, ...userData } = user._doc
      res.json({
        userData, token
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Не удалось зарегистрироваться'
      })
    }
  
  }

  const getMe = async (req, res) => {
    try {
      const user = await UserModel.findById(req.userId);
  
      if(!user) {
        return res.status(404).json({
          message: "Пользователь не найден"
        })
      }
  
      const { passwordHash, ...userData } = user._doc
      res.json(userData);
      
    } catch (error) {
      console.log(error);
      res.status(403).json({
        message: 'Нет доступа'
      })
    }
  }

  module.exports = {
    login,
    register,
    getMe
  }