require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const secretKey = process.env.JWT_SECRET_KEY;
const crypto= require('crypto')
const sendEmail= require('../services/emailService');
const ChangePasswordRequestSchema = require('../validation_Schema/changePasswordValidationSchema');
const UpdateProfileRequestSchema = require('../validation_Schema/updateProfileValidationSchema');



// routes to register user
const signUp = async(req,res)=>{
    const { name, email, password, department, mobile_number } = req.body;
    if (!name || !email || !password || !department || !mobile_number) {
        return res.status(422).json({ error: "Please enter data in all fields" });
    }
    try {
        const existingEmployee = await Employee.findOne({ $or: [{ email }, { mobile_number }] });
        if (existingEmployee) {
            return res.status(400).json({ msg: 'Employee already exists' });
        }      
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const employee = new Employee({
            name,
            email,
            password: hashedPassword,
            department,
            mobile_number,
        });
        await employee.save();
        const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
        const message = `Please click the following link to verify your email:
                http://localhost:3000/verify-email?token=${token}\n\n`;
        
        await sendVerificationEmail(email, 'Verify Your Email', message);
        res.json({ message: "Registered successfully" });
    } catch (error) {
        console.error("error while sign up",error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// routes to login user
const signIn = async(req,res)=>{
    const {email,password}= req.body;
    if(!email || !password){
        return res.status(422).json({error: "please enter valid email and password"});
    }
    try {
        const savedEmployee = await Employee.findOne({ email });
        if (!savedEmployee) {
            return res.status(422).json({ error: "Invalid email" });
        }
        const isMatch = await bcrypt.compare(password, savedEmployee.password);
        if (!isMatch) {
        return res.status(422).json({ error: "Invalid password" });
        }
        const token = jwt.sign({ _id: savedEmployee._id },secretKey, { expiresIn: '1h' });
        return res.status(200).json({
            message: "Login successful",
            token: token,
            employee: {
                id: savedEmployee.id,
                name: savedEmployee.name,
                email: savedEmployee.email,
                department: savedEmployee.department,
                mobile_number: savedEmployee.mobile_number,
            }
        });
    } catch (error) {
      console.error("error while sign in",error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
}

// routes to send forgot paaword link
const forgotPassword=  async(req,res)=>{
    const {email}= req.body;
    try {
        const employee = await Employee.findOne({ email });
        if(!employee){
            return res.status(422).json({error: "employee not found"});
        }
        const token = crypto.randomBytes(20).toString('hex');
        employee.resetPasswordToken = token;
        employee.resetPasswordExpires = new Date(Date.now() + 3600000);
        await employee.save();
        const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                Please click on the following link, or paste this into your browser to complete the process:\n\n
                http://localhost:3300/api/employee/reset_password/${token}\n\n
                If you did not request this, please ignore this email and your password will remain unchanged.\n`;
        
        await sendEmail(employee.email, 'Password Reset', message);
        res.status(200).json({ message: 'Recovery email sent' });
    } catch (error) { 
      console.error('Error: ', error); 
      res.status(500).json({ error: 'Internal server error' });
    }
}

// routes to reset password 
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
      const employee = await Employee.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!employee) {
        return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      employee.password = hashedPassword;
      employee.resetPasswordToken = undefined;
      employee.resetPasswordExpires = undefined;
      await employee.save();
      res.status(200).json({ message: 'Password has been reset' });
    } catch (err) {
      console.error('Error: ', err);
      res.status(500).json({ error: 'Internal server error' });
    }
}

// routes to change the password
const changePassword= async(req,res)=>{
    const validation = ChangePasswordRequestSchema.safeParse(req.body)
    if (validation.error) {
        return res.json(validation.error)
    }
    const {email,old_password,new_password} = req.body;
    try {
        const employee =await Employee.findOne({email});
        if(!employee){
            return res.status(422).json({error: "employee not found"});
        }
        const isMatch = await bcrypt.compare(old_password, employee.password);
        if (!isMatch) {
        return res.status(422).json({ error: "Invalid old password" });
        }
        const hashedNewPassword = await bcrypt.hash(new_password, 12);
        employee.password= hashedNewPassword;
        await employee.save();
        return res.status(200).json({message: "password change successfully"});
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateProfile = async(req, res)=>{
    const validation = UpdateProfileRequestSchema.safeParse(req.body);
    if (validation.error) {
        return res.json(validation.error)
    }
    const {name,email, department , mobile_number} = req.body;
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.employee.id, 
            { name, email, department, mobile_number },
            { new: true } 
        );
        if (!updatedEmployee) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedEmployee);
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).json({ error: 'Internal server error' });
    }
}

const logOut = async(req,res)=>{
    // for log out we need to remove the token from the localstorage and this is done by the frontend part
    res.status(200).send({ message: 'Logged out successfully' });
}


module.exports = {signIn , signUp , forgotPassword, resetPassword , changePassword, updateProfile , logOut }