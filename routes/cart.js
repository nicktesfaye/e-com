const express = require("express");
const authenticateUser = require("../controllers/auth");
const check = require("../controllers/check");
var bodyParser = require("body-parser");
const router = express.Router();
var jsonParser = bodyParser.json();
const userData = require("../models/userData");
const productData = require("../models/products");

router.get("/", jsonParser, authenticateUser, check, async (req, res) => {
  try {
    const current = req.user[0];
    const user = await userData.findOne({ name: req.user[0].name });
    return res.render("cart.ejs", {
      login: false,
      signup: false,
      logout: true,
      user: req.user === null ? "" : req.user[0].name,
      dp: current.dp,
      cart: user.cart,
    });
  } catch {
    return res.status(400).send("error");
  }
});

router.post("/:id", jsonParser, check, async (req, res) => {
  try {
    const U = await userData.findOne({ name: req.user[0].name });
    if (U) {
      const cart = U.cart;
      const product = await productData.findOne({ _id: req.params.id });

      if (product) {
        let item = cart.find((e) => e.item === product.name);

        if (req.body.delete) {
          try {
            await userData.updateOne(
              { name: req.user[0].name },
              { $pull: { cart: { item: item.item } } }
            );
          } catch (e) {
            return res.status(400).send(e.message);
          }
        } else {
          if (item == null) res.status(400).send("product not found!!!");
          else {
            await userData.updateOne(
              { name: req.user[0].name, "cart.item": item.item },
              { $set: { "cart.$.quantity": req.body.quantity } }
            );
          }
        }
      } else {
        res.status(400).send("product not found!!!");
      }
    } else res.status(400).send("user not found!!!");
  } catch (e) {
    return res.status(400).send(e.message);
  }

  res.redirect("/users/cart");
});

module.exports = router;
