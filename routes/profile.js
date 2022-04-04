const express = require("express");
var bodyParser = require("body-parser");
const router = express.Router();
var jsonParser = bodyParser.json();
const check = require("../controllers/check");
const userData = require("../models/userData");

router.get("/", jsonParser, check, async (req, res) => {
  //change username or password
  if (req.user == null) return res.redirect("/users/home");
  else {
    try {
      const user = await userData.findOne({ name: req.user[0].name });
      const current = req.user[0];
      return res.render("profile.ejs", {
        login: false,
        signup: false,
        logout: true,
        user: user,
        dp: current.dp,
        newName: null,
        userName: null,
        password: null,
      });
    } catch (e) {
      return res.status(400).send(e.message);
    }
  }
});

module.exports = router;
