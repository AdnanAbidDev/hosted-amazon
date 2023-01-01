const mongoose = require("mongoose");

DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => console.log("connection is successfully done"))
  .catch((error) => console.log("error" + error.message));
