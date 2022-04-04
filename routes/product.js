const express = require("express");
const check = require("../controllers/check");
var bodyParser = require("body-parser");
const router = express.Router();
var jsonParser = bodyParser.json();
const productData = require("../models/products");
const userData = require("../models/userData");

router.get("/:id", jsonParser, check, async (req, res) => {
  try {
    const product = await productData.findOne({ _id: req.params.id });
    const current = req.user[0];

    //random discount for all products
    // const products=await productData.find();
    // products.forEach(async product=>{
    //     await productData.updateOne({name:product.name},{$set: {discount: (Math.floor(Math.random()*30))}});
    // });

    res.render("productView.ejs", {
      login: false,
      signup: false,
      logout: true,
      user: req.user === null ? "" : req.user[0].name,
      dp: current.dp,
      product: product,
      id: req.params.id,
    });
  } catch (e) {
    return res.status(400).send(e.message);
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
        if (item == null)
          await userData.updateOne(
            { name: req.user[0].name },
            {
              $push: {
                cart: {
                  item: product.name,
                  id: product.id,
                  quantity: req.body.quantity,
                  price: product.price,
                  dis: product.discount,
                  path: product.path,
                },
              },
            }
          );
        else {
          const Q = item.quantity;
          if (parseInt(Q) + parseInt(req.body.quantity) <= 5)
            await userData.updateOne(
              { name: req.user[0].name, "cart.item": item.item },
              {
                $set: {
                  "cart.$.quantity": parseInt(Q) + parseInt(req.body.quantity),
                },
              }
            );
          else if (parseInt(Q) + parseInt(req.body.quantity) > 5)
            await userData.updateOne(
              { name: req.user[0].name, "cart.item": item.item },
              { $set: { "cart.$.quantity": 5 } }
            );
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
