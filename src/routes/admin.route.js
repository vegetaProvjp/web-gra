const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer")
const adminController = require("../app/controllers/AdminController")
router.get('/', adminController.index)
router.get('/create-product', adminController.create)
router.post('/create-product',upload.array('image'), adminController.post_create)
router.get('/create-category', adminController.create_category)
router.post('/create-category', adminController.post_category)
router.put('/create-category/:id', adminController.updateCategory)
router.delete('/create-category/:id', adminController.deleteCategory)
module.exports = router;