require('dotenv').config()
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const v1 =  require("./routes/v1")
const app = express();
const mongoose = require("mongoose");


// database connection
const DB = "mongodb://localhost/ecommerce";
mongoose.connect(DB);
mongoose.connection.on("connected", () => {
  console.log("db is connected ");
});
mongoose.connection.on("error", err => {
  console.error("db is failed connected  ");
});

// midelwares
app.use(cors());
app.use(express.json())
app.use(bodyparser.urlencoded({ extended: false }));

// routes

app.use('/api/user/', v1)
app.use('/api/products/', v1)


// error handle

app.use((req, res, next) => {
  var err = new Error(" not Found ");
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const error = err.message || " Error prossing your request ";
  res.status(status).send({ error });
});


app.listen(process.env.PORT, (req, res, next) => {
  console.log( `server is run at port ${process.env.PORT}`  );
});
