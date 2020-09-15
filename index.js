const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("config");
const Joi = require("@hapi/joi");

const app = express();

const userinfo = require("./routes/api/userinfo");
const auth = require("./routes/api/auth");
const dresses = require("./routes/api/dresses");
const vendorportal = require("./routes/api/vendorportal");
const designerportal = require("./routes/api/designerportal");

const wishlist = require("./routes/api/wishlist");
const cart = require("./routes/api/cart");
const orders = require("./routes/api/order");
const cards = require("./routes/api/paycard");
const vendorauth = require("./routes/api/vendorauth");
const designerauth = require("./routes/api/designerauth");
const destoven = require("./routes/api/service");
const trending = require("./routes/api/trending");

const ngrok = require("ngrok");
const user = "laxman";
const password = "ironman3";

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//file upload static
app.use(express.static("uploads"));
app.use(express.static("dressuploads"));
// app.use(express.static("vendoruploads"));

//DB config

//Connect to MongoDB
mongoose.set("useFindAndModify", false);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost:27017/furniture", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }) // only in development environment
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB....", err));

// Use Routes
app.use("/api/userinfo", userinfo);
app.use("/api/auth", auth);
app.use("/api/dresses", dresses);
app.use("/api/vendorportal", vendorportal);
app.use("/api/cart", cart);
app.use("/api/wishlist", wishlist);
app.use("/api/designerportal", designerportal);
app.use("/api/orders", orders);
app.use("/api/cards", cards);
app.use("/api/vendorauth", vendorauth);
app.use("/api/designerauth", designerauth);
app.use("/api/destoven", destoven);
// const trending = require("./routes/api/trending");
app.use("/api/trending", trending);

//wishlist and cart

const port = process.env.PORT || 5005;

app.listen(port, () => console.log(`Server up and running on port ${port}`));

ngrok.connect(
  {
    proto: "http",
    addr: `${port}`,
    auth: `${user}:${password}`,
  },
  (err, url) => {
    if (err) {
      console.error("Error while connecting Ngrok", err);
      return new Error("Ngrok Failed");
    } else {
      console.log("Tunnel Created -> ", url);
      console.log("Tunnel Inspector ->  http://127.0.0.1:4040");
    }
  }
);
