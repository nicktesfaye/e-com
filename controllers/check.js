const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userData = require("../models/userData");
app.use(cookieParser());

//function to check if user is still logged in
module.exports = function (req, res, next) {
  const cookie = req.cookies;
  if (cookie.jwt == null) {
    req.user = null;
    next();
  } else {
    jwt.verify(
      cookie.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, User) => {
        if (err) {
          if (err.message != "jwt malformed")
            console.log("error lolo:" + err.message);
          req.user = null;
          next();
        } else {
          let user = await userData.find({ name: User.name });
          req.user = user;
          next();
        }
      }
    );
  }
};
