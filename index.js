const express = require("express");
require("dotenv").config({ path: ".env.example" });
require("express-async-errors");
const cors = require("cors");
const connectDB = require("./dbConnect");
const path = require("path");
// const { checkEnv4Production, checkEnv4Development } = require("./checkEnvVar");
// const apiErrorHandler = require("./utils/apiErrorHandler.js");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const app = express();

// Server Connection
const PORT = process.env.PORT;



// routes
const students = require("./routes/student")
const general = require("./routes/common")
const admin = require("./routes/admin.js")
const events = require("./routes/event.js")



// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(","),
  })
);
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
// routes configs
app.use("/", general)
app.use("/admin", admin)
app.use("/events", events)
app.use("/student", students);

// Middleware for handling unmatched routes
// ********************** General Error Handling **********************************************************//
// General error-handling middleware
// // instead of crashing the server sends an error message
app.use((err, req, res, next) => {
  if (err.status === 401) {
    // Unauthorized (protected route)
    console.log('This is a protected route')
    return res.status(401).send('This is a protected route.');
  } else if (err.status === 404) {
    // Not Found
    console.log('404 not found')
    return res.status(404).send('Not Found');
  } else if (err.status === 500) {
    // Internal Server Error
    console.error(err);
    return res.status(500).send('Internal Server Error');
  } else {
    // Custom application-specific error
    console.error(err);
    return res.status(500).send('Custom Error: ' + err.message);
  }
});
// app.use(apiErrorHandler);
//Connect to the database before listening
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("listening for requests PORT@", PORT);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to the database", err);
    process.exit(1);
  });
module.exports = app
