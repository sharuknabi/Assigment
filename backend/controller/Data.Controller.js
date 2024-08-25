const DataModel = require("../model/Data-Schema");

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
      const searchTermAsNumber = parseFloat(searchTerm);

      query.$or = [
        // String fields
        { DATASET: new RegExp(searchTerm, "i") },
        { Discription: new RegExp(searchTerm, "i") },
        { KindOfTraffic: new RegExp(searchTerm, "i") },
        { PublicallyAvailable: new RegExp(searchTerm, "i") },
        { DOI: new RegExp(searchTerm, "i") },
        { DownloadLinks: new RegExp(searchTerm, "i") },
        // Number fields (only include if searchTermAsNumber is a valid number)
        ...(isNaN(searchTermAsNumber)
          ? []
          : [
              { SNo: searchTermAsNumber },
              { Year: searchTermAsNumber },
              { Count: searchTermAsNumber },
              { FeatureCount: searchTermAsNumber },
            ]),
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
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
  try {
    // Filter for approved data
    const query = { approved: true };

    // Fetch paginated data with the approved filter
    const data = await DataModel.find(query) // Apply filter here
      .limit(parseInt(limit)) // Convert limit to integer
      .skip((parseInt(page) - 1) * parseInt(limit)) // Convert page to integer and calculate skip
      .exec();

    // Count documents that match the filter
    const count = await DataModel.countDocuments(query); // Count with filter

    // Respond with paginated data
    res.json({
      data,
      totalPages: Math.ceil(count / parseInt(limit)), // Calculate total pages
      currentPage: parseInt(page), // Send current page number
    });
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: err.message });
  }
};

// exports.paginateData = async (req, res) => {
//   const { page = 1, limit = 10 } = req.query;
//   try {
//     const query = { approved: true };
//     const data = await DataModel.find()
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .exec();
//     const count = await DataModel.countDocuments();
//     res.json({
//       data,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

//api to get data based upon approval
// exports.getData = async (req, res) => {
//   console.log(`Authenticated User: ${req.user}`);
//   try {
//     // Always include the condition to filter for approved data
//     const query = { approved: true };

//     // Find data entries that match the query
//     const data = await DataModel.find(query);
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.duplicate = async (req, res) => {
  try {
    const { SNo } = req.query;
    const existingEntry = await DataModel.findOne({ SNo });
    if (existingEntry) {
      return res.json({ exists: true });
    }
    res.json({ exists: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
