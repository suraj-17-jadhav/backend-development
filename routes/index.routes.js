const express = require('express');
const Router = express.Router();

Router.use('/users', require('./users.routes'))
Router.use('/products', require('./products.routes'))
Router.use('/employee', require('./employee.routes'))

module.exports =  Router;