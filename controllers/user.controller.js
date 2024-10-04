require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const secretKey = process.env.JWT_SECRET_KEY;

// routes to initialize the database
const initializeUser = async (_, res) => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    const users = response.data;
    console.log(users);
    for (let user of users) {
      await User.create(user);
    }
    res.status(200).json({ message: "Users initialized successfully" });
  } catch (error) {
    console.error("Error initializing users:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// routes to login user
const signIn = (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(422).json({ error: "please enter valid email" });
    }
    User.findOne({ email: email }).then((saveduser) => {
      if (!saveduser) {
        return res.status(422).json({ error: "invalid email" });
      }
      const payload = {
        user: {
          id: saveduser.id,
          email: saveduser.email,
        },
      };
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
      return res.status(200).json({
        message: "Login successful",
        token: token,
        user: {
          id: saveduser.id,
          email: saveduser.email,
          name: saveduser.name,
        },
      });
    });
  } catch (error) {
    console.error("error while sign in", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// routes to get the user of the different company
const getCompanyuser = async (req, res) => {
  const { companyName } = req.body;
  try {
    const users = await User.find({ "company.name": companyName }).select(
      "name"
    );
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found for the company" });
    }
    const userNames = users.map((user) => user.name);
    res.status(200).json({ users: userNames });
  } catch (error) {
    console.error("Error fetching users by company:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  initializeUser,
  signIn,
  getCompanyuser,
};
