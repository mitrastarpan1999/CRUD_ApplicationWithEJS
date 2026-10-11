const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    position: {
      type: String,
      required: [true, "Position is required"],
      default: "Software developer",
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },

    image: {
      type: String,
      default:
        "https://img.magnific.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80",
    },

    description: {
      type: String,
      default: "The user has not written any description.",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    publicImageID: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
