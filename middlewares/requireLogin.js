require('dotenv').config();
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const secretKey = process.env.JWT_SECRET_KEY;

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in" });
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, secretKey, async(err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You must be logged in" });
        }
        try {
            const { _id } = payload;
            const employeeData = await Employee.findById(_id);
            if (!employeeData) {
                return res.status(404).json({ error: "Employee not found" });
            }
            req.employee = employeeData;
            next();
        } catch (err) {
            res.status(500).json({ error: "Server error", details: err.message });
        }
    });
};