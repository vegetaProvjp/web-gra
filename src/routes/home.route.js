const express = require('express');
const router = express.Router();

const homeController = require("../app/controllers/HomeController")
router.get('/search', homeController.search)
router.get('/search-real', homeController.searchReal)
router.get('/', homeController.indexProduct)


module.exports = router;