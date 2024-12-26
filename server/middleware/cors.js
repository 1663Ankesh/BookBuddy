const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

function corsMiddleware(app) {
  const allowedOrigins = [
    "http://localhost:3000",
    `${process.env.REACT_APP_Front_End}`,
    `${process.env.REACT_APP_Host_Api}`,
  ];
  app.use(
    cors({
      origin: allowedOrigins,
      methods: "GET,PUT,POST,DELETE",
      credentials: true,
      optionsSuccessStatus: 204,
    })
  );

  app.use(express.json());
  app.use(cookieParser());
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
  app.use(express.static(path.join(__dirname, "../../client/build")));
}

module.exports = corsMiddleware;
