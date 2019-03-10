const mongoose = require('mongoose');

const Rental = mongoose.model('Rental', new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    max: [128, 'Title may not exceed 128 characters.']
  },
  street: {
    type: String,
    required: true,
    min: [4, 'Street must be at least four characters.']
  },
  city: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    lowercase: true
  },
  bedrooms: Number,
  shared: Boolean,
  description: {
    type: String,
    required: true
  },
  dailyRate: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }]
}));

module.exports = Rental;

