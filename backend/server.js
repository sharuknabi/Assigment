require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./dbConnection/Connection");
const router = require("./Routes/route");
const UserRoute = require("./Routes/User-route");
const path = require("path");

const app = express();

app.use(express.json());
const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../client/dist");
app.use(express.static(buildPath));

// CORS options
const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions)); // Apply CORS middleware

connectDB(); // Connect to the database

app.use(express.json()); // Middleware to parse JSON

// Use the data routes
app.use("/data", router);
app.use("/api/user", UserRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
