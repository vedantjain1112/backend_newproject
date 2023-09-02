const mongoose = require("mongoose");
const dotenv = require("dotenv");

module.exports = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (e) {
    console.log("Error occurred", e);
    process.exit(1);
  }
};
