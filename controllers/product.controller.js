const axios = require('axios');
const Product = require('../models/Product');


const initializeProducts = async(req,res)=>{
    try {
       const response= await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
       const products= response.data;
       for (let product of products) {
         await Product.create(product);
       }
       res.status(200).json({ message: 'products initialized successfully' });
    } catch (error) {
        console.error('Error initializing products:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports= {
    initializeProducts, 
}