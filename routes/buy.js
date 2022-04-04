const express = require("express");
const check = require("../controllers/check");
var bodyParser = require("body-parser");
const router = express.Router();
var jsonParser = bodyParser.json();
const userData = require("../models/userData");

router.get("/", jsonParser, check, async (req, res) => {
  try {
    const current = req.user[0];
    const user = await userData.findOne({ name: req.user[0].name });
    return res.render("orders.ejs", {
      login: false,
      signup: false,
      logout: true,
      user: req.user === null ? "" : req.user[0].name,
      dp: current.dp,
      orders: user.order,
    });
  } catch {
    return res.status(400).send("error");
  }
});

router.post("/:id", jsonParser, check, async (req, res) => {
  if (req.body.delete) {
    try {
      const orders = req.user[0].order;
      const item = orders.find((e) => e.id === req.params.id);

      await userData.updateOne(
        { name: req.user[0].name },
        { $pull: { order: { _id: item._id } } }
      );
    } catch (e) {
      return res.status(400).send(e.message);
    }
    return res.redirect("/users/orders");
  }

  try {
    const current = req.user[0];
    const cart = current.cart;
    await userData.updateOne(
      { name: current.name },
      { $set: { cart: [] }, $push: { order: cart } }
    );
    return res.redirect("/users/orders");
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

module.exports = router;
