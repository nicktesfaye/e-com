const express = require("express");
const check = require("../controllers/check");
var bodyParser = require("body-parser");
const router = express.Router();
var jsonParser = bodyParser.json();
const productData = require("../models/products");

router.get("/", jsonParser, check, async (req, res) => {
  res.redirect("/home");
});

router.post("/", jsonParser, check, async (req, res) => {
  try {
    const products = await productData.find({
      name: { $regex: String(req.body.search), $options: "i" },
    });
    const current = req.user[0];
    return res.render("search.ejs", {
      login: false,
      signup: false,
      logout: true,
      user: req.user === null ? "" : req.user[0].name,
      dp: current.dp,
      products: products,
    });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

module.exports = router;
