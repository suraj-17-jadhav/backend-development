const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
        },
        department:{
            type: String,
            required: true,
        },
        mobile_number:{
            type: Number,
            required: true,
            unique: true,
        },
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpires: {
            type:  Date
        }
       
    }
)

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee