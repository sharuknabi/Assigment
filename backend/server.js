const express = require("express");
// const path = require("path");
// const cors = require("cors");
const connectDB = require("./DbConnection/db");
const mongoose = require("mongoose");
const router = require("./Routes/route");

const app = express();
connectDB();

// Connect to the database
connectDB();

app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// Use the data routes
app.use("/data", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//enable cors
// app.use(cors());

// //serve static files from folser staticData
// app.use(express.static(path.join(__dirname, "StaticData")));

// // Route to fetch the static data
// app.get("/api/data", (req, res) => {
//   res.sendFile(path.join(__dirname, "StaticData", "data.json"));
// });

// const PORT = 3000;
// app.listen(PORT, () => console.log("Server started on port 3000"));
