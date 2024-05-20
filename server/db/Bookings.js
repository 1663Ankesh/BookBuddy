const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  bookid: {
    type: String,
    required: true,
    unique: true,
  },
  ownerid: {
    type: String,
    required: true,
  },
  buyerid: {
    type: String,
    required: true,
  },
  dateofbooking: {
    type: Date,
    required: true,
  },
  timeofbooking: {
    type: String,
    required: true,
  },
  dateofcancellation: {
    type: Date,
  },
  timeofcancellation: {
    type: String,
  },
});

module.exports = mongoose.model("bookings", bookingSchema);
