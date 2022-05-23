const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
   

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    //taking token after login which is stored in the cookie and verifying it using jwt
    //after decoding it will return the uid of current logged in user as while creating token we have sent _id as data
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    //storing curr users all data in req.user by passing the decoded id to the userModel and the it returns all users data
    req.user = await userModel.findById(decoded._id);

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
