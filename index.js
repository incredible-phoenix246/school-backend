// const express = require("express");
require("dotenv").config({ path: ".env.example" });
require("express-async-errors");
const cors = require("cors");
const connectDB = require("./dbConnect");
const path = require("path");
const { checkEnv4Production, checkEnv4Development } = require("./checkEnvVar");
const apiErrorHandler = require("./utils/apiErrorHandler.js");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");


// Server Connection
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV;


// routes 
const students = require("./routes/student")
const general = require("./routes/common")
const admin = require("./routes/admin.js")
const events = require("./routes/event.js")

const express = require('express')
const app = express()


// cors settings
app.use(cors())

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(apiErrorHandler);


// routes configs
app.use("/", general)
app.use("/admin", admin)
app.use("/events", events)
app.use("/student", students);

// // Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Middleware for handling unmatched routes
app.use((req, res, next) => {
  res.status(404).send({
    success: false,
    error: 404,
    method: req.method,
    message: `Endpoint not found. If you think something broken then please contact the developer.`,
  });
});



//Connect to the database before listening
connectDB(MONGO_URI)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Export the Express API
module.exports = app