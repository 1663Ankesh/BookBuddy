const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const Books = require("./models/Books");
const corsMiddleware = require("./middleware/cors");

const secretKey = process.env.secretKey;
const mongodb_url = process.env.mongodb_url;
const port = process.env.PORT || 5000;

corsMiddleware(app);

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

mongoose
  .connect(mongodb_url, clientOptions)
  .then(() => {
    console.log("Connected to Mongo");
  })
  .catch((e) => {
    console.log("Database connection Error ", e);
  });

const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

app.use("/api/user/", userRoutes);
app.use("/api/book", bookRoutes);

app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/favicon.ico"));
});

app.get("/api/", async (req, res) => {
  try {
    let result = await Books.find({ isbooked: false });
    result = result.reverse();

    res.status(200).json(result);
  } catch (e) {
    console.log(e);

    res.status(500).json({ error: "Server error" });
  }
});

app.get("/profile", (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, secretKey, {}, (err, info) => {
      if (err) {
        console.log(err);
        throw err;
      } else {
        res.status(200).json(info);
      }
    });
  } catch (e) {
    console.log(e);
    res.status(501).json({ error: "No token or Server Error" });
  }
});

app.post("/logout", async (req, res) => {
  try {
    res
      .cookie("token", " ", {
        sameSite: "None",
        secure: true,
        expire: new Date(0),
      })
      .status(200)
      .json("ok");
  } catch (e) {
    res.status(501).json({ error: "Server Error" });
  }
});

app.get("*", (req, res) => {
  const buildPath = path.resolve(__dirname, "./client/build", "index.html");
  if (fs.existsSync(buildPath)) {
    res.sendFile(buildPath);
  } else {
    console.error("Build folder is missing. Please redeploy.");
    res.status(500).send("Build folder is missing. Please redeploy.");
  }
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
