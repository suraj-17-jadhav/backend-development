const express = require('express');
const router = express.Router();
const requireLogin = require('../middlewares/requireLogin');
const { initializeProducts } = require('../controllers/product.controller');

// api to initialize the mongodb database
router.get('/initialize-products',requireLogin, initializeProducts);

module.exports = router;
