const express = require('express');
const router = express.Router();
const requireLogin = require('../middlewares/requireLogin');
const {signIn , signUp , forgotPassword , resetPassword, changePassword, updateProfile, logOut } = require('../controllers/employee.controller');

// route to register user
router.post('/sign_up', signUp);

// route to login user
router.post('/sign_in', signIn);

// route to forgot password
router.post('/forgot_password', forgotPassword);

// route to reset password
router.post('/reset_password/:token', resetPassword);

// route to change password
router.post('/change_password', requireLogin ,  changePassword);

// route to update profile
router.put('/update_profile', requireLogin , updateProfile);

// route to log out employee
router.delete('./log_out', requireLogin , logOut);


module.exports = router