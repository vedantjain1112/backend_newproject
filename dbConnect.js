const mongoose = require("mongoose");

module.exports = async () => {
  const mongoUri =
    "mongodb+srv://jainvedant1211:vedant12321@cluster0.9xidsa1.mongodb.net/my_db";
  try {
    const connect = await mongoose.connect(mongoUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (e) {
    console.log("Error occurred", e);
    process.exit(1);
  }
};
