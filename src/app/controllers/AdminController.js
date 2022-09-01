const Account = require("../models/Account");
const Order = require("../models/Order")
const {
  mongooseToObject,
  multipleMongooseToObject,
} = require("../../util/mongoose");
const userinfo = require("../../util/userinfo");
const Product = require("../models/products");
const Category = require("../models/Category");
const cloudinary = require("../../util/cloudinary");
const { getCategory, removeVietnameseTones } = require("../../util/commonFunc");
const { fetchProvince, fetchDistrict, fetchWard, getService, getFee } = require("../../util/fetchGHN")

const fs = require("fs");
class AdminController {
  async index(req, res, next) {
    const userID = userinfo(req);
    var dateStart = req.query.dateStart || '';
    var dateEnd = req.query.dateEnd || '';
    var revenue = 0
    if (dateStart != '' && dateEnd != '') {
      var order = await Order.find({
        createdAt: {
          $gte: new Date(dateStart),
          $lte: new Date(dateEnd)
        }
      })

      for (var id in order) {
        if (order[id].status == 'completed') {
          revenue += order[id].cart.totalPrice
        }
      }
      console.log(revenue)
    }
    const user = await Account.findById(userID)
    revenue = revenue.toString()
    Product.find({})
      .then((product) => {
        res.render("admin/index", {
          layout: false,
          user: mongooseToObject(user),
          product: multipleMongooseToObject(product),
          revenue: revenue
        });
      })
      .catch(next);
  }

  charts(req, res, next) {
    Product.find({})
      .then((product) => {
        res.render("admin/charts", {
          layout: false,
          product: multipleMongooseToObject(product),
        });
      })
      .catch(next);
  }

  async apiOrders(req, res, next) {
    var orders = await Order.find({})
    res.json(orders)
  }
  async tables(req, res, next) {
    const category = await Category.find({})
    const userID = userinfo(req);
    const user = await Account.findById(userID)
    Product.find({})
      .then((product) => {
        res.render("admin/tables", {
          layout: false,
          user: mongooseToObject(user),
          product: multipleMongooseToObject(product),
          category: multipleMongooseToObject(category),
        });
      })
      .catch(next);
  }
  async create(req, res, next) {
    const userID = userinfo(req);
    const userRole = await Account.findById(userID)
    Category.find({})
      .then((category) => {
        res.render("admin/create", {
          layout: false,
          userRole: mongooseToObject(userRole),
          category: multipleMongooseToObject(category),
        });
      })
      .catch(next);
  }
  async post_create(req, res, next) {
    // Product.create({
    //     name: req.body.name,
    //     price: req.body.price,
    //     quantity: req.body.quantity,
    //     title: req.body.title,
    //     description: req.body.description,
    // })
    //     .then((product) =>
    //         res.render("admin/create", {
    //             layout: false,
    //             product: mongooseToObject(product),
    //             data: {
    //                 success: "Create Successfully!"
    //             },
    //         })
    //     )
    //     .catch((err) => {
    //         res.render("admin/create", {
    //             layout: false,
    //             product: mongooseToObject(product),
    //             data: {
    //                 success: "Create Successfully!"
    //             },
    //         })
    //     });
    // }
    const uploader = async (path) => await cloudinary.uploads(path, "Products");
    try {
      // const category = await Category.find({});
      // let userID = userinfo(req);
      const urls = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        urls.push(newPath);
        try {
          fs.unlinkSync(path);
          console.log("successfully upload image");
        } catch {
          console.log("remove image failed");
        }
      }
      // Product.create({
      //     name: req.body.name,
      //     name_english: removeVietnameseTones(req.body.name),
      //     price: req.body.price,
      //     quantity: req.body.quantity,
      //     description: req.body.description,
      //     title: req.body.title,
      //     category: req.body.category,
      //     // account: userId,
      //     image: urls,
      // }, (err) => {
      //     if(err) console.log(`err create-product`);
      //     res.redirect('back');

      // },{layout: false})
      let product = new Product({
        name: req.body.name,
        name_english: removeVietnameseTones(req.body.name),
        price: req.body.price,
        quantity: req.body.quantity,
        description: req.body.description,
        title: req.body.title,
        category: req.body.category,
        sale: req.body.sale,
        // account: userId,
        image: urls,
      });
      //Save user
      await product.save();
      res.redirect("back");
    } catch {
      res.status(500).json({ message: "error" });
    }
  }
  async create_category(req, res, next) {
    const userID = userinfo(req);
    const user = await Account.findById(userID)
    Category.find({}).then((category) => {
      res.render("admin/createCategory1", {
        layout: false,
        user: mongooseToObject(user),
        category: multipleMongooseToObject(category),
      });
    });
  }
  post_category(req, res, next) {
    const { nameCategory } = req.body;
    Category.create({ title: nameCategory })
      .then(() => res.redirect("back"))
      .catch(next);
  }
  updateCategory(req, res, next) {
    var idCategory = req.params.id;
    Category.find({ _id: idCategory })
      .then((category) => {
        category = category[0];
        category.title = req.body.nameCategory;
        category.save((err) => {
          if (err) {
            console.log(err);
          }
          res.redirect("back");
        });
      })
      .catch(next);
  }

  deleteCategory(req, res, next) {
    Category.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }
  post_product(req, res, next) {
    const { nameCategory } = req.body;
    Product.create({ title: nameCategory })
      .then(() => res.redirect("back"))
      .catch(next);
  }
  updateProduct(req, res, next) {
    var idProduct = req.params.id;
    Product.find({ _id: idProduct })
      .then((product) => {
        product = product[0];
        product.name = req.body.nameProduct;
        product.price = req.body.priceProduct;
        product.category = req.body.idCategory
        product.description = req.body.descriptionProduct
        product.sale = req.body.sale
        product.save((err) => {
          if (err) {
            console.log(err);
          }
          res.redirect("back");
        });
      })
      .catch(next);
  }

  deleteProduct(req, res, next) {
    Product.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }


  //order
  async orders(req, res, next) {
    const userID = userinfo(req);
    const user = await Account.findById(userID)
    Order.find({})
      .sort({ createdAt: -1 })
      .populate("user")
      .then((order) => {
        res.render("admin/orders", {
          order: multipleMongooseToObject(order),
          user: mongooseToObject(user),
          layout: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async view_order(req, res, next) {
    const order = await Order.findOne({ _id: req.params.id })
    // res.json(order.user)
    const idUser = order.user
    const user = await Account.findOne({ _id: idUser })
    res.render('admin/view_order', {
      layout: false,
      order: mongooseToObject(order),
      user: mongooseToObject(user),
    })
    // Order.findOne({ _id: req.params.id }
    //   .then(order => {
    //     res.render('admin/view_order', {
    //       order: multipleMongooseToObject(order),
    //       layout: false,
    //     })
    //   })
    // )
  }
  async updateview_order(req, res, next) {
    var status = req.body.status;
    var idOrder = req.params.id;
    if (status == "cancelled") {
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
    Order.findOneAndUpdate({ _id: req.params.id }, { status: req.body.status }, { new: true })
      .then(() => res.redirect("/admin/orders"))
      .catch(next);
  }
  async delete_order(req, res, next) {
    const order = await Order.deleteOne({ _id: req.params.id })
    res.redirect("back")
  }

  async list_user(req, res, next) {
    const userID = userinfo(req);
    const userRole = await Account.findById(userID)
    Account.find({})
      .then(account => {
        res.render('admin/listUser', {
          layout: false,
          userRole: mongooseToObject(userRole),
          user: multipleMongooseToObject(account)
        })
      })
      .catch(err => {
        res.json(err)
      })
  }

  async updatelist_user(req, res, next) {
    var idaccount = req.params.id;
    Account.find({ _id: idaccount })
      .then((user) => {
        user = user[0];
        user.fullName = req.body.nameUser
        user.email = req.body.emailUser
        user.phone = req.body.phoneUser
        user.address = req.body.addressUser
        user.role = req.body.role
        user.save((err) => {
          if (err) {
            console.log(err);
          }
          res.redirect("back");
        });
      })
      .catch(next);
  }

  deletelist_user(req, res, next) {
    Account.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }


  revenueYear(req, res, next) {
    Order.find({})
      .then(order => {
        res.json(order);
      })
  }

  test(req, res, next) {
    res.render('admin/test', {
      layout: false
    })
  }
  async post_test(req, res, next) {
    var province = req.body.province
    var district = req.body.district
    var ward = req.body.ward
    var provinceApi = await fetchProvince(province)
    var districtApi = await fetchDistrict(district, province)
    var wardApi = await fetchWard(ward, district)
    var fee = await getFee(ward, district, province)
    fee = fee.data.total
    res.json({
      province: provinceApi,
      district: districtApi,
      ward: wardApi,
      fee: fee
    })
  }
}

module.exports = new AdminController();
