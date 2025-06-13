const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');

const usersUnprotectedRouter = require("./routes/usersUnprotected");
const usersProtectedRouter = require("./routes/usersProtected");
const postsRouter = require("./routes/posts");
const authenticationRouter = require("./routes/authentication");
const tokenChecker = require("./middleware/tokenChecker");

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());


// API Routes
app.use("/users", express.json(), usersUnprotectedRouter); 
app.use("/users", express.json(), tokenChecker, usersProtectedRouter); 
app.use("/posts", tokenChecker, postsRouter); 
app.use("/tokens", express.json(), authenticationRouter); 

// 404 Handler
app.use((_req, res) => {
  console.log(_req);
  res.status(404).json({ err: "Error 404: Not Found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  if (process.env.NODE_ENV === "development") {
    res.status(500).send(err.message);
  } else {
    res.status(500).json({ err: "Something went wrong" });
  }
});

module.exports = app;
