const express = require("express");
var bodyParser = require("body-parser");
const router = express.Router();
var jsonParser = bodyParser.json();
const check = require("../controllers/check");
const userData = require("../models/userData");
const bcrypt = require("bcrypt");

//custom error notification handler
const errorHandler = (e) => {
  let err = { name: "", password: "" };
  if (e.message.includes("userData validation failed")) {
    Object.values(e.errors).forEach(({ properties }) => {
      err[properties.path] = properties.message;
    });
  }

  if (e.code === 11000) {
    err["name"] = "Username already in use";
  }

  return err;
};

router.get("/", jsonParser, check, (req, res, next) => {
  //change username or password

  if (req.user == null) return res.redirect("/users/home");

  const current = req.user[0];

  return res.render("changePassword.ejs", {
    login: false,
    signup: false,
    logout: true,
    user: current.name,
    dp: current.dp,
    userName: null,
    password: null,
    newPassword: null,
  });
});

router.post("/", jsonParser, check, async (req, res, next) => {
  if (req.user === null) {
    res.redirect("/users/home");
    next();
  }

  let password = "",
    userName = "",
    newPassword = "";

  try {
    var user = await userData.findOne({ name: req.body.userName });
    const current = req.user[0];

    if (user == null) {
      userName = "invalid username";
      return res.render("changePassword.ejs", {
        login: false,
        signup: false,
        logout: true,
        user: req.body.userName,
        dp: current.dp,
        userName: userName,
        password: password,
        newPassword: newPassword,
      });
    } else {
      try {
        if (await bcrypt.compare(req.body.password, user.password)) {
          try {
            const password = await bcrypt.hash(req.body.newPassword, 10);
            await userData.updateOne(
              { name: user.name },
              { $set: { password: password } }
            );
            newPassword = "Successfully Changed Password";
            user = await userData.findOne({ name: req.body.userName });
            req.user = user;
            return res.render("changePassword.ejs", {
              login: true,
              signup: false,
              logout: false,
              user: user.name,
              dp: current.dp,
              userName: userName,
              password: "",
              newPassword: newPassword,
            });
          } catch (e) {
            const errors = errorHandler(e);
            return res.render("changePassword.ejs", {
              login: true,
              signup: false,
              logout: false,
              user: user.name,
              dp: current.dp,
              userName: userName,
              password: errors.password,
              newPassword: newPassword,
            });
          }
        }

        //password wrong
        else {
          password = "password is incorrect";
          return res.render("changePassword.ejs", {
            login: false,
            signup: false,
            logout: true,
            user: user.name,
            dp: current.dp,
            userName: userName,
            password: password,
            newPassword: newPassword,
          });
        }
      } catch (e) {
        //other errors
        return res.status(400).send(e.message);
      }
    }
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

module.exports = router;
