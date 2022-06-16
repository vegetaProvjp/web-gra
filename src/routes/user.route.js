const express = require('express');
const router = express.Router();

const userController = require("../app/controllers/UserController")
router.get('/login', userController.login)
router.post('/login', userController.post_login)

router.get('/signup', userController.signup)
router.post('/signup', userController.post_signup)

router.get('/logout', userController.logout)

router.get('/create', userController.create)
router.post('/create', userController.post_create)

router.put('/:id', userController.updateProfile);
router.put('/updatePass/:id', userController.updatePass);


router.get('/',userController.information)
module.exports = router;