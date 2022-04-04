const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//function to authenticate user
module.exports = function (req, res, next) {
  const cookie = req.cookies;
  if (cookie.jwt == null) return res.redirect("/login");
  else {
    jwt.verify(cookie.jwt, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log("error:" + err.message);
        return res.redirect("/login");
      } else {
        req.user = user;
        next();
      }
    });
  }
};
