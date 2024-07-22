const express = require("express");
const cors = require("cors");
const connectDB = require("./dbConnection/Connection");
const router = require("./Routes/route");

const app = express();

// CORS options
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions)); // Apply CORS middleware

connectDB(); // Connect to the database

app.use(express.json()); // Middleware to parse JSON

// Use the data routes
app.use("/data", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
