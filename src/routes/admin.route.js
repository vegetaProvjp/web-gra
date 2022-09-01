const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer")
const adminController = require("../app/controllers/AdminController")
const { isUser, isAdmin, isSuperAdmin } = require('../middleware/roleAuth')

router.get('/', isUser, isAdmin, adminController.index)
router.get('/charts',isUser,isAdmin, adminController.charts)
router.get('/tables',isUser, isAdmin, adminController.tables)


// CRUD category
router.get('/create-category', isUser, isAdmin, adminController.create_category)
router.post('/create-category', isUser, isAdmin, adminController.post_category)
router.put('/create-category/:id', isUser, isAdmin, adminController.updateCategory)
router.delete('/create-category/:id', isUser, isAdmin, adminController.deleteCategory)
// CRUD product
router.get('/create-product', isUser, isAdmin, adminController.create)
router.post('/create-product', upload.array('image'), isUser, isAdmin, adminController.post_create)
// router.post('/create-product', adminController.post_product)
router.put('/product/:id/edit', isUser, isAdmin, adminController.updateProduct)
router.delete('/product/:id/delete', isUser, isAdmin, adminController.deleteProduct)

router.get('/orders', isUser, isAdmin, adminController.orders)
router.get('/view_order/:id', isUser, isAdmin, adminController.view_order)
router.put('/view_order/:id', isUser, isAdmin, adminController.updateview_order)
router.delete('/view_order/:id', isUser, isAdmin, adminController.delete_order)
router.get('/list-user', isUser, isAdmin, isSuperAdmin, adminController.list_user)
router.put('/list_user/:id/edit', isUser, isAdmin, isSuperAdmin, adminController.updatelist_user)
router.delete('/list_user/:id/delete', isUser, isSuperAdmin, adminController.deletelist_user)
router.get('/api/orders', isUser, isAdmin, adminController.apiOrders)
router.get('/api/revenue', isUser, adminController.revenueYear)
router.get('/test', adminController.test)
router.post('/test', adminController.post_test)
module.exports = router;