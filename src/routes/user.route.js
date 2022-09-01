const express = require('express');
const router = express.Router();
const { isUser, isAdmin, isSuperAdmin } = require('../middleware/roleAuth')

const userController = require("../app/controllers/UserController")
router.get('/login', userController.login)
router.post('/login', userController.post_login)

router.get('/signup', userController.signup)
router.post('/signup', userController.post_signup)

router.get('/logout', isUser, userController.logout)

router.get('/create', isUser, userController.create)
router.post('/create', isUser, userController.post_create)

router.put('/:id', isUser, userController.updateProfile);
router.put('/updatePass/:id', isUser, userController.updatePass);

router.get('/orders', isUser, userController.orders)
router.post('/orders', isUser, userController.post_orders)
router.get('/checkout-address', isUser, userController.checkout_address)
router.post('/checkout-address', isUser, userController.post_checkout_address)
router.get('/checkout', isUser, userController.checkout)
router.post('/checkout', isUser, userController.post_checkout)

router.put('/cancelled/:id', isUser, userController.cancelled)

router.get('/cancelled_order/:id', userController.cancelledOrder)
router.put('/shipped/:id', isUser, userController.shipped)

router.get('/cancel',isUser, userController.cancel)
router.get('/success',isUser, userController.success)


router.get('/test-excel', isUser, userController.testExcel)

router.get('/', isUser, userController.information)
module.exports = router;