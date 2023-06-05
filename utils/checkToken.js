const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123'); // расшифровка полученного от пользователя токена
            req.userId = decoded._id;
            console.log(req.userId)
            next();
        } catch (error) {
            console.log(error)
            return res
                .status(403)
                .json({
                    message: "Нет доступа"
                })
        }
    } else {
        return res
            .status(403)
            .json({
                message: "Нет доступа 2"
            })
    }

}

module.exports = checkToken;