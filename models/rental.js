const mongoose = require('mongoose'),
      Joi = require('joi');

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

function validate(rental) {
  const schema = {
    image: Joi.required(),
    title: Joi.string().required().max(128),
    street: Joi.string().required().min(4),
    city: Joi.string().required(),
    category: Joi.string().required(),
    bedrooms: Joi.number(),
    shared: Joi.boolean(),
    description: Joi.string().required(),
    dailyRate: Joi.number()
  };

  return Joi.validate(rental, schema);
}

module.exports = { Rental, validate };

