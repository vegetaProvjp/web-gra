const express = require('express');
const router = express.Router();
// const {requireAuth} = require('../middleware/authMiddleware');
const ProductController = require("../app/controllers/ProductController")

router.get('/add-cart/:id', ProductController.addCart)
router.get('/cart',ProductController.cart)
router.get('/search', ProductController.search)
router.get('/page', ProductController.page)
router.get('/homepage', ProductController.homePage)
router.get('/search-test', ProductController.searchTest)
router.get('/api', ProductController.getallApi)
router.post('/sort', ProductController.sort)
router.get('/increase/:id', ProductController.increase);
router.get('/reduce/:id', ProductController.reduce);
router.get('/remove/:id', ProductController.remove);
router.get('/category/:category', ProductController.getCategory)
router.get('/category/api/:category', ProductController.apiCategory)
router.get('/all', ProductController.productAll)
router.get('/:slug', ProductController.detail)
router.get('/', ProductController.index)

module.exports = router;