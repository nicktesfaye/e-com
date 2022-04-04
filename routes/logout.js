const express = require("express");
var bodyParser = require("body-parser");
const router = express.Router();
var jsonParser = bodyParser.json();

router.get("/", jsonParser, (req, res) => {
  res.cookie("jwt", " ", { expiresIn: "1s" });
  return res.redirect("/home");
});

module.exports = router;
