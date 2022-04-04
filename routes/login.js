//require
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const userData = require("../models/userData");
const bcrypt = require("bcrypt");
const check = require("../controllers/check");

//use
const router = express.Router();
const jsonParser = bodyParser.json();

//create new token for log in
const newToken = (User) => {
  return jwt.sign(User, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

//refresh token to stay logged in
const refreshToken = (USer) => {
  return jwt.sign(User, process.env.REFRESH_TOKEN_SECRET);
};

// localhost:3000/login page
router.get("/", (req, res) => {
  //login page
  if (req.user != null) return res.redirect("/users/home");

  return res.render("login.ejs", {
    login: false,
    signup: true,
    logout: false,
    user: null,
    dp: "",
    name: "",
    password: "",
    a: "",
    b: "",
  });
});

//submission of login data
router.post("/", jsonParser, async (req, res) => {
  let name = "",
    password = "";
  //authenticate user
  const username = req.body.name;

  try {
    const user = await userData.findOne({ name: username });

    //username wrong
    if (user == null) {
      name = "user not registered";
      return res.render("login.ejs", {
        login: false,
        signup: true,
        logout: false,
        user: null,
        dp: "",
        name: name,
        password: password,
        a: req.body.name,
        b: req.body.password,
      });
    } else {
      try {
        if (await bcrypt.compare(req.body.password, user.password)) {
          name = "";
          password = "";

          //jwt
          res.cookie("jwt", newToken({ name: username }), { httpOnly: true });
          return res.redirect("/users/home");
        }

        //password wrong
        else {
          password = "password is incorrect";
          return res.render("login.ejs", {
            login: false,
            signup: true,
            logout: false,
            user: null,
            dp: "",
            name: name,
            password: password,
            a: req.body.name,
            b: req.body.password,
          });
        }
      } catch {
        //other errors
        return res.status(400).send("error");
      }
    }
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

//exports
module.exports = router;
