const Account = require("../models/Account");
const Cart = require("../models/Cart")
const Order = require("../models/Order")
const Category = require("../models/Category")
const Product = require("../models/products")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const maxAge = 3 * 24 * 60 * 60;
const { multipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");
const userinfo = require("../../util/userinfo");
const paypal = require('paypal-rest-sdk');
var total = 0
class UserController {
  async login(req, res) {
    try {
      const token = req.cookies.jwt;
      jwt.verify(token, "my secret key", (err, decodedToken) => {
        if (err) {
          res.render('user/login', { layout: false });
        } else {

          res.redirect("/");
        }
      });
    } catch {
      res.render("user/login", { layout: false });
    }
  }
  // [POST] user/login
  async post_login(req, res, next) {
    const { email, password } = req.body;
    const userID = userinfo(req);
    const userRole = await Account.findOne({ email: email })

    try {
      const account = await Account.login(email, password);
      const token = createToken(account._id);
      //Create new cookie
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      if (userRole.role == "admin" || userRole.role == "superAdmin") {
        res.redirect('/admin')
      }

      else {
        req.app.locals.login = true;
        res.locals.currentUser = req.user;
        res.redirect("/");
      }
    } catch (error) {
      res.status(400).json({ error: "Tài khoản hoặc mật khẩu không đúng" });
    }
  }
  signup(req, res, next) {
    res.render("user/signup", { layout: false });
  }

  async cancelled(req, res, next) {
    var idOrder = req.params.id;
    const order = await Order.updateOne({ _id: idOrder }, {
      $set: {
        status: 'cancelled'
      }
    })
    res.redirect('/user/orders')
  }

  async shipped(req, res, next) {
    var idOrder = req.params.id;
    const order = await Order.updateOne({ _id: idOrder }, {
      $set: {
        status: 'completed'
      }
    })
    res.redirect('/user/orders')
  }
  async post_signup(req, res, next) {
    const { email, password } = req.body;
    try {
      var hashPassword;
      const account = await Account.findOne({ email: email });
      if (!account) {
        hashPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashPassword;
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
      } else {
        res.render("user/signup", {
          layout: false,
          data: {
            error: "Email này đã được sử dụng!",
          },
        });
      }
    } catch (err) {
      res.status(400).json("Loi post_signup");
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
    res.render("test", { layout: false });
  }
  post_create(req, res) {
    res.json(`${req.body.email}`);
  }

  async information(req, res) {
    let userID = userinfo(req);
    const category = await Category.find({})
    Account.findById(userID).then((user) =>
      res.render("user/profile", {
        user: mongooseToObject(user),
        category: multipleMongooseToObject(category)
      })
    );
  }
  // [POST] /user/updateProfile
  updateProfile(req, res, next) {
    Account.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/user"))
      .catch(next);
  }

  async updatePass(req, res, next) {
    const salt = await bcrypt.genSalt();
    let password = await bcrypt.hash(req.body.password, salt);
    Account.updateOne(
      { _id: req.params.id },
      {
        password: password,
      }
    )
      .then(() => {
        res.redirect("/user");
      })
      .catch(next);
  }

  async orders(req, res, next) {
    let userID = userinfo(req);
    const user = await Account.findOne({ _id: userID })
    const category = await Category.find({})
    Order.find(
      {
        user: userID,
      },
      function (err, orders) {
        if (err) {
          return res.write("Error!");
        }
        var cart;
        orders.forEach(function (order) {
          cart = new Cart(order.cart);
          order.items = cart.generateArray();
        });
        res.render("user/orders", {
          orders: orders,
          user: mongooseToObject(user),
          category: multipleMongooseToObject(category),
        });
      }
    ).lean().sort({ createdAt: -1 });
  }

  post_orders(req, res, next) { }

  async checkout(req, res, next) {
    if (!req.session.cart) {
      return res.redirect("/product/all");
    }
    var cart = new Cart(req.session.cart)
    let userID = userinfo(req);
    Account.findById(userID)
      .then((user) => {

        return res.render("user/checkout", {
          user: mongooseToObject(user),
        })
      })
      .catch((err) => {
        console.log(err);
      });
  }

  success(req, res, next) {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
        "amount": {
          "currency": "USD",
          "total": total.toString()
          // "total": 1.5
        }
      }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        res.render('user/cancel');
      } else {
        console.log('tren')
        console.log(JSON.stringify(payment));
        res.render('user/success', { layout: false });
      }
    });
    total = 0
  }
  cancel(req, res, next) {
    res.render('user/cancel', { layout: false })
  }
  async post_checkout(req, res, next) {

    if (!req.session.cart) {
      return res.redirect("/product/cart");
    }
    var cart = new Cart(req.session.cart);
    var obj = cart.items
    for (var id in obj) {
      await Product.updateOne({ _id: id }, {
        $inc: {
          "quantity": -obj[id]['qty']
        }
      })
    }

    //Xu li neu het hang
    var items = []
    var pay = req.body.pay
    console.log(pay)
    if (pay == 1) {
      for (var id in obj) {
        items.push({
          name: `${obj[id]['item']['name']}`,
          sku: `${obj[id]['item']['_id']}`,
          price: `${(obj[id]['price'] / 23390.01).toFixed(2)}`,
          currency: 'USD',
          quantity: `${obj[id]['qty']}`
        })
      }
      for (var i = 0; i < items.length; i++) {
        var a = (parseFloat(items[i].price) * items[i].quantity);
        a = roundNumberV1(a, 2)
        total += parseFloat(a);
        total = roundNumberV1(total, 2)
      }
      const create_payment_json = {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
        "redirect_urls": {
          "return_url": "http://localhost:9000/user/success",
          "cancel_url": "http://localhost:9000/user/cancel"
        },
        "transactions": [{
          "item_list": {
            "items": items
            // "items": [{
            //   "name": "Blue Sox Hat",
            //   "sku": "003",
            //   "price": "1.5",
            //   "currency": "USD",
            //   "quantity": 1
            // }]
          },
          "amount": {
            "currency": "USD",
            "total": total.toString(),
            // "total": 1.5
          },
          "description": "Đơn thanh toán"
        }]
      };
      console.log(items)
      console.log(total)

      paypal.payment.create(create_payment_json, async function (error, payment) {
        if (error) {
          console.log('error')
          console.log(error)
          res.render('user/cancel', { layout: false });
        } else {
          console.log('success')
          console.log(payment)
          var userID = userinfo(req);
          await Order.create({
            user: userID,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            message: req.body.message,
            pay: req.body.pay,
          })
          console.log('duoi')
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === 'approval_url') {
              res.redirect(payment.links[i].href);
            }
          }
          console.log('123')
        }
      });
    }
    else {
      var userID = userinfo(req);
      await Order.create({
        user: userID,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        message: req.body.message,
        pay: req.body.pay,
      })
      res.redirect('/user/orders')
    }

    //Ket thuc paypal

    // for (var id in obj) {
    //   await Product.updateOne({ _id: id }, {
    //     $inc: {
    //       "quantity": -obj[id]['qty']
    //     }
    //   })
    // }
    // var userID = userinfo(req);
    // Order.create({
    //   user: userID,
    //   cart: cart,
    //   address: req.body.address,
    //   name: req.body.name,
    //   message: req.body.message,
    // })
    //   .then(res.redirect("/user/orders"))
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }

  async cancelledOrder(req, res, next) {
    var idOrder = req.params.id;
    const order = await Order.findById(idOrder)
    var obj = order.cart.items
    for (var id in obj) {
      await Product.updateOne({ _id: id }, {
        $inc: {
          "quantity": obj[id]['qty']
        }
      })
    }
  }

}

//Hàm sinh token
const createToken = (id) => {
  return jwt.sign({ id }, "my secret key", {
    expiresIn: maxAge,
  });
};

function roundNumberV1(num, scale) {
  if (!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale) + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if (+arr[1] + scale > 0) {
      sig = "+";
    }
    var i = +arr[0] + "e" + sig + (+arr[1] + scale);
    var j = Math.round(i);
    var k = +(j + "e-" + scale);
    return k;
  }
}

module.exports = new UserController();
