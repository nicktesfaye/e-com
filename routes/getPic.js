const express = require("express");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const path = require("path");
const router = express.Router();
const check = require("../controllers/check");
const multer = require("multer");
const userData = require("../models/userData");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "profiles/");
  },
  filename: async (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filepath = `/${req.user[0].name}${ext}`;
    try {
      await userData.updateOne(
        { name: req.user[0].name },
        { $set: { dp: `/profiles/${req.user[0].name}${ext}` } }
      );
    } catch (e) {
      console.log(e.message);
    }
    cb(null, filepath);
  },
});

const upload = multer({ storage: storage });

router.get("/", jsonParser, check, (req, res) => {
  if (req.user == null) return res.redirect("/users/home");

  const current = req.user[0];
  return res.render("getPic.ejs", {
    login: false,
    signup: false,
    logout: true,
    user: current.name,
    dp: current.dp,
  });
});

router.post(
  "/",
  jsonParser,
  check,
  upload.single("inpFile"),
  async (req, res) => {
    try {
      if (req.file == null)
        await userData.updateOne(
          { name: req.user[0].name },
          { $set: { dp: "/public/dp.png" } }
        );
      return res.redirect("/users/home");
    } catch (e) {
      return res.status(400).send(e.message);
    }
  }
);

module.exports = router;
