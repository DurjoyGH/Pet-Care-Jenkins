const mongoose = require("mongoose");
const DISTRICTS = require("../config/districts");

const petSchema = new mongoose.Schema(
  {
    petType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    weight: {
      type: Number,
      required: true,
      min: 0.1,
    },
    color: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    district: {
      type: String,
      required: true,
      enum: DISTRICTS,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 600,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: {
      type: [String],
      required: true,
      validate: [(val) => val.length >= 3 && val.length <= 5, "Images count invalid"],
    },
    status: {
      type: String,
      enum: ["available", "adopted"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pet", petSchema);
