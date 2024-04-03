const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  })
    .then(() => console.log("Connected to Database "))
    .catch((error) => console.log(`Not connected to Database Check Your Network Connection OR Troubleshoot Your Server\nError: ${error}`));
};

module.exports = connectDB;
