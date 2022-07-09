const Account = require("../models/Account");
const { mongooseToObject, multipleMongooseToObject } = require('../../util/mongoose')
const userinfo = require("../../util/userinfo");
const Product = require("../models/products");
const Category = require("../models/Category")
const cloudinary = require('../../util/cloudinary')
const { getCategory, removeVietnameseTones } = require('../../util/commonFunc');

const fs = require('fs')
class AdminController {

    index(req, res) {
        res.render('admin/index', { layout: false })
    }
    create(req, res, next) {
        Category.find({})
            .then(category => {
                res.render('admin/create', {
                    category: multipleMongooseToObject(category),
                })
            })
            .catch(next)
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
        const uploader = async (path) => await cloudinary.uploads(path, 'Products')
        try {
            // const category = await Category.find({});
            // let userID = userinfo(req);
            const urls = []
            const files = req.files
            for (const file of files) {
                const { path } = file
                const newPath = await uploader(path)
                urls.push(newPath)
                try {
                    fs.unlinkSync(path)
                    console.log('successfully upload image')
                }
                catch {
                    console.log('remove image failed');
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
                // account: userId,
                image: urls,
            });
            //Save user
            await product.save();
            res.redirect('back')
        } catch {
            res.status(500).json({ message: 'error' })
        }
    }
    async create_category(req, res, next) {
        Category.find({})
            .then(category => {
                res.render('admin/createCategory', {
                    layout: false,
                    category: multipleMongooseToObject(category)
                })
            })
    }
    post_category(req, res, next) {
        const { nameCategory } = req.body
        Category.create({ title: nameCategory })
            .then(() => res.redirect('back')
            )
            .catch(next)
    }
    updateCategory(req, res, next) {
        Category.findById(req.params.id)
            .then(() => res.redirect('back'))
            .catch(next)

    }

    deleteCategory(req, res, next) {
        Category.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)


    }
}

module.exports = new AdminController();
