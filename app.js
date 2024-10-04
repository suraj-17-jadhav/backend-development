require('dotenv').config();
const express = require('express');
const app=express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PORT= process.env.PORT || 3300;
const connectionURL = process.env.MONGO_URL;

app.use(express.json());

// mongoose connection
mongoose.connect(connectionURL);
mongoose.connection.on("connected",()=>{
    console.log("database conected successfully");
})
mongoose.connection.on("error",()=>{
    console.log("not connected to database");
})

app.use('/api', require('./routes/index.routes'));

// app is running on port 3300
app.listen(PORT, () => {
    console.log(`application is running on ${PORT}`);
}).on('error', (err) => {
    console.error(`Failed to start the server: ${err}`);
    
});