const express = require("express");
const authenticateUser = require("../controllers/auth");
const check = require("../controllers/check");
var bodyParser = require("body-parser");
const router = express.Router();
var jsonParser = bodyParser.json();
const productData = require("../models/products");

const randomProducts = async (products) => {
  try {
    let count = await productData.count();
    let arr = [];
    let res = [];
    arr.push(Math.floor(Math.random() * count));
    while (arr.length < 12) {
      var index = Math.floor(Math.random() * count);
      var found = arr.find(function (element) {
        return element === index;
      });
      if (found === undefined) {
        arr.push(index);
      }
    }

    for (var i in arr) {
      res.push(products[arr[i]]);
    }
    return res;
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

router.get("/", jsonParser, authenticateUser, check, async (req, res) => {
  try {
    const products = await productData.find();
    const random = await randomProducts(products);
    const current = req.user[0];
    return res.render("usersHome.ejs", {
      login: false,
      signup: false,
      logout: true,
      user: req.user === null ? "" : req.user[0].name,
      dp: current.dp,
      products: random,
    });
  } catch {
    return res.status(400).send("error");
  }
});

module.exports = router;
