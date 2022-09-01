const express = require('express');
const router = express.Router();
const { isUser, isAdmin, isSuperAdmin } = require('../middleware/roleAuth')

const homeController = require("../app/controllers/HomeController")
router.get('/search', isUser, homeController.search)
router.get('/search-real', isUser, homeController.searchReal)
router.get('/', homeController.indexProduct)


module.exports = router;