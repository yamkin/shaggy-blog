const { body } = require('express-validator');

const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
];

const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('fullName').isLength({ min: 3 }),
    body('avatarURL').optional().isURL()
];

const postValidation = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
    body('tags', 'Неверный формат тегов (укажите массив)').optional().isArray(),
    body('imageURL', 'Неверная ссылка на изображение').optional().isString()
];

module.exports = {
    registerValidation,
    loginValidation,
    postValidation
};