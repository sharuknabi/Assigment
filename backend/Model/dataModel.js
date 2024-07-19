const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
    },
    timeOrderPreserved: {
      type: String,
      required: true,
    },
    groundTruthSource: {
      type: String,
      required: true,
    },
    negativeAssesed: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    manuallyCurated: {
      type: String,
      required: true,
    },
    sourceDataNature: {
      type: String,
      required: true,
    },
    entityGranulaty: {
      type: String,
      required: true,
    },
    action: {
      type: String,
    },
    admin: {
      isAdmin: {
        type: Boolean,
        default: false,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

const DataModel = mongoose.model("Data", dataSchema);

module.exports = DataModel;
