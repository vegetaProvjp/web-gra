const express = require('express');
const router = express.Router();
// const {requireAuth} = require('../middleware/authMiddleware');
const ProductController = require("../app/controllers/ProductController")
const { isUser, isAdmin, isSuperAdmin } = require('../middleware/roleAuth')
router.get('/add-cart/:id', isUser, ProductController.addCart)
router.get('/cart', isUser, ProductController.cart)
router.get('/search', isUser, ProductController.search)
router.get('/page', isUser, ProductController.page)
router.get('/homepage', isUser, ProductController.homePage)
router.get('/search-test', isUser, ProductController.searchTest)
router.get('/api', ProductController.getallApi)
router.post('/sort', isUser, ProductController.sort)
router.get('/increase/:id', isUser, ProductController.increase);
router.get('/reduce/:id', isUser, ProductController.reduce);
router.get('/remove/:id', isUser, ProductController.remove);
router.get('/category/:category', isUser, ProductController.getCategory)
router.get('/category/api/:category', ProductController.apiCategory)
router.get('/table-product', isUser, ProductController.tableProduct)
router.get('/all', isUser, ProductController.productAll)
router.get('/getCookie', ProductController.getCookie)
router.get('/api-search-product/:search', ProductController.apiSearchProduct)
router.get('/test-api-search', ProductController.testApiSearch)
router.get('/delete_cookie', ProductController.delete_cookie)
router.get('/:slug', isUser, ProductController.detail)
router.get('/', isUser, ProductController.index)

module.exports = router;