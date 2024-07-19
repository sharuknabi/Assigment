const DataModel = require("../Model/dataModel");

// POST: Create new data entry
exports.createData = async (req, res) => {
  try {
    const newData = new DataModel(req.body);
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//GET: get all data

exports.getData = async (req, res) => {
  try {
    const data = await DataModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SEARCH: Search data entries by all fields  data/search
exports.searchData = async (req, res) => {
  try {
    const query = {};
    for (const key in req.query) {
      if (req.query[key]) {
        if (key === "id") {
          query[key] = req.query[key];
        } else {
          query[key] = new RegExp(req.query[key], "i");
        }
      }
    }
    const data = await DataModel.find(query);
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
