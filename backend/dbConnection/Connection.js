// const dbConnection =
//   "mongodb+srv://sharuknabi6:3CPFCPhQIQJwyIJc@cluster0.rsufcoy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Replace with your MongoDB connection string
    const mongoURI =
      "mongodb+srv://sharuknabi6:3CPFCPhQIQJwyIJc@cluster0.rsufcoy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   useCreateIndex: true, // To handle deprecation warnings for unique indexes
    });

    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
