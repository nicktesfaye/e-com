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

  return res.render("changeName.ejs", {
    login: false,
    signup: false,
    logout: true,
    user: current.name,
    dp: current.dp,
    newName: null,
    userName: null,
    password: null,
  });
});

router.post("/", jsonParser, check, async (req, res, next) => {
  if (req.user === null) {
    res.redirect("/users/home");
    next();
  }

  let newNname = "",
    password = "",
    userName = "";

  try {
    var user = await userData.findOne({ name: req.body.userName });
    const current = req.user[0];
    if (user == null) {
      userName = "invalid username";
      return res.render("changeName.ejs", {
        login: false,
        signup: false,
        logout: true,
        user: req.body.userName,
        dp: current.dp,
        newName: newNname,
        userName: userName,
        password: password,
      });
    } else {
      try {
        if (await bcrypt.compare(req.body.password, user.password)) {
          try {
            await userData.updateOne(
              { name: user.name },
              { $set: { name: req.body.newName } }
            );
            password = "Successfully Changed Username";
            user = await userData.findOne({ name: req.body.newName });
            req.user = user;
            return res.redirect("/logout");
          } catch (e) {
            const errors = errorHandler(e);
            return res.render("changeName.ejs", {
              login: true,
              signup: false,
              logout: false,
              user: user.name,
              dp: current.dp,
              newName: errors.name,
              userName: userName,
              password: errors.password,
            });
          }
        }

        //password wrong
        else {
          password = "password is incorrect";
          return res.render("changeName.ejs", {
            login: false,
            signup: false,
            logout: true,
            user: user.name,
            dp: current.dp,
            newName: newNname,
            userName: userName,
            password: password,
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
