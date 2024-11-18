const express = require("express");
const app = express();
require("dotenv").config()
const Router = require("./routes/RootRouter")
const Cors = require('cors')
const path = require("path")
require("./db_connection")

var WhiteList = ['https://ministore-b9nd.onrender.com', null];

var corsOption = {
  origin: function (origin, callback) {
    if (!origin || WhiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(express.json())
app.use(Cors(corsOption))
app.use(express.static(path.join(__dirname, 'build')))
app.use(express.static("./public"))
app.use("/public", express.static("./public"))

app.use("/api", Router)
app.use('*', express.static(path.join(__dirname, 'build')))

let PORT = process.env.PORT || 8000
app.listen(PORT, function () {
  console.log(`server is running at ${PORT}`)
})