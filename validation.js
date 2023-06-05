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
    body('title').isEmail(),
    body('text').isLength({ min: 5 }),
    body('author').isLength({ min: 3 }),
    body('avatarURL').optional().isURL()
];

module.exports = {
    registerValidation,
    loginValidation,
    postValidation
};