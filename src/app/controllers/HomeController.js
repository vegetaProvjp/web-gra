const Account = require("../models/Account");
const { mongooseToObject } = require('../../util/mongoose')
const { multipleMongooseToObject } = require('../../util/mongoose')
const userinfo = require("../../util/userinfo");
const Product = require("../models/products");
const { getUser, getCategory } = require('../../util/commonFunc');
const FuzzySearch = require('fuzzy-search')
class HomeController {

  index(req, res) {
    let userID = userinfo(req);
    Account.findById(userID)

      .then((user) =>

        res.render("home", {
          user: mongooseToObject(user),
        })
      )
      .catch((err) => {
        console.log(err);
      });
  }
  async indexProduct(req, res, next) {
    if (req.cookies.jwt) {
      req.app.locals.login = true;
      req.app.locals.logout = false;
    }
    const user = await getUser(req)
    const category = await getCategory(req)
    Product.find({})
      .then(product => {
        res.render('home', {
          product: multipleMongooseToObject(product),
          user: mongooseToObject(user),
          category: multipleMongooseToObject(category),
        })
      })
      .catch(next);
  }
  search(req, res, next) {
    res.render('product/searchTest', { layout: false })

  }
  async searchReal(req, res, next) {
    try {
      const query = req.query.search
      const product = await Product.find({})
      console.log(query)
      const searcher = new FuzzySearch(product, ['name']);
      const result = searcher.search(query);
      res.json(result)
    }
    catch (err) {
      console.log(err)
    }
  }

}

module.exports = new HomeController();
