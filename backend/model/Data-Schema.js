const mongoose = require("mongoose");
const { Schema } = mongoose;

const dataSchema = new Schema(
  {
    SNo: {
      type: Number,
      required: true,
      unique: true,
    },
    Year: {
      type: Number,
      required: true,
    },
    DATASET: {
      type: String,
      trim: true,
      required: true,
    },
    Discription: {
      type: String,
      trim: true,
      required: true,
    },
    KindOfTraffic: {
      type: String,
      trim: true,
      required: true,
    },
    PublicallyAvailable: {
      type: String,
      trim: true,
      required: true,
    },
    Count: {
      type: Schema.Types.Mixed,
      required: true,
    },
    FeatureCount: {
      type: Schema.Types.Mixed,
      required: true,
    },
    DOI: {
      type: Schema.Types.Mixed, // This allows both strings and numbers
      required: true,
    },
    DownloadLinks: {
      type: String,
      trim: true,
      required: true,
    },
    Action: {
      type: Boolean,
    },

    approved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const DataModel = mongoose.model("Data", dataSchema);

module.exports = DataModel;
