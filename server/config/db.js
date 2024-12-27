const mongoose = require("mongoose");

const mongodb_url = process.env.mongodb_url;

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

const connectDatabase = () => {
  mongoose
    .connect(mongodb_url, clientOptions)
    .then(() => {
      console.log("Connected to Mongo");
    })
    .catch((e) => {
      console.log("Database connection Error ", e);
    });
};

module.exports = connectDatabase;
