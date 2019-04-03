const mongoose = require('mongoose'),
      Joi = require('joi');

const Rental = mongoose.model('Rental', new mongoose.Schema({
  category: {
    type: String,
    required: true,
    lowercase: true
  },
  title: {
    type: String,
    required: true,
    min: [1, 'Title must be at least one character.'],
    max: [128, 'Title may not exceed 128 characters.']
  },
  description: {
    type: String,
    required: true
  },
  rating: Number,
  image: {
    type: String,
    required: true
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
  bedrooms: Number,
  dailyRate: Number,
  shared: Boolean,
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

function validatePost(rental) {
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

function validatePatch(rental) {
  const schema = {
    title: Joi.string().min(1).max(128),
    street: Joi.string().min(4),
    city: Joi.string(),
    category: Joi.string(),
    bedrooms: Joi.number(),
    shared: Joi.boolean(),
    description: Joi.string(),
    dailyRate: Joi.number()
  };

  return Joi.validate(rental, schema);
}

module.exports = { Rental, validatePost, validatePatch };

