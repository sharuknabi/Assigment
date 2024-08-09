const jwt = require("jsonwebtoken");
const User = require("../model/User-Schema");
const DataModel = require("../model/Data-Schema");

const JWT_SECRET = process.env.JWT_SECRET;

// User login logic
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send("Invalid credentials");
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "3h" });
    console.log(`Generated Token: ${token}`);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all data (protected route)
exports.getData = async (req, res) => {
  console.log(`Authenticated User: ${req.user}`);
  try {
    // Remove the approval filter to get all data
    const data = await DataModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve data entry (admin route)
exports.approveData = async (req, res) => {
  console.log(`Approving data entry with ID: ${req.params.id}`);
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const dataEntry = await DataModel.findByIdAndUpdate(
      id,
      { approved: true, status: "approved" },
      { new: true }
    );

    if (!dataEntry) {
      return res.status(404).json({ message: "Data entry not found" });
    }

    res.json(dataEntry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject data entry (admin route)
exports.rejectData = async (req, res) => {
  try {
    const { id } = req.params;

    const dataEntry = await DataModel.findByIdAndUpdate(
      id,
      { status: "rejected" }, // Update the status
      { new: true }
    );

    if (!dataEntry) {
      return res.status(404).json({ message: "Data entry not found" });
    }

    res.json({ message: "Data entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
