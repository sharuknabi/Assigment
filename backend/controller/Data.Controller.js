const DataModel = require("../model/Schema");

// POST: Create new data entry
exports.createData = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // Log incoming request body

    const newData = new DataModel(req.body);
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    console.error("Error saving data:", err); // Log the specific error message
    res.status(400).json({ message: err.message, error: err }); // Return detailed error information
  }
};

//GET: get all data
// exports.getData = async (req, res) => {
//   try {
//     const data = await DataModel.find();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// SEARCH: Search data entries by all fields  data/search
exports.searchData = async (req, res) => {
  try {
    console.log("Request query:", req.query); // Check the incoming request query
    const query = {};
    if (req.query.q) {
      const searchTerm = req.query.q;
      query.$or = [
        { name: new RegExp(searchTerm, "i") },
        { username: new RegExp(searchTerm, "i") },
        { timeOrderPreserved: new RegExp(searchTerm, "i") },
        { groundTruthSource: new RegExp(searchTerm, "i") },
        { negativeAssessed: new RegExp(searchTerm, "i") },
        { label: new RegExp(searchTerm, "i") },
        { manuallyCurated: new RegExp(searchTerm, "i") },
        { entityGranularity: new RegExp(searchTerm, "i") },
        { action: new RegExp(searchTerm, "i") },
        // Add other fields as needed
      ];
    }
    console.log("MongoDB query:", query); // Check the constructed MongoDB query
    const data = await DataModel.find(query);
    console.log("MongoDB data:", data); // Check the data retrieved from MongoDB
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PAGINATION: Get data entries with pagination  data/paginate
exports.paginateData = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const data = await DataModel.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await DataModel.countDocuments();
    res.json({
      data,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
