//setup
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const url = "mongodb://localhost/e-com";
const cookieParser = require("cookie-parser");

//connect to mongodb
mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => app.listen(3000))
  .catch((err) => console.log(err.message));
const con = mongoose.connection;
con.on("open", () => {
  console.log("connected...");
});

//local setup
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
//middleware
app.use(cookieParser());
app.use(express.json());
app.use("/products", express.static("products"));
app.use("/profiles", express.static("profiles"));
app.use("/js", express.static("views/js"));
app.use("/public", express.static("public"));

//routes
const login = require("./routes/login");
const signUp = require("./routes/signUp");
const home = require("./routes/home");
const userHome = require("./routes/userHome");
const logout = require("./routes/logout");
const profile = require("./routes/profile");
const changeUsername = require("./routes/changeUsername");
const changePassword = require("./routes/changePassword");
const getPic = require("./routes/getPic");
const changeEmail = require("./routes/changeEmail");
const changename = require("./routes/changename");
const product = require("./routes/product");
const cart = require("./routes/cart");
const search = require("./routes/search");
const buy = require("./routes/buy");

//route mappings
app.use("/login", login);
app.use("/signup", signUp);
app.use("/home", home);
app.use("/users/home", userHome);
app.use("/logout", logout);
app.use("/users/profile", profile);
app.use("/users/changeUsername", changeUsername);
app.use("/users/changePassword", changePassword);
app.use("/users/getPic", getPic);
app.use("/users/changeEmail", changeEmail);
app.use("/users/changename", changename);
app.use("/users/products", product);
app.use("/users/cart", cart);
app.use("/users/search", search);
app.use("/users/orders", buy);
app.get("*", (req, res) => {
  res.redirect("/home");
});
