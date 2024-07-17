const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

//enable cors
app.use(cors());

//serve static files from folser staticData
app.use(express.static(path.join(__dirname, "StaticData")));

// Route to fetch the static data
app.get("/api/data", (req, res) => {
  res.sendFile(path.join(__dirname, "StaticData", "data.json"));
});

const PORT = 3000;
app.listen(PORT, () => console.log("Server started on port 3000"));
