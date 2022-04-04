const express = require("express");
var bodyParser = require("body-parser");
const router = express.Router();
var jsonParser = bodyParser.json();
const check = require("../controllers/check");

router.get("/", jsonParser, check, (req, res) => {
  //home page with username
  if (req.user != null) return res.redirect("/users/home");
  else
    return res.render("index.ejs", {
      login: true,
      signup: true,
      logout: false,
      user: "",
      dp: "",
    });
});

module.exports = router;
