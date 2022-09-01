const Account = require("../models/Account");
const Product = require("../models/products");
const { mongooseToObject, multipleMongooseToObject } = require('../../util/mongoose')
const userinfo = require("../../util/userinfo");
const fetch = require('node-fetch')
const Cart = require("../models/Cart")
const Category = require("../models/Category")
const ContentBasedRecommender = require('content-based-recommender')
const recommender = new ContentBasedRecommender({
    minScore: 0.1,
    maxSimilarDocuments: 100
});
const FuzzySearch = require('fuzzy-search');
const PAGE_SIZE = 16
var querySearch = ''
const { getUser, searchProduct, getApiTest, sortAZ, sortZA, sortPriceAsc, sortPriceDesc2, getCategory } = require('../../util/commonFunc')
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
        var allProduct = await Product.find({})
        var documents = []
        for (var i = 0; i < allProduct.length; i++) {
            documents.push({
                id: allProduct[i].slug,
                content: allProduct[i].name,
            })
        }
        recommender.train(documents);

        const similarProduct = recommender.getSimilarDocuments(req.params.slug, 0, 8)
        var similarProductSlug = []
        for (var i = 0; i < similarProduct.length; i++) {
            similarProductSlug.push(similarProduct[i].id)
        }
        console.log(similarProductSlug)
        let relatedProduct = await Product.find({ 
            slug: { $in: similarProductSlug }
        })
        Product.findOne({ slug: req.params.slug })
            .then(product => {
                res.render('product/product-detail', {
                    category: multipleMongooseToObject(category),
                    product: mongooseToObject(product),
                    relatedProduct: multipleMongooseToObject(relatedProduct)
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
        try {
            const query = req.query.search
            querySearch = req.query.search
            const product = await Product.find({})
            const searcher = new FuzzySearch(product, ['name', 'name_english']);
            const result = searcher.search(query);
            const user = await getUser(req)
            const category = await getCategory(req)
            res.render('product/search', {
                user: mongooseToObject(user),
                product: multipleMongooseToObject(result),
                category: multipleMongooseToObject(category),
                query: query
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    async sort(req, res, next) {
        try {
            const user = await getUser(req)
            const category = await getCategory(req)
            const product = await Product.find({})
            const searcher = new FuzzySearch(product, ['name'], ['name_english']);
            const result = searcher.search(querySearch);
            switch (req.body.sort) {
                case '1':
                    var rs = sortPriceAsc(result)
                    res.render('product/search', {
                        product: multipleMongooseToObject(rs),
                        category: multipleMongooseToObject(category),
                    })
                    break;
                case '2':
                    var rs = sortPriceDesc2(result)
                    res.render('product/search', {
                        product: multipleMongooseToObject(rs),
                        category: multipleMongooseToObject(category),
                    })
                    break;
                case '3':
                    var rs = sortAZ(result)
                    res.render('product/search', {
                        product: multipleMongooseToObject(rs),
                        category: multipleMongooseToObject(category),
                    })
                    break;
                case '4':
                    var rs = sortZA(result)
                    res.render('product/search', {
                        product: multipleMongooseToObject(rs),
                        category: multipleMongooseToObject(category),
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
        // if (req.session.views) {
        //     // Increment the number of views.
        //     req.session.views++
        //     // Session will expires after 1 min
        //     // of in activity
        //     res.write( '< p > Session expires after 1 min of in activity: '
        //         + (req.session.cookie.expires) + '</p>')
        //     console.log(req.session.cookie.expires.toString())
        //     console.log(req.session)
        //     res.end()
        // } else {
        //     req.session.views = 1
        //     console.log(req.session)

        //     res.end(' New session is started')
        // }
        const category = await getCategory(req)

        if (!req.session.cart) {
            return res.render("product/cart", {
                category: multipleMongooseToObject(category),
                products: null,
            });
        }
        var cart = new Cart(req.session.cart);
        var obj = cart.items
        // for(var prop in obj) {
        //     console.log(`obj.${prop} = ${obj[prop]['qty']}`);
        // }
        res.render("product/cart", {
            category: multipleMongooseToObject(category),
            products: cart.generateArray(),
            totalPrice: cart.totalPrice,
        });
    }
    async apiSearchProduct(req, res) {
        var query = req.params.search
        query = query.replaceAll('-', ' ')
        const product = await Product.find({})
        const searcher = new FuzzySearch(product, ['name'], ['name_english']);
        const result = searcher.search(query);
        res.json(result)
    }
    async testApiSearch(req, res, next) {
        fetch('http://localhost:9000/product/api-search-product/áo-polo-nam-cafe')
            .then((response) => response.json())
            .then(data => {
                return res.json(data)
            })
    }
    async addCart(req, res, next) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        //Giảm số lượng trong kho đi 1
        // const product = await Product.updateOne(
        //     { _id: productId, "quantity": { $gt: 1 } }, {
        //     $inc: { "quantity": -1 }
        // })
        // const productInfo = await Product.findById(productId)
        // if (product.modifiedCount == 0) {
        //     return res.json(`Mặt hàng ${productInfo.name} đã hết`)
        // }
        // else {
        Product.findById(productId)
            .then(product => {
                cart.add(product, product.id);
                console.log(cart)
                req.session.cart = cart;
                res.redirect("/product/" + product.slug)
            })
            .catch(err => {

            })
        // }
    }
    async delete_cookie(req, res) {
        res.clearCookie('cart');
        res.redirect('/')
    }
    async reduce(req, res, next) {

        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.reduceByOne(productId);
        // const product = await Product.updateOne({ _id: productId }, {
        //     $inc: {
        //         "quantity": 1
        //     }
        // })
        req.session.cart = cart;
        res.redirect("/product/cart");
    }
    async increase(req, res, next) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        // const product = await Product.updateOne(
        //     { _id: productId, "quantity": { $gt: 1 } }, {
        //     $inc: { "quantity": -1 }
        // })

        // const productInfo = await Product.findById(productId)
        // if (product.modifiedCount == 0) {
        //     return res.json(`Mặt hàng ${productInfo.name} đã hết`)
        // }
        // else {
        cart.increaseByOne(productId);
        req.session.cart = cart;
        return res.redirect("/product/cart");
        // }
    }

    async remove(req, res, next) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        var productRemove = cart.getProduct(productId)
        cart.removeItem(productId)
        // const product = await Product.updateOne({ _id: productId }, {
        //     $inc: {
        //         "quantity": productRemove[0].qty
        //     }
        // })
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

    async tableProduct(req, res, next) {
        const category = await getCategory(req)

        Product.find({})
            .then(product => {
                res.render('product/table-product', {
                    layout: false,
                    category: multipleMongooseToObject(category),
                    product: multipleMongooseToObject(product)
                })
            })
            .catch(next)
    }
    getCookie(req, res, next) {

        if (req.session.views) {

            // Increment the number of views.
            req.session.views++

            // Session will expires after 1 min
            // of in activity
            res.write('< p > Session expires after 1 min of in activity: '
                + (req.session.cookie.expires) + '</p>')
            res.end()
        } else {
            req.session.views = 1

            res.end(' New session is started')
        }
    }
}
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// function cron(cart, minutes){
//     //cart: req.session.cart
//     if(cart) {
//         cron.schedule(`${minutes} 1 * * *`, () => {
//             var length = cart.items.length
//             for (var i = 0; i < length; i++) {
//                 cart.items[i]
//             }
//         });
//     }
// }
module.exports = new ProductController();
