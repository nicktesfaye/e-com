//require
const express = require("express");
var bodyParser = require("body-parser");
const userData = require("../models/userData");
const check = require("../controllers/check");

//use
const router = express.Router();
var jsonParser = bodyParser.json();

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

// localhost:3000/signup page
router.get("/", check, (req, res) => {
  if (req.user) return res.redirect("/users/home");
  else
    return res.render("signUp.ejs", {
      login: true,
      signup: false,
      logout: false,
      user: null,
      dp: "",
      errors: { name: "", password: "" },
      a: "",
      b: "",
    });
});

//submission of signup data
router.post("/", jsonParser, async (req, res) => {
  //upload signup data to server
  try {
    const user = new userData({
      name: req.body.name,
      password: req.body.password,
    });
    await user.save();
    return res.redirect("/login");
  } catch (e) {
    const errors = errorHandler(e);
    return res.render("signUp.ejs", {
      login: true,
      signup: false,
      logout: false,
      user: null,
      dp: "",
      errors: errors,
      a: req.body.name,
      b: req.body.password,
    });
  }
});

//export
module.exports = router;
