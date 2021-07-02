const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const authjwt = require("./helpers/token");
const errorHandler = require("./helpers/error-handlers");
// so u can use user.id not user._id
app.use(cors());
app.options("*", cors());
// ------------------------------------------------------------------
//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authjwt());
app.use(errorHandler);
// ------------------------------------------------------------------
//Routes
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");
// ------------------------------------------------------------------
const api = process.env.API_URL;
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);
// ------------------------------------------------------------------
// Online Database Atlas
// mongoose
//   .connect(process.env.CONNECTION_STRING, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     dbName: "eshop-database",
//   })
//   .then(() => {
//     console.log("Database Connection is ready...");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// ------------------------------------------------------------------
// localhost Database
mongoose
  .connect("mongodb://localhost:27017/eshop-database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connection done");
  })
  .catch((err) => {
    console.log("error in connection ");
    console.log(err);
  });
// ------------------------------------------------------------------
//Server
app.listen(3000, () => {
  console.log("server is running http://localhost:3000");
});
