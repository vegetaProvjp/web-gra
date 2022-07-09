const Account = require("../models/Account");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const path = require("path");
const maxAge = 3 * 24 * 60 * 60;
const { multipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");
const userinfo = require("../../util/userinfo");

class UserController {
    login(req, res) {
        try {
            const token = req.cookies.jwt;
            jwt.verify(token, "my secret key", (err, decodedToken) => {
                if (err) {
                    res.render("user/login", { layout: false });
                } else {
                    res.redirect("/");
                }
            });

        }
        catch {
            res.render("user/login", { layout: false });

        }

    }
    // [POST] user/login
    async post_login(req, res, next) {
        const { email, password } = req.body
        try {
            const account = await Account.login(email, password);
            const token = createToken(account._id);
            //Create new cookie
            res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.redirect("/");
            req.app.locals.login = true;
            res.locals.currentUser = req.user;
        } catch (error) {
            res.status(400).json({ error: "Tài khoản hoặc mật khẩu không đúng" });
        }
    }
    signup(req, res, next) {
        res.render('user/signup', { layout: false });
    }
    async post_signup(req, res, next) {
        const { email, password } = req.body
        try {
            var hashPassword
            const account = await Account.findOne({ email: email })
            if (!account) {
                hashPassword = await bcrypt.hash(req.body.password, 10)
                req.body.password = hashPassword
                Account.create({
                    email: req.body.email,
                    password: req.body.password,
                    fullName: req.body.fullName,
                    phone: req.body.phone,
                    address: req.body.address,
                    gender: req.body.gender,
                })
                    .then(
                        res.render("user/signup", {
                            layout: false,
                            data: {
                                success: "Đăng ký thành công!",
                            },
                        })
                    )
                    .catch((status, err) => {
                        res.render("user/signup", {
                            layout: false,
                            data: {
                                error: "Đăng ký thất bại!",
                            },
                        });
                    });
            }
            else {
                res.render("user/signup", {
                    layout: false,
                    data: {
                        error: "Email này đã được sử dụng!",
                    },
                })
            }
        }
        catch (err) {
            res.status(400).json('Loi post_signup')
        }
    }
    //[GET] /user/logout
    logout(req, res) {
        req.app.locals.login = false;
        req.app.locals.logout = true;
        res.clearCookie("jwt");
        res.redirect("/");
    }

    create(req, res) {
        res.render('test', { layout: false })
    }
    post_create(req, res) {
        res.json(`${req.body.email}`)
    }

    information(req, res) {
        let userID = userinfo(req);
        Account.findById(userID)
            .then((user) =>
                res.render("user/profile", {
                    user: mongooseToObject(user),
                })
            )
    }
    // [POST] /user/updateProfile
    updateProfile(req, res, next) {
        Account.updateOne(
            { _id: req.params.id }, req.body
        ).then(() => res.redirect('/user'))
            .catch(next);
    }

    async updatePass(req, res, next) {
        const salt = await bcrypt.genSalt();
        let password = await bcrypt.hash(req.body.password, salt);
        Account.updateOne(
            { _id: req.params.id }, {
                password: password,
            }
        )
            .then(() => {
                res.redirect('/user')
            })
            .catch(next)
    }
}

//Hàm sinh token
const createToken = (id) => {
    return jwt.sign({ id }, "my secret key", {
        expiresIn: maxAge,
    });
};

module.exports = new UserController();
