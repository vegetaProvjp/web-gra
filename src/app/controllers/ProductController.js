const Account = require("../models/Account");
const Product = require("../models/products");
const { mongooseToObject, multipleMongooseToObject } = require('../../util/mongoose')
const userinfo = require("../../util/userinfo");
const Cart = require("../models/Cart")
const Category = require("../models/Category")
const FuzzySearch = require('fuzzy-search');
const PAGE_SIZE = 4
const { getUser, searchProduct, sortAZ, sortZA, sortPriceAsc, sortPriceDesc, getCategory } = require('../../util/commonFunc')
class ProductController {

    async index(req, res, next) {
        const category = await getCategory(req)
        // if (req.query.search) {
        //     console.log(req.query.search)
        //     const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        //     Product.find({ name: regex })
        //         .then(product => {
        //             res.render('product/product', {
        //                 category: multipleMongooseToObject(category),
        //                 product: multipleMongooseToObject(product)
        //             })
        //         })
        //         .catch(next)
        // }
        // else {
        Product.find({})
            .then(product => {
                res.render('product/product-all', {
                    category: multipleMongooseToObject(category),
                    product: multipleMongooseToObject(product)
                })
            })
            .catch(next)
        // }
    }

    //api product category
    async apiCategory(req, res, next) {
        let page = req.query.page
        const categorySlug = req.params.category
        if (page) {
            page = parseInt(page)
            var skipProduct = (page - 1) * PAGE_SIZE
            Category.findOne({ slug: categorySlug }, async (err, cate) => {
                const categoryId = cate._id
                let totalProduct = await Product.find({ category: categoryId })
                    .count()
                Product.find({ category: categoryId })
                    .skip(skipProduct)
                    .limit(PAGE_SIZE)
                    .then((products) => {
                        var totalPage = Math.ceil(totalProduct / PAGE_SIZE)
                        res.json({
                            slug: categorySlug,
                            totalProduct: totalProduct,
                            totalPage: totalPage,
                            data: products,
                        })


                    })
            })
        }
        else {
            // Product.find({})
            //     .then(product => {
            //         res.json(product)
            //     })
            Product.aggregate()
                .lookup({
                    from: "category",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                })
                .match({ "category.slug": categorySlug })
                .then(product => {
                    res.json(product);
                })
        }

    }

    //api all product
    async page(req, res, next) {
        let page = req.query.page
        if (page) {
            page = parseInt(page)
            let skipProduct = (page - 1) * PAGE_SIZE
            Product.find({})
                .skip(skipProduct)
                .limit(PAGE_SIZE)
                .then(data => {
                    Product.countDocuments({}).then((totalProduct) => {
                        let totalPage = Math.ceil(totalProduct / PAGE_SIZE)
                        res.json({
                            totalProduct: totalProduct,
                            totalPage: totalPage,
                            data: data,
                        })
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        }
        else {
            Product.find({})
                .then(product => {
                    res.json(product)
                })
        }
    }

    async homePage(req, res, next) {
        res.render('product/homepage', { layout: false })
    }

    async productAll(req, res, next) {
        const category = await getCategory(req)

        Product.find({})
            .then(product => {
                res.render('product/product-all', {
                    category: multipleMongooseToObject(category),
                    product: multipleMongooseToObject(product)
                })
            })
            .catch(next)
    }

    async detail(req, res, next) {
        const category = await getCategory(req)
        Product.findOne({ slug: req.params.slug })
            .then(product => {
                res.render('product/product-detail', {
                    category: multipleMongooseToObject(category),
                    product: mongooseToObject(product)
                })
            })
            .catch(next)
    }
    async getCategory(req, res, next) {
        const category = await getCategory(req)
        const categorySlug = req.params.category
        if (categorySlug) {
            Category.findOne({ slug: categorySlug }, (err, cate) => {
                const categoryId = cate._id
                Product.find({ category: categoryId }, (err, products) => {
                    if (err) {
                        console.log(err)
                    }
                    res.render('product/product', {
                        slug: categorySlug,
                        category: multipleMongooseToObject(category),
                        products: multipleMongooseToObject(products),
                    })
                })
            })
        }
        else {
            console.log('loi getCategory')
        }
    }
    async search(req, res) {
        // try {
        //     const user = await getUser(req)
        //     const category = await getCategory(req);
        //     let rs = await searchProduct(req);
        //     if (rs) {
        // res.render('product/search', {
        //     user: mongooseToObject(user),
        //     product: rs,
        //     cate: req.body.category,
        //     category: multipleMongooseToObject(category)
        // })
        //     }
        // } catch (error) {
        //     console.log(error)
        // }
        try {
            const query = req.query.search
            const product = await Product.find({})
            const searcher = new FuzzySearch(product, ['name'], ['name_english']);
            const result = searcher.search(query);
            const user = await getUser(req)
            const category = await getCategory(req)
            res.render('product/search', {
                user: mongooseToObject(user),
                product: multipleMongooseToObject(result),
                category: multipleMongooseToObject(category)
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    async sort(req, res, next) {
        try {
            const user = await getUser(req)
            const category = await getCategory(req);
            switch (req.body.sort) {
                case '1':
                    var rs = await sortPriceAsc(req)
                    res.render('product/search', {
                        product: rs,
                    })
                    break;
                case '2':
                    var rs = await sortPriceDesc(req)
                    res.render('product/search', {
                        product: rs,
                    })
                    break;
                case '3':
                    var rs = await sortAZ(req)
                    res.render('product/search', {
                        product: rs,
                    })
                    break;
                case '4':
                    var rs = await sortZA(req)
                    res.render('product/search', {
                        product: rs,
                    })
                    break;
                default:
                    res.json('sort invalid')
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    async cart(req, res, next) {
        const category = await getCategory(req)
        if (!req.session.cart) {
            return res.render("product/cart", {
                category: multipleMongooseToObject(category),
                products: null
            });
        }
        var cart = new Cart(req.session.cart);
        res.render("product/cart", {
            category: multipleMongooseToObject(category),
            products: cart.generateArray(),
            totalPrice: cart.totalPrice,
        });

    }
    addCart(req, res, next) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        Product.findById(productId, function (err, product) {
            if (err) {
                return res.redirect("/");
            }
            cart.add(product, product.id);
            req.session.cart = cart;
            res.redirect("/product");
        });
    }
    reduce(req, res, next) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.reduceByOne(productId);
        req.session.cart = cart;
        res.redirect("/product/cart");
    }
    increase(req, res, next) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.increaseByOne(productId);
        req.session.cart = cart;
        res.redirect("/product/cart");
    }

    remove(req, res, next) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.removeItem(productId);
        req.session.cart = cart;
        res.redirect("/product/cart");
    }
    async searchTest(req, res, next) {
        try {

            const query = req.query.search
            const product = await Product.find({})
            const searcher = new FuzzySearch(product, ['name'], ['name_english']);
            const result = searcher.search(query);
            res.json(result)
        }
        catch (err) {
            console.log(err)
        }
    }

    //[get] API all product
    async getallApi(req, res, next) {
        const rs = await Product.find({})
        res.json(rs)
    }
}
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
module.exports = new ProductController();
