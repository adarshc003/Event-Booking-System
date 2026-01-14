const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    location: String,
    category: String,

    eventDateTime: {
      type: Date,
      required: true,
    },
       price: {
  type: Number,
  required: true
},

    expiryDateTime: {
      type: Date,
      required: true,
    },

    seatsAvailable: {
      type: Number,
      required: true,
    },
 

  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
