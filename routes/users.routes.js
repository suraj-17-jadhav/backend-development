const express = require('express');
const router = express.Router();
const {initializeUser, signIn, getCompanyuser} = require('../controllers/user.controller')

// routes to initialize the database
router.get('/initialize-users', initializeUser);

// routes to login user
router.post('/sign_in', signIn)

// routes to get the user of the different company
router.get('/get_company_user', getCompanyuser)

module.exports = router;