const jwt = require('jsonwebtoken');
const User = require('../app/models/Account')
const isUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'my secret key', async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.redirect('/user/login');
                next()
            }
            else {
                let user = await User.findById(decodedToken.id).lean();
                res.locals.user = user;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        res.redirect('/user/login');
    }
}

const isAdmin = (req, res, next) => {
    const role = res.locals.user.role
    if (role === 'admin' || role === 'superAdmin') {
        next()
    } else {
        res.json('NOT PERMISSION')
    }
}
const isSuperAdmin = (req, res, next) => {
    const role = res.locals.user.role
    if (role === 'superAdmin') {
        next()
    } else {
        res.json('NOT PERMISSION')
    }
}

module.exports = { isUser, isAdmin, isSuperAdmin };