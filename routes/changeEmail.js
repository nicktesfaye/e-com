const express = require("express");
var bodyParser = require("body-parser");
const router = express.Router();
var jsonParser = bodyParser.json();
const check = require("../controllers/check");
const userData = require("../models/userData");

router.get("/", jsonParser, check, async (req, res, next) => {
  if (req.user == null) return res.redirect("/users/home");
  else res.redirect("/users/profile");
});

router.post("/", jsonParser, check, async (req, res, next) => {
  //change email

  if (req.user == null) return res.redirect("/users/home");

  const current = req.user[0];
  try {
    await userData.updateOne(
      { name: current.name },
      { $set: { email: req.body.email } }
    );
    return res.redirect("/users/profile");
  } catch (e) {
    console.log(e.message);
    res.redirect("/users/profile");
  }
});

module.exports = router;
